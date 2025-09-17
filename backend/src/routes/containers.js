import express from "express";
import { containers } from "../data/containers.js";

const router = express.Router();

// GET all containers
router.get("/", (req, res) => {
  res.json(containers);
});

export default router;

