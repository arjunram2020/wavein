// Hardcoded wave-assignment lookup — identical rules to the frontend's
// lib/waveLogic.js. Kept in sync by hand for the demo; a future pass would
// make this the single source of truth and have the frontend call it.

const WAVE_COLORS = { 1: "#00ff87", 2: "#ffd23f", 3: "#ff9500", 4: "#ff4444" };

export function computeWave(origin, transport) {
  let wave, title, window, reward;
  let transitBonus = false;
  let priority = false;

  if (transport === "marta") {
    transitBonus = true;
    if (origin === "airport" || origin === "downtown") {
      wave = 1; priority = true; title = "WAVE 1 — PRIORITY"; window = "4:30 – 5:15pm";
      reward = "Free drink + Priority Gate Entry + 🌱 Transit Bonus";
    } else if (origin === "midtown") {
      wave = 1; title = "WAVE 1"; window = "5:00 – 5:30pm";
      reward = "$10 concession credit + 🌱 Transit Bonus";
    } else {
      wave = 2; title = "WAVE 2"; window = "5:15 – 5:45pm";
      reward = "$10 concession credit + 🌱 Transit Bonus";
    }
  } else if (transport === "rideshare") {
    wave = 3; title = "WAVE 3"; window = "5:45 – 6:15pm";
    reward = "$5 concession credit";
  } else {
    if (origin === "suburbs") {
      wave = 4; title = "WAVE 4"; window = "6:00 – 6:45pm"; reward = "Standard entry";
    } else if (origin === "downtown" || origin === "midtown") {
      wave = 2; title = "WAVE 2"; window = "5:15 – 5:45pm"; reward = "Standard entry";
    } else {
      wave = 3; title = "WAVE 3"; window = "5:45 – 6:15pm"; reward = "$5 concession credit";
    }
  }

  return { wave, title, window, reward, transitBonus, priority, color: WAVE_COLORS[wave] };
}
