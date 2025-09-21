import express from "express";
import fetch from "node-fetch"; // Add this at the top

const router = express.Router();
const JENKINS_URL = "http://localhost:8081"; // Your Jenkins server URL
const AUTH = "Basic " + Buffer.from("username:API_TOKEN").toString("base64");

const mapColorToStatus = (color) => {
  switch (color) {
    case "blue": return "Success";
    case "red": return "Failed";
    case "yellow": return "Warning";
    default: return "Running";
  }
};

const formatDuration = (ms) => {
  if (!ms) return "N/A";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

router.get("/pipelines", async (req, res) => {
  try {
    const response = await fetch(
      `${JENKINS_URL}/api/json?tree=jobs[name,color,lastBuild[number,timestamp,duration]]`,
      { headers: { Authorization: AUTH } }
    );

    if (!response.ok) return res.status(response.status).json({ error: "Jenkins API failed" });

    const data = await response.json();
    const pipelines = data.jobs.map(job => ({
      id: job.name,
      name: job.name,
      status: mapColorToStatus(job.color),
      lastRun: job.lastBuild ? new Date(job.lastBuild.timestamp).toISOString() : null,
      duration: job.lastBuild ? formatDuration(job.lastBuild.duration) : "N/A",
      branch: "main",  // optional
      author: "Jenkins", // optional
    }));

    res.json(pipelines);
  } catch (err) {
    console.error("Error fetching Jenkins pipelines:", err);
    res.status(500).json({ error: "Unable to fetch pipelines" });
  }
});

export default router;
