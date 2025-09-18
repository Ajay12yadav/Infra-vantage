import { useEffect, useState } from 'react'; // ⬅️ Added
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MetricCard from '@/components/MetricCard';
import StatusBadge from '@/components/StatusBadge';
import { BarChart3, Container, GitBranch, Activity, Clock } from 'lucide-react';
// import dashboardData from '@/data/dashboardData.json'; ⬅️ Removed

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [pipelines, setPipelines] = useState([]);
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch from backend APIs
        const [pipelinesRes, containersRes, monitoringRes] = await Promise.all([
          fetch("http://localhost:5000/api/pipelines"),
          fetch("http://localhost:5000/api/containers"),
          fetch("http://localhost:5000/api/monitoring"),
        ]);

        const pipelinesData = await pipelinesRes.json();
        const containersData = await containersRes.json();
        const monitoringData = await monitoringRes.json();

        // build same structure as dashboardData.json
        setSummary({
          totalPipelines: pipelinesData.length,
          runningContainers: containersData.filter(c => c.status === "Running").length,
          systemHealth: monitoringData.health || "OK",
          activeDeploys: pipelinesData.filter(p => p.status === "Running").length,
        });

        setPipelines(pipelinesData);
        setContainers(containersData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }

    fetchData();
  }, []);

  // Get recent pipelines for quick overview
  const recentPipelines = pipelines.slice(0, 3);
  const runningContainers = containers.filter(c => c.status === 'Running');

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Pipelines"
          value={summary.totalPipelines}
          subtitle="Active CI/CD workflows"
          icon={GitBranch}
          variant="primary"
        />
        
        <MetricCard
          title="Running Containers"
          value={summary.runningContainers}
          subtitle={`${runningContainers.length} healthy`}
          icon={Container}
          variant="success"
        />
        
        <MetricCard
          title="System Health"
          value={summary.systemHealth}
          subtitle="All systems operational"
          icon={Activity}
          variant="success"
        />
        
        <MetricCard
          title="Active Deploys"
          value={summary.activeDeploys}
          subtitle="Currently deploying"
          icon={Clock}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Pipeline Activity */}
        <Card className="card-devops">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Recent Pipeline Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPipelines.map((pipeline) => (
                <div key={pipeline.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{pipeline.name}</span>
                      <StatusBadge status={pipeline.status} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pipeline.branch} • {pipeline.duration} • {pipeline.author}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pipeline.lastRun ? new Date(pipeline.lastRun).toLocaleTimeString() : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status Overview */}
        <Card className="card-devops">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="font-medium">API Services</span>
                </div>
                <StatusBadge status="Running" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="font-medium">Database</span>
                </div>
                <StatusBadge status="Running" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="font-medium">Cache Layer</span>
                </div>
                <StatusBadge status="Warning" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="font-medium">Load Balancer</span>
                </div>
                <StatusBadge status="Running" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage Quick View */}
      <Card className="card-devops">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resource Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">67%</div>
              <div className="text-sm text-muted-foreground">CPU Usage</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{width: '67%'}}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">72%</div>
              <div className="text-sm text-muted-foreground">Memory</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-warning h-2 rounded-full" style={{width: '72%'}}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">45%</div>
              <div className="text-sm text-muted-foreground">Disk Usage</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-success h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">2.3 GB/s</div>
              <div className="text-sm text-muted-foreground">Network</div>
              <div className="flex justify-center mt-2">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
