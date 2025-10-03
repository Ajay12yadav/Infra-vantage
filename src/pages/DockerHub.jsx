import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DockerHub() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    const checkAuthAndFetchRepos = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast({
            title: "Authentication Required",
            description: "Please login to view Docker Hub repositories",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/services/dockerhub/repositories', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(data.message || 'Failed to fetch repositories');
        }

        setRepositories(data.repositories || []);

      } catch (err) {
        console.error('Repository fetch error:', err);
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchRepos();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading repositories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>
          Failed to load repositories: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Docker Hub Dashboard</h1>
        <Badge variant="outline">
          Connected as: {state?.username}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          {repositories.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No repositories found
            </div>
          ) : (
            <div className="grid gap-4">
              {repositories.map((repo) => (
                <Card key={repo.name} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{repo.name}</h3>
                      <p className="text-sm text-gray-500">
                        {repo.description || 'No description'}
                      </p>
                    </div>
                    <Badge>{repo.pull_count} pulls</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}