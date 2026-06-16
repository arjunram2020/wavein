// All values hardcoded / simulated for the demo. No external data sources.

export const EVENT = {
  label: "Spain vs Cape Verde",
  date: "June 15",
  kickoff: "7:00pm KO",
  totalFans: "68,400",
};

// Targets the live counters animate toward, then drift past.
export const COUNTERS = {
  co2Target: 47200,    // kg CO2 saved this game
  martaTarget: 1847,   // car -> MARTA shifts
  co2Ceiling: 62000,   // for the progress bar
  martaCeiling: 2500,
};

// Organizer wave table (active assignments).
export const WAVE_TABLE = [
  {
    name: "Wave 1", dot: "#00ff87",
    window: "4:30 – 5:15pm",
    zones: "Airport, Downtown",
    transport: "MARTA Priority",
    reward: "Free drink + Priority Gate",
    fans: "5,200",
  },
  {
    name: "Wave 2", dot: "#ffd23f",
    window: "5:15 – 5:45pm",
    zones: "Midtown, Buckhead",
    transport: "MARTA / Rideshare",
    reward: "$10 concession credit",
    fans: "6,800",
  },
  {
    name: "Wave 3", dot: "#ff9500",
    window: "5:45 – 6:15pm",
    zones: "Decatur, Sandy Springs",
    transport: "Driving / Rideshare",
    reward: "Standard entry + $5 credit",
    fans: "4,900",
  },
  {
    name: "Wave 4", dot: "#ff4444",
    window: "6:00 – 6:45pm",
    zones: "Suburbs (30+ min)",
    transport: "Driving",
    reward: "Standard entry",
    fans: "3,100",
  },
];

// Fan-form dropdown options.
export const ORIGINS = [
  { id: "airport", label: "✈️ ATL Airport" },
  { id: "downtown", label: "🏙️ Downtown Atlanta" },
  { id: "midtown", label: "🏘️ Midtown" },
  { id: "buckhead", label: "🏡 Buckhead" },
  { id: "decatur", label: "🚉 Decatur" },
  { id: "sandysprings", label: "🌆 Sandy Springs" },
  { id: "suburbs", label: "🚗 Suburbs (30+ min away)" },
];

export const TRANSPORTS = [
  { id: "marta", label: "🚇 MARTA (Recommended)" },
  { id: "driving", label: "🚗 Driving" },
  { id: "rideshare", label: "🚕 Rideshare (Uber/Lyft)" },
];

// Static arrival-distribution series for the chart (fans per 15 min).
export const CHART = {
  times: ["4:00","4:15","4:30","4:45","5:00","5:15","5:30","5:45","6:00","6:15","6:30","6:45","7:00","7:15"],
  withoutWaveIn: [400,400,420,450,500,650,900,2200,4800,7200,7100,4200,1500,600],
  withWaveIn:    [300,900,1900,2300,2600,2700,2800,2700,2600,2500,2400,2000,1100,500],
  kickoffIndex: 12, // 7:00pm
  yMax: 8000,
};

// Static Google Maps link (no API call — just a directions href).
export const MAPS_URL =
  "https://maps.google.com/?q=Mercedes-Benz+Stadium+Atlanta+GA";
