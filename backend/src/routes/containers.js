import express from "express";
import Docker from "dockerode";

const router = express.Router();
const docker = new Docker({ socketPath: "//./pipe/docker_engine" }); // Windows

router.get("/", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    const formatted = containers.map(c => ({
      id: c.Id,
      name: c.Names[0].replace("/", ""),
      state: c.State,            // 'running', 'exited', etc.
      uptime: c.Status,
      cpu: "0%",                  // Optional
      memory: "0%",               // Optional
      image: c.Image,
      ports: c.Ports?.map(p => `${p.PrivatePort}:${p.PublicPort || p.PrivatePort}`) || []
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Error fetching containers:", err);
    res.status(500).json({ error: "Unable to fetch containers" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id);
    const [info, stats] = await Promise.all([
      container.inspect(),
      container.stats({ stream: false })
    ]);

    const response = {
      id: info.Id,
      name: info.Name.replace("/", ""),
      state: info.State.Status,
      created: info.Created,
      image: info.Config.Image,
      networkMode: info.HostConfig.NetworkMode,
      ports: info.NetworkSettings.Ports ? 
        Object.entries(info.NetworkSettings.Ports).map(([key, value]) => 
          `${key} -> ${value?.[0]?.HostPort || 'N/A'}`
        ) : [],
      env: info.Config.Env,
      volumes: info.Mounts.map(m => `${m.Source}:${m.Destination}`),
      cpu: `${((stats.cpu_stats.cpu_usage.total_usage / stats.cpu_stats.system_cpu_usage) * 100).toFixed(2)}%`,
      memory: `${((stats.memory_stats.usage / stats.memory_stats.limit) * 100).toFixed(2)}%`,
      uptime: info.State.StartedAt ? 
        new Date(info.State.StartedAt).toLocaleString() : 'N/A'
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching container details:", err);
    res.status(500).json({ error: "Unable to fetch container details" });
  }
});

router.get("/:id/inspect", async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id);
    const [info, stats] = await Promise.all([
      container.inspect(),
      container.stats({ stream: false })
    ]);

    // Add real-time stats to the inspection data
    info.Stats = {
      cpu_usage: ((stats.cpu_stats.cpu_usage.total_usage / stats.cpu_stats.system_cpu_usage) * 100).toFixed(2),
      memory_usage: {
        used: stats.memory_stats.usage,
        limit: stats.memory_stats.limit,
        percentage: ((stats.memory_stats.usage / stats.memory_stats.limit) * 100).toFixed(2)
      },
      network: stats.networks,
      block_io: stats.blkio_stats
    };

    res.json(info);
  } catch (err) {
    console.error("Error fetching container inspection:", err);
    res.status(500).json({ error: "Unable to fetch container inspection data" });
  }
});

// Start container
router.post("/:id/start", async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id);
    await container.start();
    res.json({ success: true, message: "Container started successfully" });
  } catch (err) {
    console.error("Error starting container:", err);
    res.status(500).json({ error: "Failed to start container" });
  }
});

// Stop container
router.post("/:id/stop", async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id);
    await container.stop();
    res.json({ success: true, message: "Container stopped successfully" });
  } catch (err) {
    console.error("Error stopping container:", err);
    res.status(500).json({ error: "Failed to stop container" });
  }
});

// Restart container
router.post("/:id/restart", async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id);
    await container.restart();
    res.json({ success: true, message: "Container restarted successfully" });
  } catch (err) {
    console.error("Error restarting container:", err);
    res.status(500).json({ error: "Failed to restart container" });
  }
});

// Remove container
router.post("/:id/remove", async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id);
    await container.remove({ force: false });
    res.json({ success: true, message: "Container removed successfully" });
  } catch (err) {
    console.error("Error removing container:", err);
    res.status(500).json({ error: "Failed to remove container" });
  }
});

export default router;
