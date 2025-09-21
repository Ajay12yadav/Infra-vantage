import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { GitBranch, Clock, User, Play, MoreHorizontal } from "lucide-react";

const Pipelines = () => {
  const [pipelines, setPipelines] = useState([]);

  useEffect(() => {
  const fetchPipelines = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pipelines");
      const data = await res.json();
      setPipelines(data);
    } catch (err) {
      console.error("Error fetching pipelines:", err);
    }
  };

  fetchPipelines();
  const interval = setInterval(fetchPipelines, 10000); // every 10s
  return () => clearInterval(interval);
}, []);


  const formatDuration = (lastRun) => {
    const now = new Date();
    const runTime = new Date(lastRun);
    const diffMs = now - runTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  };

  if (!pipelines.length) {
    return <p className="text-muted-foreground">Loading pipelines...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CI/CD Pipelines</h2>
          <p className="text-muted-foreground">Manage and monitor your deployment pipelines</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Play className="h-4 w-4 mr-2" />
          New Pipeline
        </Button>
      </div>

      {/* Pipeline Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success</p>
                <p className="text-2xl font-bold text-success">
                  {pipelines.filter(p => p.status === "Success").length}
                </p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Running</p>
                <p className="text-2xl font-bold text-primary">
                  {pipelines.filter(p => p.status === "Running").length}
                </p>
              </div>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-destructive">
                  {pipelines.filter(p => p.status === "Failed").length}
                </p>
              </div>
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold text-warning">
                  {pipelines.filter(p => p.status === "Warning").length}
                </p>
              </div>
              <div className="w-3 h-3 bg-warning rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipelines List */}
      <Card className="card-devops">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            All Pipelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{pipeline.name}</h3>
                      <StatusBadge status={pipeline.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {pipeline.branch}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {pipeline.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(pipeline.lastRun)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{pipeline.duration}</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pipelines;
