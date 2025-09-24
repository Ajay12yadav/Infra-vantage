import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pipelinesRoutes from "./routes/pipelines.js";
import containersRoutes from "./routes/containers.js";
import monitoringRoutes from "./routes/monitoring.js";
import authRoutes from "./routes/auth.js";


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pipelines", pipelinesRoutes);
app.use("/api/containers", containersRoutes);
app.use("/api/monitoring", monitoringRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to InfraVantage API 🚀",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      pipelines: "/api/pipelines",
      containers: "/api/containers",
      monitoring: "/api/monitoring"
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log('📚 API Documentation available at http://localhost:${PORT}/api-docs');
  console.log('🔐 Authentication enabled');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Prevent the process from crashing
  // In production, you might want to crash and restart
});

export default app;



