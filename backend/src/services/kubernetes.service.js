import * as k8s from '@kubernetes/client-node';

class KubernetesService {
  constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();
    
    this.coreV1Api = this.kc.makeApiClient(k8s.CoreV1Api);
    this.appsV1Api = this.kc.makeApiClient(k8s.AppsV1Api);
  }

  async getClusterInfo() {
    try {
      const version = await this.coreV1Api.getAPIVersions();
      const nodes = await this.coreV1Api.listNode();
      const pods = await this.coreV1Api.listPodForAllNamespaces();
      const deployments = await this.appsV1Api.listDeploymentForAllNamespaces();
      const services = await this.coreV1Api.listServiceForAllNamespaces();

      return {
        version: version.body.versions[0],
        nodes: nodes.body.items.length,
        pods: pods.body.items.length,
        deployments: deployments.body.items.length,
        services: services.body.items.length,
        status: 'Connected'
      };
    } catch (error) {
      console.error('Failed to get cluster info:', error);
      throw error;
    }
  }

  async getPods() {
    try {
      const { body } = await this.coreV1Api.listPodForAllNamespaces();
      return body.items.map(pod => ({
        name: pod.metadata.name,
        namespace: pod.metadata.namespace,
        status: pod.status.phase,
        node: pod.spec.nodeName,
        age: this._calculateAge(pod.metadata.creationTimestamp)
      }));
    } catch (error) {
      console.error('Failed to get pods:', error);
      throw error;
    }
  }

  async getDeployments() {
    try {
      const { body } = await this.appsV1Api.listDeploymentForAllNamespaces();
      return body.items.map(deployment => ({
        name: deployment.metadata.name,
        namespace: deployment.metadata.namespace,
        replicas: `${deployment.status.readyReplicas || 0}/${deployment.spec.replicas}`,
        age: this._calculateAge(deployment.metadata.creationTimestamp)
      }));
    } catch (error) {
      console.error('Failed to get deployments:', error);
      throw error;
    }
  }

  async getServices() {
    try {
      const { body } = await this.coreV1Api.listServiceForAllNamespaces();
      return body.items.map(service => ({
        name: service.metadata.name,
        namespace: service.metadata.namespace,
        type: service.spec.type,
        clusterIP: service.spec.clusterIP,
        externalIP: service.status?.loadBalancer?.ingress?.[0]?.ip || '-',
        ports: this._formatPorts(service.spec.ports)
      }));
    } catch (error) {
      console.error('Failed to get services:', error);
      throw error;
    }
  }

  _calculateAge(timestamp) {
    const created = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return diffInDays === 0 ? '<1d' : `${diffInDays}d`;
  }

  _formatPorts(ports) {
    return ports.map(port => 
      `${port.port}:${port.nodePort || port.port}/${port.protocol}`
    ).join(', ');
  }
}

export const kubernetesService = new KubernetesService();