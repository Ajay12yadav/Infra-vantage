import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  Play, 
  Square, 
  RefreshCw, 
  Trash2, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ContainerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/containers/${id}/inspect`);
        if (!response.ok) throw new Error('Failed to fetch container details');
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleContainerAction = async (action) => {
    setIsActionInProgress(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/containers/${id}/${action}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${action} container`);
      }

      toast({
        title: 'Success',
        description: `Container ${action}ed successfully`
      });

      // Refresh container details
      fetchDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!details) return <div>Container not found</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/containers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{details.Name}</h1>
        <Badge>{details.State.Status}</Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="volumes">Storage</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Container ID</dt>
                  <dd className="font-mono">{details.Id.substring(0, 12)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Created</dt>
                  <dd>{new Date(details.Created).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Platform</dt>
                  <dd>{details.Platform}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Image</dt>
                  <dd className="font-mono">{details.Config.Image}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>State</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd>{details.State.Status}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Started At</dt>
                  <dd>{new Date(details.State.StartedAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">PID</dt>
                  <dd>{details.State.Pid}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Error</dt>
                  <dd>{details.State.Error || 'None'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Container Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Environment Variables</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {details.Config.Env.join('\n')}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Command</h3>
                <pre className="bg-muted p-4 rounded-lg">
                  {details.Config.Cmd ? details.Config.Cmd.join(' ') : 'None'}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Working Directory</h3>
                <code className="bg-muted px-2 py-1 rounded">
                  {details.Config.WorkingDir || '/'}
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(details.NetworkSettings.Networks).map(([name, network]) => (
                <div key={name} className="space-y-2">
                  <h3 className="font-semibold">{name}</h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">IP Address</dt>
                      <dd className="font-mono">{network.IPAddress}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Gateway</dt>
                      <dd className="font-mono">{network.Gateway}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">MAC Address</dt>
                      <dd className="font-mono">{network.MacAddress}</dd>
                    </div>
                  </dl>
                </div>
              ))}
              <div>
                <h3 className="font-semibold mb-2">Ports</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(details.NetworkSettings.Ports || {}).map(([port, bindings]) => (
                    <Badge key={port} variant="outline">
                      {port} → {bindings?.[0]?.HostPort || 'N/A'}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volumes">
          <Card>
            <CardHeader>
              <CardTitle>Storage and Volumes</CardTitle>
            </CardHeader>
            <CardContent>
              {details.Mounts.length > 0 ? (
                <div className="space-y-4">
                  {details.Mounts.map((mount, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <dl className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-muted-foreground">Type</dt>
                          <dd>{mount.Type}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Source</dt>
                          <dd className="font-mono">{mount.Source}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Destination</dt>
                          <dd className="font-mono">{mount.Destination}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Mode</dt>
                          <dd>{mount.Mode}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No volumes mounted</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Limits and Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Memory Limit</dt>
                  <dd>{details.HostConfig.Memory ? `${details.HostConfig.Memory / 1024 / 1024}MB` : 'No limit'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">CPU Shares</dt>
                  <dd>{details.HostConfig.CpuShares || 'Default'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">CPU Quota</dt>
                  <dd>{details.HostConfig.CpuQuota || 'No quota'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Restart Policy</dt>
                  <dd>{details.HostConfig.RestartPolicy.Name}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Container Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => handleContainerAction('start')}
                  disabled={isActionInProgress || details.State.Status === 'running'}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
                
                <Button 
                  onClick={() => handleContainerAction('stop')}
                  disabled={isActionInProgress || details.State.Status !== 'running'}
                  variant="secondary"
                  className="w-full"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
                
                <Button 
                  onClick={() => handleContainerAction('restart')}
                  disabled={isActionInProgress}
                  variant="secondary"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restart
                </Button>
                
                <Button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove this container?')) {
                      handleContainerAction('remove');
                    }
                  }}
                  disabled={isActionInProgress || details.State.Status === 'running'}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>

              {isActionInProgress && (
                <div className="mt-4 p-4 bg-muted rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 animate-spin" />
                  <span>Action in progress...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}