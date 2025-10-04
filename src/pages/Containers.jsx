import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { Container, Play, Square, MoreHorizontal, Activity } from "lucide-react";

const Containers = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/containers");
        const data = await res.json();
        // Ensure data is an array before setting state
        setContainers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching containers:", err);
        setContainers([]); // fallback to empty array
      }
    };

    fetchContainers();
    const interval = setInterval(fetchContainers, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // Safely filter containers
  const runningContainers = Array.isArray(containers) ? containers.filter(c => c.state === "running").length : 0;
  const stoppedContainers = Array.isArray(containers) ? containers.filter(c => c.state !== "running").length : 0;

  const handleContainerClick = (containerId) => {
    navigate(`/containers/${containerId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Docker Containers</h2>
          <p className="text-muted-foreground">Real-time Docker container stats</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Container className="h-4 w-4 mr-2" />
          Deploy Container
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-devops">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{Array.isArray(containers) ? containers.length : 0}</p>
            </div>
            <Container className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="card-devops">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Running</p>
              <p className="text-2xl font-bold text-success">{runningContainers}</p>
            </div>
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
          </CardContent>
        </Card>

        <Card className="card-devops">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stopped</p>
              <p className="text-2xl font-bold text-muted-foreground">{stoppedContainers}</p>
            </div>
            <div className="w-3 h-3 bg-muted rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="card-devops">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Health</p>
              <p className="text-2xl font-bold text-success">Good</p>
            </div>
            <Activity className="h-8 w-8 text-success" />
          </CardContent>
        </Card>
      </div>

      {/* Containers Table */}
      <Card className="card-devops">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Container className="h-5 w-5" />
            Container Instances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Ports</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(containers) && containers.length > 0 ? (
                containers.map(container => (
                  <TableRow 
                    key={container.id} 
                    className="hover:bg-background/50 cursor-pointer"
                    onClick={() => handleContainerClick(container.id)}
                  >
                    <TableCell className="font-medium">{container.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={container.state === "running" ? "Running" : "Stopped"} />
                    </TableCell>
                    <TableCell>
                      {container.cpu ? (
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: container.cpu }}
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {container.memory ? <span>{container.memory}</span> : <span className="text-muted-foreground">N/A</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{container.image}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{container.ports?.join(", ")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {container.state === "running" ? (
                          <Button variant="outline" size="sm">
                            <Square className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No containers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Containers;
