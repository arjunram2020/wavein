// Event catalogue. Wave tables (fan counts, transport, zones) are the source of
// truth; the CO₂ + MARTA-shift counters are DERIVED from them via lib/logistics
// using real zone→stadium driving distances — see deriveCounters below.

import { deriveCounters } from "./logistics";

// ─── Shared wave-table dot colors ────────────────────────────────────────────
const W1 = "#00ff87", W2 = "#ffd23f", W3 = "#ff9500", W4 = "#ff4444";

// ─── Event catalogue ─────────────────────────────────────────────────────────
// Each entry drives the entire Organizer view when selected. The `counters`
// fields below are placeholders — they're recomputed from each event's wave
// table just after this array (see the EVENTS map), so the numbers shown always
// trace back to fan counts × transport mode × real zone distances.
const EVENTS_RAW = [
  // ── WC26 ──────────────────────────────────────────────────────────────────
  {
    id: "wc26-esp-cpv", category: "WC26", emoji: "⚽",
    label: "Spain vs Cape Verde", date: "Jun 15, 2026", kickoff: "7:00pm KO", totalFans: "68,400",
    counters: { co2Target: 47200, martaTarget: 1847, co2Ceiling: 62000, martaCeiling: 2500 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "4:30 – 5:15pm", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free drink + Priority Gate", fans: "5,200" },
      { name: "Wave 2", dot: W2, window: "5:15 – 5:45pm", zones: "Midtown, Buckhead",  transport: "MARTA / Rideshare",  reward: "$10 concession credit",       fans: "6,800" },
      { name: "Wave 3", dot: W3, window: "5:45 – 6:15pm", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "4,900" },
      { name: "Wave 4", dot: W4, window: "6:00 – 6:45pm", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "3,100" },
    ],
    chart: {
      times: ["4:00","4:15","4:30","4:45","5:00","5:15","5:30","5:45","6:00","6:15","6:30","6:45","7:00","7:15"],
      withoutWaveIn: [400,400,420,450,500,650,900,2200,4800,7200,7100,4200,1500,600],
      withWaveIn:    [300,900,1900,2300,2600,2700,2800,2700,2600,2500,2400,2000,1100,500],
      kickoffIndex: 12, kickoffLabel: "Kickoff ⚽", yMax: 8000,
    },
  },
  {
    id: "wc26-usa-pan", category: "WC26", emoji: "⚽",
    label: "USA vs Panama", date: "Jun 19, 2026", kickoff: "3:00pm KO", totalFans: "71,000",
    counters: { co2Target: 51400, martaTarget: 2100, co2Ceiling: 65000, martaCeiling: 2800 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "11:30am – 12:15pm", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free drink + Priority Gate", fans: "5,800" },
      { name: "Wave 2", dot: W2, window: "12:15 – 12:45pm", zones: "Midtown, Buckhead",  transport: "MARTA / Rideshare",  reward: "$10 concession credit",       fans: "7,200" },
      { name: "Wave 3", dot: W3, window: "12:45 – 1:15pm", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "5,400" },
      { name: "Wave 4", dot: W4, window: "1:00 – 1:45pm", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "3,600" },
    ],
    chart: {
      times: ["11:00","11:15","11:30","11:45","12:00","12:15","12:30","12:45","1:00","1:15","1:30","1:45","2:00","2:15","3:00"],
      withoutWaveIn: [350,350,380,420,480,700,1100,2800,5600,7800,7400,4600,1800,700,300],
      withWaveIn:    [250,800,1700,2200,2500,2700,2800,2700,2600,2500,2400,2000,1200,500,200],
      kickoffIndex: 14, kickoffLabel: "Kickoff ⚽", yMax: 8500,
    },
  },
  {
    id: "wc26-bra-mex", category: "WC26", emoji: "⚽",
    label: "Brazil vs Mexico", date: "Jun 28, 2026", kickoff: "7:00pm KO", totalFans: "72,000",
    counters: { co2Target: 53800, martaTarget: 2240, co2Ceiling: 68000, martaCeiling: 3000 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "4:30 – 5:15pm", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free drink + Priority Gate", fans: "5,900" },
      { name: "Wave 2", dot: W2, window: "5:15 – 5:45pm", zones: "Midtown, Buckhead",  transport: "MARTA / Rideshare",  reward: "$10 concession credit",       fans: "7,500" },
      { name: "Wave 3", dot: W3, window: "5:45 – 6:15pm", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "5,200" },
      { name: "Wave 4", dot: W4, window: "6:00 – 6:45pm", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "3,900" },
    ],
    chart: {
      times: ["4:00","4:15","4:30","4:45","5:00","5:15","5:30","5:45","6:00","6:15","6:30","6:45","7:00","7:15"],
      withoutWaveIn: [500,500,550,600,700,900,1400,3000,5800,8000,7600,4800,1900,700],
      withWaveIn:    [400,1100,2100,2500,2800,2900,3000,2900,2700,2600,2500,2100,1200,500],
      kickoffIndex: 12, kickoffLabel: "Kickoff ⚽", yMax: 8500,
    },
  },

  // ── Atlanta Falcons ────────────────────────────────────────────────────────
  {
    id: "falcons-saints", category: "Falcons", emoji: "🏈",
    label: "Falcons vs Saints", date: "Sep 13, 2026", kickoff: "1:00pm KO", totalFans: "71,500",
    counters: { co2Target: 38600, martaTarget: 1420, co2Ceiling: 52000, martaCeiling: 2000 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "9:30 – 10:15am", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free drink + Priority Gate", fans: "5,100" },
      { name: "Wave 2", dot: W2, window: "10:15 – 10:45am", zones: "Midtown, Buckhead", transport: "MARTA / Rideshare", reward: "$10 concession credit", fans: "6,200" },
      { name: "Wave 3", dot: W3, window: "10:45 – 11:15am", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "5,800" },
      { name: "Wave 4", dot: W4, window: "11:00 – 11:45am", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "4,400" },
    ],
    chart: {
      times: ["9:00","9:15","9:30","9:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00","12:15","1:00"],
      withoutWaveIn: [200,250,300,380,500,800,1400,3200,5500,7000,6800,4000,1400,500,200],
      withWaveIn:    [150,600,1400,1900,2300,2500,2500,2400,2300,2200,2100,1800,1000,400,150],
      kickoffIndex: 14, kickoffLabel: "Kickoff 🏈", yMax: 7500,
    },
  },
  {
    id: "falcons-panthers", category: "Falcons", emoji: "🏈",
    label: "Falcons vs Panthers", date: "Oct 18, 2026", kickoff: "4:25pm KO", totalFans: "70,800",
    counters: { co2Target: 41200, martaTarget: 1580, co2Ceiling: 55000, martaCeiling: 2200 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "1:00 – 1:45pm", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free drink + Priority Gate", fans: "5,000" },
      { name: "Wave 2", dot: W2, window: "1:45 – 2:15pm", zones: "Midtown, Buckhead", transport: "MARTA / Rideshare", reward: "$10 concession credit", fans: "6,500" },
      { name: "Wave 3", dot: W3, window: "2:15 – 2:45pm", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "5,600" },
      { name: "Wave 4", dot: W4, window: "2:30 – 3:15pm", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "4,200" },
    ],
    chart: {
      times: ["12:30","12:45","1:00","1:15","1:30","1:45","2:00","2:15","2:30","2:45","3:00","3:15","3:30","4:00","4:25"],
      withoutWaveIn: [250,300,350,450,600,900,1600,3400,5800,7100,6700,3800,1300,400,150],
      withWaveIn:    [200,700,1600,2100,2400,2600,2600,2500,2400,2300,2100,1700,900,350,100],
      kickoffIndex: 14, kickoffLabel: "Kickoff 🏈", yMax: 7500,
    },
  },

  // ── Atlanta United ─────────────────────────────────────────────────────────
  {
    id: "united-inter-miami", category: "Atlanta United", emoji: "⚽",
    label: "Atlanta United vs Inter Miami", date: "Aug 8, 2026", kickoff: "7:30pm KO", totalFans: "42,300",
    counters: { co2Target: 24100, martaTarget: 1180, co2Ceiling: 35000, martaCeiling: 1800 },
    waveTable: [
      { name: "Wave 1", dot: W1, window: "5:00 – 5:45pm", zones: "Airport, Downtown", transport: "MARTA Priority", reward: "Free drink + Priority Gate", fans: "3,200" },
      { name: "Wave 2", dot: W2, window: "5:45 – 6:15pm", zones: "Midtown, Buckhead", transport: "MARTA / Rideshare", reward: "$10 concession credit", fans: "4,100" },
      { name: "Wave 3", dot: W3, window: "6:15 – 6:45pm", zones: "Decatur, Sandy Springs", transport: "Driving / Rideshare", reward: "Standard entry + $5 credit", fans: "3,400" },
      { name: "Wave 4", dot: W4, window: "6:30 – 7:15pm", zones: "Suburbs (30+ min)", transport: "Driving", reward: "Standard entry", fans: "2,100" },
    ],
    chart: {
      times: ["4:30","4:45","5:00","5:15","5:30","5:45","6:00","6:15","6:30","6:45","7:00","7:15","7:30","7:45"],
      withoutWaveIn: [150,200,250,350,500,800,1500,3200,4800,5200,4600,2400,800,300],
      withWaveIn:    [100,400,900,1400,1800,2100,2200,2100,2000,1900,1700,1400,700,250],
      kickoffIndex: 12, kickoffLabel: "Kickoff ⚽", yMax: 5500,
    },
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

// Recompute every event's counters from its own wave table so the displayed
// CO₂ + MARTA numbers are derived, not hand-set. The inline `counters` above are
// discarded here.
export const EVENTS = EVENTS_RAW.map((e) => ({
  ...e,
  counters: deriveCounters(e.waveTable),
}));

// ─── Defaults (used by FanView and as the organizer's initial selection) ─────
export const EVENT = EVENTS[0];
export const COUNTERS = EVENTS[0].counters;
export const WAVE_TABLE = EVENTS[0].waveTable;

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
  { id: "marta-train", label: "🚆 MARTA Train (Recommended)" },
  { id: "marta-bus", label: "🚌 MARTA Bus" },
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
