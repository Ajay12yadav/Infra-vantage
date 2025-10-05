import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Database, 
  Box, 
  Shield, 
  Network 
} from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from "@/components/ui/skeleton";

export default function Kubernetes() {
  const [clusterInfo, setClusterInfo] = useState(null);
  const [pods, setPods] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      console.log('Starting to fetch Kubernetes data...');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Log request details
        console.log('Fetching cluster info...');
        const infoRes = await fetch('http://localhost:5000/api/kubernetes/cluster-info', { headers });
        console.log('Cluster info response status:', infoRes.status);
        const info = await infoRes.json();
        console.log('Cluster info received:', info);

        console.log('Fetching pods...');
        const podsRes = await fetch('http://localhost:5000/api/kubernetes/pods', { headers });
        console.log('Pods response status:', podsRes.status);
        const podsData = await podsRes.json();
        console.log('Pods received:', podsData);

        console.log('Fetching deployments...');
        const deploymentsRes = await fetch('http://localhost:5000/api/kubernetes/deployments', { headers });
        console.log('Deployments response status:', deploymentsRes.status);
        const deploymentsData = await deploymentsRes.json();
        console.log('Deployments received:', deploymentsData);

        console.log('Fetching services...');
        const servicesRes = await fetch('http://localhost:5000/api/kubernetes/services', { headers });
        console.log('Services response status:', servicesRes.status);
        const servicesData = await servicesRes.json();
        console.log('Services received:', servicesData);

        // Update state with data
        setClusterInfo(info);
        setPods(Array.isArray(podsData) ? podsData : []);
        setDeployments(Array.isArray(deploymentsData) ? deploymentsData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);

        console.log('All data fetched and state updated successfully');

      } catch (error) {
        console.error('Failed to fetch Kubernetes data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch cluster data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [toast]);

  // Add loading skeleton component
  const LoadingSkeleton = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-6 w-[100px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kubernetes Dashboard</h1>
        {clusterInfo && (
          <Badge variant="outline">
            {clusterInfo.status || 'Unknown'}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Nodes</p>
                <p className="text-2xl font-bold">{clusterInfo?.nodes || 0}</p>
              </div>
              <Server className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Pods</p>
                <p className="text-2xl font-bold">{clusterInfo?.pods || 0}</p>
              </div>
              <Box className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Deployments</p>
                <p className="text-2xl font-bold">{clusterInfo?.deployments || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Services</p>
                <p className="text-2xl font-bold">{clusterInfo?.services || 0}</p>
              </div>
              <Network className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pods">
        <TabsList>
          <TabsTrigger value="pods">
            Pods ({pods?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="deployments">
            Deployments ({deployments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="services">
            Services ({services?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pods">
          <Card>
            <CardHeader>
              <CardTitle>Pods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                {pods?.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Namespace</th>
                        <th className="px-6 py-3">Node</th>
                        <th className="px-6 py-3">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pods.map((pod) => (
                        <tr key={pod.name} className="border-b">
                          <td className="px-6 py-4 font-medium">{pod.name}</td>
                          <td className="px-6 py-4">
                            <Badge variant={pod.status?.toLowerCase() === "running" ? "success" : "destructive"}>
                              {pod.status || 'Unknown'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">{pod.namespace}</td>
                          <td className="px-6 py-4">{pod.node || 'Unknown'}</td>
                          <td className="px-6 py-4">{pod.age || 'Unknown'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No pods found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployments">
          <Card>
            <CardHeader>
              <CardTitle>Deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                {Array.isArray(deployments) && deployments.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Namespace</th>
                        <th className="px-6 py-3">Replicas</th>
                        <th className="px-6 py-3">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deployments.map((deployment) => (
                        <tr key={`${deployment.namespace}-${deployment.name}`} className="border-b">
                          <td className="px-6 py-4 font-medium">{deployment.name}</td>
                          <td className="px-6 py-4">{deployment.namespace}</td>
                          <td className="px-6 py-4">{deployment.replicas}</td>
                          <td className="px-6 py-4">{deployment.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No deployments found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                {Array.isArray(services) && services.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Cluster IP</th>
                        <th className="px-6 py-3">External IP</th>
                        <th className="px-6 py-3">Ports</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={`${service.namespace}-${service.name}`} className="border-b">
                          <td className="px-6 py-4 font-medium">{service.name}</td>
                          <td className="px-6 py-4">{service.type}</td>
                          <td className="px-6 py-4">{service.clusterIP || '-'}</td>
                          <td className="px-6 py-4">{service.externalIP || '-'}</td>
                          <td className="px-6 py-4">{service.ports || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No services found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}