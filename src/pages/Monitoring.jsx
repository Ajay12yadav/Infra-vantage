import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity, Cpu, HardDrive, Wifi, Server } from "lucide-react";

const Monitoring = () => {
  const [monitoring, setMonitoring] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/monitoring")
      .then((res) => res.json())
      .then((data) => setMonitoring(data))
      .catch((err) => console.error("Error fetching monitoring data:", err));
  }, []);

  if (!monitoring) {
    return <p className="text-muted-foreground">Loading monitoring data...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Monitoring</h2>
          <p className="text-muted-foreground">Real-time system metrics and performance data</p>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* CPU */}
        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold">{monitoring.currentStats.cpu}%</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${monitoring.currentStats.cpu}%` }}
                  ></div>
                </div>
              </div>
              <Cpu className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Memory */}
        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Memory</p>
                <p className="text-2xl font-bold">{monitoring.currentStats.memory}%</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-warning h-2 rounded-full transition-all duration-500"
                    style={{ width: `${monitoring.currentStats.memory}%` }}
                  ></div>
                </div>
              </div>
              <Server className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        {/* Disk */}
        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disk Usage</p>
                <p className="text-2xl font-bold">{monitoring.currentStats.disk}%</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-success h-2 rounded-full transition-all duration-500"
                    style={{ width: `${monitoring.currentStats.disk}%` }}
                  ></div>
                </div>
              </div>
              <HardDrive className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        {/* Network */}
        <Card className="card-devops">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-xl font-bold">{monitoring.currentStats.network}</p>
                <p className="text-xs text-muted-foreground mt-1">Throughput</p>
              </div>
              <Wifi className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CPU Chart */}
      <Card className="card-devops">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            CPU Usage (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monitoring.cpu}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Monitoring;
