import express from "express";
import { monitoring } from "../data/monitoring.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(monitoring);
});

export default router;
