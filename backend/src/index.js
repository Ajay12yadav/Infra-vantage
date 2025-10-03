import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import monitoringRoutes from "./routes/monitoring.js";
import containersRoutes from "./routes/containers.js";
import serviceCredentialsRoutes from "./routes/Credentials.js";
import dockerHubRoutes from './routes/dockerHub.routes.js';
import githubRoutes from './routes/github.routes.js';
import { authenticateToken } from './middleware/auth.middleware.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/containers", containersRoutes);
app.use("/api/services/credentials", serviceCredentialsRoutes);
app.use('/api/services/dockerhub', dockerHubRoutes);
app.use('/api/services/github', githubRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log("🔐 Authentication enabled");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

export default app;
