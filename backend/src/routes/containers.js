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

export default router;
