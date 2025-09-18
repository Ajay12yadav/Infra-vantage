import express from "express";
import cors from "cors"; // 👈 import cors
import pipelinesRoutes from "./routes/pipelines.js";
import containersRoutes from "./routes/containers.js";
import monitoringRoutes from "./routes/monitoring.js";

const app = express();
const PORT = 5000;

app.use(cors()); // 👈 enable CORS
app.use(express.json());

// Routes
app.use("/api/pipelines", pipelinesRoutes);
app.use("/api/containers", containersRoutes);
app.use("/api/monitoring", monitoringRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to InfraVantage API 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});



