// Wave-assignment logic. Accepts the selected event's wave table so it works
// across all event types, not just the original WC26 hardcoded windows.

const WAVE_COLORS = { 1: "#00ff87", 2: "#ffd23f", 3: "#ff9500", 4: "#ff4444" };

// Parse "4:30pm", "10:15am", "6:45pm" → minutes from midnight
export function parseTime(str) {
  const s = str.trim().toLowerCase();
  const pm = s.includes("pm");
  const am = s.includes("am");
  const [h, m] = s.replace("pm", "").replace("am", "").split(":").map(Number);
  let hour = h;
  if (pm && hour !== 12) hour += 12;
  if (am && hour === 12) hour = 0;
  return hour * 60 + (m || 0);
}

// Minutes-from-midnight → "4:30pm" / "9:15am"
export function formatTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h >= 12 ? "pm" : "am";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")}${ampm}`;
}

// End time of a "H:MMam – H:MMpm" window string, in minutes from midnight
function windowEnd(windowStr) {
  const [, end] = windowStr.split(" – ");
  return parseTime(end);
}

// Any MARTA variant (train or bus) counts as transit.
const isMarta = (transport) => transport === "marta" || transport?.startsWith("marta");

// Transport + origin → preferred wave tier (1-indexed)
function preferredTier(origin, transport) {
  if (isMarta(transport)) {
    // Rail reaches the early priority waves; bus is one tier back since it's slower.
    const railEarly = transport === "marta-train";
    if (origin === "airport" || origin === "downtown") return railEarly ? 1 : 2;
    if (origin === "midtown") return railEarly ? 1 : 2;
    return 2;
  }
  if (transport === "rideshare") return 3;
  // driving
  if (origin === "suburbs") return 4;
  if (origin === "downtown" || origin === "midtown") return 2;
  return 3;
}

export function computeWave(origin, transport, earliestArrivalMin = 0, waveTable = null) {
  const transitBonus = isMarta(transport);
  const priority = transitBonus && (origin === "airport" || origin === "downtown");

  // Pick tier from origin+transport, clamp to table length
  let tier = preferredTier(origin, transport);
  const table = waveTable || [
    { name: "Wave 1", dot: "#00ff87", window: "4:30 – 5:15pm", reward: "Free drink + Priority Gate" },
    { name: "Wave 2", dot: "#ffd23f", window: "5:15 – 5:45pm", reward: "$10 concession credit" },
    { name: "Wave 3", dot: "#ff9500", window: "5:45 – 6:15pm", reward: "$5 concession credit" },
    { name: "Wave 4", dot: "#ff4444", window: "6:00 – 6:45pm", reward: "Standard entry" },
  ];

  tier = Math.min(tier, table.length); // don't exceed table
  let entry = table[tier - 1];

  // Apply transit bonus suffix to reward if applicable
  let reward = entry.reward;
  if (transitBonus && !reward.includes("Transit Bonus")) reward += " + 🌱 Transit Bonus";

  // If fan can't arrive before their wave's window closes, bump to a later wave
  if (earliestArrivalMin > 0) {
    const fits = (w) => earliestArrivalMin <= windowEnd(w.window);
    if (!fits(entry)) {
      const later = table.slice(tier).find(fits);
      if (later) {
        entry = later;
        tier = table.indexOf(later) + 1;
        reward = later.reward;
        if (transitBonus && !reward.includes("Transit Bonus")) reward += " + 🌱 Transit Bonus";
      }
    }
  }

  const title = priority && tier === 1
    ? `${entry.name.toUpperCase()} — PRIORITY`
    : entry.name.toUpperCase();

  return {
    wave: tier,
    title,
    window: entry.window,
    reward,
    transitBonus,
    priority: priority && tier === 1,
    color: WAVE_COLORS[tier] || "#00ff87",
  };
}

// Window start time (minutes) of a "H:MM – H:MMpm" string. The start often omits
// am/pm (e.g. "4:30 – 5:15pm"), so inherit the suffix from the end when missing.
function windowStart(windowStr) {
  const [start, end] = windowStr.split(" – ");
  const hasSuffix = /am|pm/i.test(start);
  const suffix = /pm/i.test(end) ? "pm" : "am";
  return parseTime(hasSuffix ? start : start + suffix);
}

// ─── Live arrival chart, built from actual fan submissions ───────────────────
//
// Each submission is { earliestArrivalMin, assignedWindow } captured when a fan
// finishes the Fan View questionnaire.
//   • red  (withoutWaveIn) — bucketed by the fan's self-reported EARLIEST arrival
//                            time (what they'd do with no staggering)
//   • green (withWaveIn)   — bucketed by the START of the wave window they were
//                            ASSIGNED (where WaveIn actually routes them)
//
// Slots are 15-min buckets spanning the event's wave windows through kickoff.
export function buildChartFromSubmissions(event, submissions) {
  const koMin = parseTime(event.kickoff);
  const startsAll = event.waveTable.map((w) => windowStart(w.window));
  const startMin = Math.min(...startsAll);
  const endMin = Math.max(koMin + 15, ...event.waveTable.map((w) => windowEnd(w.window)));

  const slotCount = Math.round((endMin - startMin) / 15) + 1;
  const slotMins = Array.from({ length: slotCount }, (_, i) => startMin + i * 15);
  const times = slotMins.map(formatTime);

  // Nearest slot index for a given minute value.
  const slotIndex = (min) => {
    const i = Math.round((min - startMin) / 15);
    return Math.max(0, Math.min(slotCount - 1, i));
  };

  const withoutWaveIn = new Array(slotCount).fill(0);
  const withWaveIn = new Array(slotCount).fill(0);

  for (const s of submissions) {
    withoutWaveIn[slotIndex(s.earliestArrivalMin)] += 1;
    withWaveIn[slotIndex(windowStart(s.assignedWindow))] += 1;
  }

  const kickoffIndex = slotIndex(koMin);
  const yMax = Math.max(10, ...withoutWaveIn, ...withWaveIn);

  return {
    times, withoutWaveIn, withWaveIn,
    kickoffIndex, kickoffLabel: event.chart?.kickoffLabel || "Kickoff",
    yMax: Math.ceil(yMax / 10) * 10,
  };
}

// Seed an event with simulated fan submissions derived from its wave table, so
// the chart looks populated before any real fans submit. Each wave contributes
// its `fans` count: assigned to that wave's window, and "earliest" times skewed
// toward kickoff (the last-minute rush WaveIn is built to spread out).
export function seedSubmissions(event) {
  const koMin = parseTime(event.kickoff);
  const out = [];
  for (const w of event.waveTable) {
    const n = Math.max(1, Math.round(Number(String(w.fans).replace(/[^0-9.]/g, "")) / 100));
    const wStart = windowStart(w.window);
    for (let i = 0; i < n; i++) {
      // Earliest arrivals cluster late (between this wave's start and kickoff),
      // biased toward kickoff via squaring a random factor.
      const r = Math.random() ** 2;
      const earliest = Math.round((wStart + (koMin - wStart) * r) / 15) * 15;
      out.push({ earliestArrivalMin: earliest, assignedWindow: w.window });
    }
  }
  return out;
}

// Generate a simulated arrival chart for a newly created event.
// kickoffStr: "7:00pm", totalFans: number
export function generateChart(kickoffStr, totalFans) {
  const koMin = parseTime(kickoffStr);
  // 14 slots of 15 min, ending at KO + 15
  const slotCount = 14;
  const endMin = koMin + 15;
  const startMin = endMin - slotCount * 15;
  const times = Array.from({ length: slotCount }, (_, i) => formatTime(startMin + i * 15));
  const kickoffIndex = slotCount - 2; // second-to-last slot is KO

  // Scale from WC26 base (68400 fans → peaks of ~7200 without, ~2800 with)
  const scale = totalFans / 68400;
  const baseWithout = [400,400,420,450,500,650,900,2200,4800,7200,7100,4200,1500,600];
  const baseWith    = [300,900,1900,2300,2600,2700,2800,2700,2600,2500,2400,2000,1100,500];
  const round = (v) => Math.round(v / 50) * 50;

  return {
    times,
    withoutWaveIn: baseWithout.map((v) => round(v * scale)),
    withWaveIn: baseWith.map((v) => round(v * scale)),
    kickoffIndex,
    kickoffLabel: "Event Start",
    yMax: Math.round((8000 * scale) / 500) * 500,
  };
}
