import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ServiceCredentials = () => {
  const [credentials, setCredentials] = useState({
    serviceType: '',
    credentials: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = [
    {
      id: 'dockerhub',
      name: 'Docker Hub',
      fields: ['username', 'password', 'registry']
    },
    {
      id: 'jenkins',
      name: 'Jenkins',
      fields: ['url', 'username', 'apiToken']
    },
    {
      id: 'github',
      name: 'GitHub',
      fields: ['accessToken', 'owner', 'repo']
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/services/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Failed to save credentials');
      }

      alert('Service credentials saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle>Add Service Credentials</CardTitle>
        <CardDescription>
          Connect your DevOps tools to enable monitoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <Select
            value={credentials.serviceType}
            onValueChange={(value) => setCredentials({
              serviceType: value,
              credentials: {}
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map(service => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {credentials.serviceType && (
            <div className="space-y-3">
              {serviceTypes
                .find(s => s.id === credentials.serviceType)
                ?.fields.map(field => (
                  <Input
                    key={field}
                    type={field.includes('password') ? 'password' : 'text'}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={credentials.credentials[field] || ''}
                    onChange={(e) => setCredentials({
                      ...credentials,
                      credentials: {
                        ...credentials.credentials,
                        [field]: e.target.value
                      }
                    })}
                    required
                  />
                ))}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Credentials'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceCredentials;