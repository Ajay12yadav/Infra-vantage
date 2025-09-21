import express from "express";
import si from "systeminformation";

const router = express.Router();

// keep some CPU history for chart (last 24 points)
let cpuHistory = [];

router.get("/", async (req, res) => {
  try {
    // CPU usage
    const cpuLoad = await si.currentLoad();
    const cpuPercent = Math.round(cpuLoad.currentLoad);

    // Memory usage
    const mem = await si.mem();
    const memPercent = Math.round((mem.active / mem.total) * 100);

    // Disk usage (first disk only)
    const disk = await si.fsSize();
    const diskPercent = Math.round(disk[0].use);

    // Network usage (first interface only)
    const net = await si.networkStats();
    const networkSpeed = `${(net[0].rx_sec / 1024 / 1024).toFixed(2)} MB/s`;

    // --- CPU History for Chart ---
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    cpuHistory.push({ time: timeLabel, usage: cpuPercent });
    if (cpuHistory.length > 24) cpuHistory.shift();

    res.json({
      currentStats: {
        cpu: cpuPercent,
        memory: memPercent,
        disk: diskPercent,
        network: networkSpeed,
      },
      cpu: cpuHistory,
    });
  } catch (err) {
    console.error("Monitoring error:", err);
    res.status(500).json({ error: "Failed to fetch monitoring data" });
  }
});

export default router;

