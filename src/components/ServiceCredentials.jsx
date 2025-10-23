import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ServiceCredentials = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    serviceType: '',
    credentials: {}
  });
  const [loading, setLoading] = useState(false);

  // Define service types outside of render
  const serviceTypes = [
    {
      id: 'dockerhub',
      name: 'Docker Hub',
      icon: '🐳',
      route: '/docker-hub',
      fields: ['username', 'token']
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: '🐙',
      route: '/github',
      fields: ['token']
    },
    {
      id: 'jenkins',
      name: 'Jenkins',
      icon: '⚙️',
      route: '/jenkins',
      fields: ['url', 'username', 'token']
    },
    {
      id: 'terraform',
      name: 'Terraform Cloud',
      icon: '🌍',
      route: '/terraform',
      fields: ['organization', 'token']
    },
    {
      id: 'ansible',
      name: 'Ansible Tower',
      icon: '🎮',
      route: '/ansible',
      fields: ['url', 'username', 'password']
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      icon: '☸️',
      route: '/kubernetes',
      fields: ['kubeconfig', 'context']
    }
  ];

  // Add helper text for different service types
  const getHelperText = (serviceType, field) => {
    const helpers = {
      dockerhub: {
        token: 'Generate a token at Docker Hub → Account Settings → Security → New Access Token'
      },
      github: {
        token: 'Create a token at GitHub → Settings → Developer Settings → Personal Access Tokens'
      },
      jenkins: {
        token: 'Generate a token at Jenkins → User → Configure → API Token',
        url: 'Enter your Jenkins server URL (e.g., https://jenkins.example.com)'
      },
      terraform: {
        token: 'Create a token at Terraform Cloud → User Settings → Tokens',
        organization: 'Enter your Terraform Cloud organization name'
      },
      ansible: {
        url: 'Enter your Ansible Tower URL (e.g., https://ansible.example.com)',
        password: 'Enter your Ansible Tower password or API token'
      },
      kubernetes: {
        kubeconfig: 'Paste your kubeconfig file content or path',
        context: 'Specify the kubernetes context to use (optional)'
      }
    };

    return helpers[serviceType]?.[field] || '';
  };

  // Debug logging
  console.log('Current service type:', credentials.serviceType);
  console.log('Selected service:', serviceTypes.find(s => s.id === credentials.serviceType));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Find the selected service configuration
    const serviceConfig = serviceTypes.find(s => s.id === credentials.serviceType);

    if (!serviceConfig) {
      toast({
        title: "Error",
        description: "Invalid service type",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // ==================== DOCKERHUB ====================
      if (credentials.serviceType === 'dockerhub') {
        const verifyResponse = await fetch('http://localhost:5000/api/services/dockerhub/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            username: credentials.credentials.username,
            token: credentials.credentials.token
          })
        });

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          throw new Error(errorData.message || 'Invalid Docker Hub credentials');
        }

        const { data } = await verifyResponse.json();

        // Save verified credentials
        const saveResponse = await fetch('http://localhost:5000/api/services/credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            serviceType: 'dockerhub',
            credentials: {
              username: credentials.credentials.username,
              token: credentials.credentials.token
            }
          })
        });

        if (!saveResponse.ok) throw new Error('Failed to save DockerHub credentials');

        toast({
          title: "Success",
          description: "Docker Hub credentials verified and saved!"
        });

        navigate('/docker-hub', {
          state: {
            username: credentials.credentials.username,
            repositories: data?.repositories || []
          }
        });
        return;
      }

      // ==================== GITHUB ====================
      if (credentials.serviceType === 'github') {
        const verifyResponse = await fetch("http://localhost:5000/api/services/github/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            token: credentials.credentials.token  // 👈 FIX: send as "token"
          })
        });

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          throw new Error(errorData.message || "Invalid GitHub token");
        }

        const verifyData = await verifyResponse.json();

        // Save credentials
        const saveResponse = await fetch("http://localhost:5000/api/services/credentials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            serviceType: "github",
            credentials: {
              token: credentials.credentials.token,
              owner: credentials.credentials.owner,
              repo: credentials.credentials.repo
            }
          })
        });

        if (!saveResponse.ok) throw new Error("Failed to save GitHub credentials");

        toast({
          title: "Success",
          description: "GitHub credentials verified and saved!"
        });

        navigate("/github", {
          state: {
            owner: credentials.credentials.owner,
            repo: credentials.credentials.repo,
            repositories: verifyData.data.repositories
          }
        });
        return;
      }

      // ==================== OTHER SERVICES (Jenkins etc.) ====================
      const response = await fetch('http://localhost:5000/api/services/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) throw new Error('Failed to save credentials');

      toast({
        title: "Success",
        description: "Service credentials saved successfully!"
      });

      switch (credentials.serviceType) {
        case 'jenkins':
          const jenkinsResponse = await fetch('http://localhost:5000/api/services/jenkins/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(credentials.credentials)
          });
          if (!jenkinsResponse.ok) throw new Error('Failed to verify Jenkins credentials');
          navigate('/jenkins');
          break;

        case 'terraform':
          const terraformResponse = await fetch('http://localhost:5000/api/services/terraform/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(credentials.credentials)
          });
          if (!terraformResponse.ok) throw new Error('Failed to verify Terraform credentials');
          navigate('/terraform');
          break;

        case 'ansible':
          const ansibleResponse = await fetch('http://localhost:5000/api/services/ansible/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(credentials.credentials)
          });
          if (!ansibleResponse.ok) throw new Error('Failed to verify Ansible credentials');
          navigate('/ansible');
          break;

        case 'kubernetes':
          const k8sResponse = await fetch('http://localhost:5000/api/services/kubernetes/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(credentials.credentials)
          });
          if (!k8sResponse.ok) throw new Error('Failed to verify Kubernetes credentials');
          navigate('/kubernetes');
          break;

        default:
          navigate('/dashboard');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle>Service Credentials</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Type Selection */}
          <select
            value={credentials.serviceType}
            onChange={(e) => setCredentials({
              serviceType: e.target.value,
              credentials: {}
            })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a service</option>
            {serviceTypes.map(service => (
              <option key={service.id} value={service.id}>
                {service.icon} {service.name}
              </option>
            ))}
          </select>

          {/* Service Fields - with null check */}
          {credentials.serviceType && serviceTypes.find(s => s.id === credentials.serviceType)?.fields?.map(field => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <Input
                type={field.includes('password') || field.includes('token') ? 'password' : 'text'}
                placeholder={`Enter ${field}`}
                value={credentials.credentials[field] || ''}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  credentials: {
                    ...prev.credentials,
                    [field]: e.target.value
                  }
                }))}
              />
              {getHelperText(credentials.serviceType, field) && (
                <p className="text-sm text-muted-foreground">
                  {getHelperText(credentials.serviceType, field)}
                </p>
              )}
            </div>
          ))}

          {credentials.serviceType && (
            <Button 
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Service'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceCredentials;
