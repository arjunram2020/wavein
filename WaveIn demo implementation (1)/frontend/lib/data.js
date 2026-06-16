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
    id: "united-nashville", category: "Atlanta United", emoji: "⚽",
    label: "Atlanta United vs Nashville SC", date: "Sep 26, 2026", kickoff: "7:30pm KO", totalFans: "38,900",
    counters: { co2Target: 21800, martaTarget: 1050, co2Ceiling: 32000, martaCeiling: 1600 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "5:00 – 5:45pm", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free drink + Priority Gate", fans: "2,900" },
      { name: "Wave 2", dot: W2, window: "5:45 – 6:15pm", zones: "Midtown, Buckhead", transport: "MARTA / Rideshare", reward: "$10 concession credit", fans: "3,700" },
      { name: "Wave 3", dot: W3, window: "6:15 – 6:45pm", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "3,100" },
      { name: "Wave 4", dot: W4, window: "6:30 – 7:15pm", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "1,900" },
    ],
    chart: {
      times: ["4:30","4:45","5:00","5:15","5:30","5:45","6:00","6:15","6:30","6:45","7:00","7:15","7:30","7:45"],
      withoutWaveIn: [100,150,200,280,420,700,1300,2900,4400,4900,4300,2100,700,250],
      withWaveIn:    [80,350,800,1300,1700,1900,2000,1900,1800,1700,1500,1200,600,200],
      kickoffIndex: 12, kickoffLabel: "Kickoff ⚽", yMax: 5500,
    },
  },

  // ── SEC Championship ───────────────────────────────────────────────────────
  {
    id: "sec-champ-2026", category: "SEC Championship", emoji: "🏈",
    label: "SEC Championship Game", date: "Dec 5, 2026", kickoff: "4:00pm KO", totalFans: "74,800",
    counters: { co2Target: 55200, martaTarget: 2380, co2Ceiling: 72000, martaCeiling: 3200 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "12:30 – 1:15pm", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free drink + Priority Gate", fans: "6,100" },
      { name: "Wave 2", dot: W2, window: "1:15 – 1:45pm", zones: "Midtown, Buckhead", transport: "MARTA / Rideshare", reward: "$10 concession credit", fans: "7,800" },
      { name: "Wave 3", dot: W3, window: "1:45 – 2:15pm", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "6,400" },
      { name: "Wave 4", dot: W4, window: "2:00 – 2:45pm", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "5,200" },
    ],
    chart: {
      times: ["12:00","12:15","12:30","12:45","1:00","1:15","1:30","1:45","2:00","2:15","2:30","2:45","3:00","3:30","4:00"],
      withoutWaveIn: [300,400,500,650,900,1400,2200,4200,6500,8200,8000,5000,2000,700,250],
      withWaveIn:    [250,900,2000,2600,3000,3100,3100,3000,2800,2600,2400,1900,1100,450,150],
      kickoffIndex: 14, kickoffLabel: "Kickoff 🏈", yMax: 9000,
    },
  },

  // ── Concerts ───────────────────────────────────────────────────────────────
  {
    id: "concert-taylor", category: "Concert", emoji: "🎤",
    label: "Taylor Swift — Eras Tour", date: "Jul 11, 2026", kickoff: "8:00pm Show", totalFans: "75,000",
    counters: { co2Target: 58400, martaTarget: 2640, co2Ceiling: 75000, martaCeiling: 3500 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "5:00 – 5:45pm", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free merch voucher + Priority Gate", fans: "6,200" },
      { name: "Wave 2", dot: W2, window: "5:45 – 6:30pm", zones: "Midtown, Buckhead", transport: "MARTA / Rideshare", reward: "$15 concession credit", fans: "8,100" },
      { name: "Wave 3", dot: W3, window: "6:30 – 7:15pm", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "6,800" },
      { name: "Wave 4", dot: W4, window: "7:00 – 7:45pm", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "4,900" },
    ],
    chart: {
      times: ["4:30","4:45","5:00","5:15","5:30","5:45","6:00","6:15","6:30","6:45","7:00","7:15","7:30","7:45","8:00"],
      withoutWaveIn: [300,400,500,700,1100,1800,3500,6200,8500,9100,8200,4800,2000,700,250],
      withWaveIn:    [250,900,2100,2800,3200,3400,3400,3300,3100,2900,2700,2200,1300,500,180],
      kickoffIndex: 14, kickoffLabel: "Show Start 🎤", yMax: 9500,
    },
  },
  {
    id: "concert-beyonce", category: "Concert", emoji: "🎤",
    label: "Beyoncé — Cowboy Carter Tour", date: "Aug 22, 2026", kickoff: "8:00pm Show", totalFans: "75,000",
    counters: { co2Target: 59100, martaTarget: 2700, co2Ceiling: 75000, martaCeiling: 3500 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "5:00 – 5:45pm", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free merch voucher + Priority Gate", fans: "6,400" },
      { name: "Wave 2", dot: W2, window: "5:45 – 6:30pm", zones: "Midtown, Buckhead", transport: "MARTA / Rideshare", reward: "$15 concession credit", fans: "8,300" },
      { name: "Wave 3", dot: W3, window: "6:30 – 7:15pm", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "7,000" },
      { name: "Wave 4", dot: W4, window: "7:00 – 7:45pm", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "5,100" },
    ],
    chart: {
      times: ["4:30","4:45","5:00","5:15","5:30","5:45","6:00","6:15","6:30","6:45","7:00","7:15","7:30","7:45","8:00"],
      withoutWaveIn: [350,450,600,800,1200,2000,3800,6500,8700,9200,8400,5000,2100,750,280],
      withWaveIn:    [280,1000,2200,2900,3300,3500,3500,3400,3200,3000,2800,2300,1300,520,200],
      kickoffIndex: 14, kickoffLabel: "Show Start 🎤", yMax: 9500,
    },
  },

  // ── Dragon Con ─────────────────────────────────────────────────────────────
  {
    id: "dragon-con-2026", category: "Dragon Con", emoji: "🐉",
    label: "Dragon Con 2026", date: "Aug 28–Sep 1, 2026", kickoff: "10:00am Open", totalFans: "85,000",
    counters: { co2Target: 31400, martaTarget: 3100, co2Ceiling: 50000, martaCeiling: 4500 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "8:30 – 9:15am", zones: "Airport, Buckhead, Perimeter", transport: "MARTA Priority", reward: "Priority badge pickup + $10 food credit", fans: "7,200" },
      { name: "Wave 2", dot: W2, window: "9:15 – 9:45am", zones: "Midtown, Downtown hotels", transport: "MARTA / Walking", reward: "Fast-lane wristband", fans: "9,400" },
      { name: "Wave 3", dot: W3, window: "9:45 – 10:15am", zones: "Decatur, Sandy Springs", transport: "MARTA / Rideshare", reward: "Standard entry", fans: "8,100" },
      { name: "Wave 4", dot: W4, window: "10:00 – 10:45am", zones: "Suburbs / Out-of-state", transport: "Driving / Rideshare", reward: "Standard entry", fans: "6,300" },
    ],
    chart: {
      times: ["8:00","8:15","8:30","8:45","9:00","9:15","9:30","9:45","10:00","10:15","10:30","10:45","11:00","11:15"],
      withoutWaveIn: [500,800,1400,2600,5200,8800,9500,8200,5800,3200,1800,1100,600,300],
      withWaveIn:    [400,1800,3200,3800,4100,4200,4100,3900,3600,3200,2600,1800,900,350],
      kickoffIndex: 8, kickoffLabel: "Doors Open 🐉", yMax: 10000,
    },
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
