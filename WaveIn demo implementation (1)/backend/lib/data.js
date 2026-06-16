// DEMO BACKEND — all values hardcoded / simulated. No external integrations:
// no MARTA GTFS, no EPA endpoints, no Google Maps API, no database.
// This mirrors the data the frontend already ships with, exposed as a REST
// API so it's ready to grow into a real service in a later pass.

export const EVENT = {
  label: "Spain vs Cape Verde",
  date: "June 15",
  kickoff: "7:00pm KO",
  totalFans: 68400,
};

// Snapshot of the "live" sustainability counters. In this demo they are static
// figures; a future pass would compute these from real arrival telemetry.
export const STATS = {
  co2SavedKg: 47200,
  martaShifts: 1847,
  activeWaves: 4,
  projectedSeasonKg: 408000,
  equivalents: {
    treesPlanted: 2190,
    carsRemovedForYear: 89,
    transatlanticFlights: 51,
  },
};

export const WAVE_TABLE = [
  { wave: 1, name: "Wave 1", color: "#00ff87", window: "4:30 – 5:15pm", zones: ["Airport", "Downtown"], transport: "MARTA Priority", reward: "Free drink + Priority Gate", fans: 5200 },
  { wave: 2, name: "Wave 2", color: "#ffd23f", window: "5:15 – 5:45pm", zones: ["Midtown", "Buckhead"], transport: "MARTA / Rideshare", reward: "$10 concession credit", fans: 6800 },
  { wave: 3, name: "Wave 3", color: "#ff9500", window: "5:45 – 6:15pm", zones: ["Decatur", "Sandy Springs"], transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: 4900 },
  { wave: 4, name: "Wave 4", color: "#ff4444", window: "6:00 – 6:45pm", zones: ["Suburbs (30+ min)"], transport: "Driving", reward: "Standard entry", fans: 3100 },
];

export const ARRIVAL_SERIES = {
  times: ["4:00","4:15","4:30","4:45","5:00","5:15","5:30","5:45","6:00","6:15","6:30","6:45","7:00","7:15"],
  withoutWaveIn: [400,400,420,450,500,650,900,2200,4800,7200,7100,4200,1500,600],
  withWaveIn: [300,900,1900,2300,2600,2700,2800,2700,2600,2500,2400,2000,1100,500],
  kickoffIndex: 12,
};
