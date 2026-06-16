// ─────────────────────────────────────────────────────────────────────────────
// Logistics model — derives CO₂ + MARTA-shift counters from the SAME data that
// already drives the rest of the app: per-wave fan counts, the transport mode of
// each wave, and the origin zones each wave serves. Nothing here is a magic
// counter value — every number flows from the wave table plus the zone-distance
// lookup below.
//
// The ONLY hand-set constants are the ones that physically determine CO₂ usage
// (grams of CO₂ per vehicle-km and average car occupancy) — those are emissions
// science, not logistics, so they can't be derived from attendance data.
// ─────────────────────────────────────────────────────────────────────────────

// Real driving distances (km) from each Atlanta origin zone to Mercedes-Benz
// Stadium, sourced from Google Maps / Rome2Rio road distances. These describe
// the city's geography, not the demo — they're the same regardless of event.
//   Downtown ~1.5mi · Midtown ~3mi · Buckhead 7mi · Decatur 7.4mi ·
//   ATL Airport 10.4mi · Sandy Springs 14.4mi · Perimeter/Dunwoody 14.1mi ·
//   Suburbs ~28mi · Out-of-state ~50mi
export const ZONE_DISTANCE_KM = {
  airport: 16.7,
  downtown: 2.4,
  "downtown hotels": 2.4,
  midtown: 4.8,
  buckhead: 11.3,
  perimeter: 22.7,
  decatur: 11.9,
  "sandy springs": 23.2,
  suburbs: 45.0,
  "out-of-state": 80.0,
};

// Emissions science — the inputs the user flagged as "what determines CO₂ usage".
// Not derivable from attendance data, so set from published figures:
//   • Average US passenger-car tailpipe CO₂ (EPA): ~0.21 kg per km
//   • A car shifted to MARTA avoids a ROUND trip, so distance counts twice
//   • Average event-day car occupancy: ~2.0 people per vehicle
const CO2_KG_PER_VEHICLE_KM = 0.21;
const AVG_CAR_OCCUPANCY = 2.0;
const ROUND_TRIP = 2;

// ─── helpers ────────────────────────────────────────────────────────────────

// "5,200" → 5200
export function parseFans(str) {
  return Number(String(str).replace(/[^0-9.]/g, "")) || 0;
}

// Split a wave's "zones" string ("Airport, Downtown hotels") into distance keys.
function zoneKeys(zonesStr) {
  return zonesStr
    .toLowerCase()
    .split(/[,/]/)
    .map((z) => z.trim())
    .map((z) =>
      z
        .replace(/\(.*?\)/g, "")        // drop "(30+ min)" etc.
        .replace(/\b(hotels?|station)\b/g, "") // normalize "downtown hotels" → "downtown"
        .trim()
    )
    .filter(Boolean);
}

// Average distance (km) for a wave, from the zones it serves. Falls back to the
// city-wide mean if a zone label isn't in the lookup (e.g. a custom event).
function waveDistanceKm(zonesStr) {
  const keys = zoneKeys(zonesStr);
  const known = keys
    .map((k) => ZONE_DISTANCE_KM[k] ?? ZONE_DISTANCE_KM[k.split(" ")[0]])
    .filter((d) => typeof d === "number");
  if (known.length) return known.reduce((a, b) => a + b, 0) / known.length;
  const all = Object.values(ZONE_DISTANCE_KM);
  return all.reduce((a, b) => a + b, 0) / all.length;
}

// Does this wave's transport mode put it on MARTA at all?
function isMartaWave(transport) {
  return /marta/i.test(transport);
}

// ─── public: derive counters from a wave table ───────────────────────────────
//
// martaTarget   — fans WaveIn actively routes to MARTA: the fan counts of every
//                 wave whose transport mode includes MARTA. (Data: wave.fans +
//                 wave.transport.)
// martaCeiling  — Option A: every fan who *could* take MARTA, i.e. all fans whose
//                 origin zone is MARTA-reachable (within ~rail/bus range of the
//                 stadium), regardless of which wave they landed in. The progress
//                 bar therefore shows "what share of the MARTA-able crowd we
//                 captured." (Data: wave.fans + wave.zones + zone distance.)
// co2Target     — for each MARTA wave, fans × round-trip × that wave's real avg
//                 distance × CO₂/km ÷ occupancy. Distance is per-wave, so a wave
//                 serving the airport saves more than one serving downtown.
// co2Ceiling    — same calc applied to the ceiling crowd (all MARTA-able fans),
//                 weighted by each wave's distance.
//
// A zone is "MARTA-reachable" if its road distance is within the farthest zone
// MARTA rail meaningfully serves — Sandy Springs / Dunwoody sit at the end of the
// Red line (~23 km), so we use that as the cutoff rather than a guessed percentage.
const MARTA_RANGE_KM = Math.max(
  ZONE_DISTANCE_KM["sandy springs"],
  ZONE_DISTANCE_KM.perimeter
);

export function deriveCounters(waveTable) {
  let martaTarget = 0;
  let martaCeiling = 0;
  let co2Target = 0;
  let co2Ceiling = 0;

  for (const w of waveTable) {
    const fans = parseFans(w.fans);
    const distKm = waveDistanceKm(w.zones);
    const co2PerFan = (distKm * ROUND_TRIP * CO2_KG_PER_VEHICLE_KM) / AVG_CAR_OCCUPANCY;

    // Ceiling crowd: anyone whose wave's zones are within MARTA range.
    const martaReachable = distKm <= MARTA_RANGE_KM;
    if (martaReachable) {
      martaCeiling += fans;
      co2Ceiling += fans * co2PerFan;
    }

    // Target crowd: waves WaveIn actually routes onto MARTA.
    if (isMartaWave(w.transport)) {
      martaTarget += fans;
      co2Target += fans * co2PerFan;
    }
  }

  return {
    martaTarget: Math.round(martaTarget),
    martaCeiling: Math.round(martaCeiling),
    co2Target: Math.round(co2Target),
    co2Ceiling: Math.round(co2Ceiling),
  };
}
