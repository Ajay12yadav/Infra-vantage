import { useEffect, useState } from "react"; // ⬅️ Added
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { Container, Play, Square, MoreHorizontal, Activity } from "lucide-react";
// import dashboardData from '@/data/dashboardData.json'; ⬅️ Removed

const Containers = () => {
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    async function fetchContainers() {
      try {
        const res = await fetch("http://localhost:5000/api/containers"); // ⬅️ backend endpoint
        const data = await res.json();
        setContainers(data);
      } catch (err) {
        console.error("Error fetching containers:", err);
      }
    }

    fetchContainers();
  }, []);

  const runningContainers = containers.filter(c => c.status === "Running").length;
  const stoppedContainers = containers.filter(c => c.status === "Stopped").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Container Management</h2>
          <p className="text-muted-foreground">Monitor and manage your Docker containers</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Container className="h-4 w-4 mr-2" />
          Deploy Container
        </Button>
      </div>

      {/* Container Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{containers.length}</p>
              </div>
              <Container className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Running</p>
                <p className="text-2xl font-bold text-success">{runningContainers}</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stopped</p>
                <p className="text-2xl font-bold text-muted-foreground">{stoppedContainers}</p>
              </div>
              <div className="w-3 h-3 bg-muted rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Health</p>
                <p className="text-2xl font-bold text-success">Good</p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
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
                <TableHead>Uptime</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Ports</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers.map((container) => (
                <TableRow key={container.id} className="hover:bg-background/50">
                  <TableCell className="font-medium">{container.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={container.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{container.uptime}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={container.status === "Running" ? "text-foreground" : "text-muted-foreground"}>
                        {container.cpu}
                      </span>
                      {container.status === "Running" && (
                        <div className="w-12 bg-muted rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full" 
                            style={{width: container.cpu}}
                          ></div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={container.status === "Running" ? "text-foreground" : "text-muted-foreground"}>
                      {container.memory}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {container.image}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {container.ports}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {container.status === "Running" ? (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Containers;
