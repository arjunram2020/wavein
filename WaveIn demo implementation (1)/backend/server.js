import express from "express";
import cors from "cors";
import { EVENT, STATS, WAVE_TABLE, ARRIVAL_SERIES } from "./lib/data.js";
import { computeWave } from "./lib/waveLogic.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ service: "wavein-backend", status: "ok", demo: true });
});

// Event metadata
app.get("/api/event", (req, res) => res.json(EVENT));

// Live (simulated) sustainability + ops stats
app.get("/api/stats", (req, res) => res.json(STATS));

// Active wave assignments (organizer table)
app.get("/api/waves", (req, res) => res.json(WAVE_TABLE));

// Arrival-distribution series for the chart
app.get("/api/arrivals", (req, res) => res.json(ARRIVAL_SERIES));

// Fan wave lookup: POST { origin, transport } -> assigned wave
app.post("/api/wave", (req, res) => {
  const { origin, transport } = req.body || {};
  if (!origin || !transport) {
    return res.status(400).json({ error: "origin and transport are required" });
  }
  res.json(computeWave(origin, transport));
});

app.listen(PORT, () => {
  console.log(`WaveIn backend (demo) listening on http://localhost:${PORT}`);
});
