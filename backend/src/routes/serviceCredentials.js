import express from "express";
import pool from "../config/db.config.js"; // Make sure this points to your PostgreSQL pool setup
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET all service credentials for a user (optional, for testing)
router.get("/", async (req, res) => {
  try {
    // Replace with your user authentication logic
    const userId = 1; // For testing, use a fixed user ID
    const result = await pool.query(
      "SELECT service_type, credentials, is_active, created_at, updated_at, last_sync FROM service_credentials WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch service credentials:", err);
    res.status(500).json({ error: "Failed to fetch service credentials" });
  }
});

// POST service credentials
router.post("/", async (req, res) => {
  try {
    const userId = 1; // Replace with authenticated user ID
    const { serviceType, credentials } = req.body;

    if (!serviceType || !credentials) {
      return res.status(400).json({ error: "Service type and credentials are required" });
    }

    // Check if credentials already exist for this user & service type
    const existing = await pool.query(
      "SELECT id FROM service_credentials WHERE user_id = $1 AND service_type = $2",
      [userId, serviceType]
    );

    if (existing.rows.length > 0) {
      // Update existing credentials
      await pool.query(
        `UPDATE service_credentials
         SET credentials = $1, is_active = true, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND service_type = $3`,
        [credentials, userId, serviceType]
      );
    } else {
      // Insert new credentials
      const token = uuidv4(); // optional unique identifier if needed
      await pool.query(
        `INSERT INTO service_credentials (user_id, service_type, credentials)
         VALUES ($1, $2, $3)`,
        [userId, serviceType, credentials]
      );
    }

    res.json({ message: "Service credentials saved successfully!" });
  } catch (err) {
    console.error("Failed to save service credentials:", err);
    res.status(500).json({ error: "Failed to save service credentials" });
  }
});

export default router;
