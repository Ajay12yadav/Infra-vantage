import express from "express";
import { pipelines } from "../data/pipelines.js";

const router = express.Router();

// GET all pipelines
router.get("/", (req, res) => {
  res.json(pipelines);
});

export default router;


