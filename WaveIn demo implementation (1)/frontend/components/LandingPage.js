"use client";
import { EVENTS } from "@/lib/data";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import StadiumHero from "./StadiumHero";
import ArrivalChart from "./ArrivalChart";

const serif = "var(--font-serif)";
const chart = EVENTS[0].chart;

// Full-season projection + equivalencies (presentation constants — not part of
// the per-event lib data).
const SEASON = { co2: 408000, trees: 2190, cars: 89, flights: 51 };

function Eyebrow({ color, children }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "2px", color, textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

const sectionWrap = { maxWidth: 1180, margin: "0 auto" };

export default function LandingPage({ onOpenOrg, onOpenFan }) {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section style={{ ...sectionWrap, padding: "clamp(40px,6vw,84px) clamp(20px,4vw,40px) 30px", textAlign: "center" }}>
        <Reveal as="div" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 15px", border: "1px solid rgba(232,180,90,.32)", borderRadius: 999, background: "rgba(232,180,90,.07)", fontSize: 12.5, fontWeight: 600, letterSpacing: "1.6px", color: "var(--gold)", textTransform: "uppercase" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 10px var(--gold)" }} />
          FIFA World Cup 26 · Mercedes-Benz Stadium
        </Reveal>
        <Reveal as="h1" delay={0.08} style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(42px,7.4vw,90px)", lineHeight: 1.0, letterSpacing: "-.5px", margin: "26px auto 0", maxWidth: "14ch", color: "var(--text-bright)" }}>
          Every fan has the same target.<br />
          <span style={{ fontStyle: "italic", color: "var(--gold)" }}>We give them a better one.</span>
        </Reveal>
        <Reveal as="p" delay={0.16} style={{ maxWidth: "56ch", margin: "24px auto 0", fontSize: "clamp(16px,1.7vw,19px)", lineHeight: 1.6, color: "#A9B5C8" }}>
          WaveIn gives every fan a personalized arrival window — easing the crush at kickoff, cutting idling emissions, and rewarding the ones who come early and ride transit.
        </Reveal>
        <Reveal delay={0.24} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 34 }}>
          <button onClick={onOpenOrg} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 28px", borderRadius: 13, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700, color: "#1A1206", background: "linear-gradient(180deg,#F0C572,#E0A24A)", boxShadow: "0 10px 28px rgba(224,162,74,.32)" }}>
            I&apos;m an Organizer<span style={{ fontSize: 18 }}>→</span>
          </button>
          <button onClick={onOpenFan} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 28px", borderRadius: 13, cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700, color: "var(--text)", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.16)" }}>
            I&apos;m a Fan<span style={{ fontSize: 18 }}>→</span>
          </button>
        </Reveal>

        <Reveal delay={0.3} style={{ marginTop: 54, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,.09)", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
          <StadiumHero />
        </Reveal>
        <Reveal delay={0.4} style={{ marginTop: 18, fontSize: 13, color: "var(--muted-4)", letterSpacing: ".3px" }}>
          Illustration — the problem WaveIn solves: 70,000 fans converging on one target.
        </Reveal>
      </section>

      {/* ─── PROBLEM ──────────────────────────────────────────── */}
      <section style={{ ...sectionWrap, padding: "clamp(60px,9vw,120px) clamp(20px,4vw,40px) 30px" }}>
        <Reveal style={{ textAlign: "center", maxWidth: "64ch", margin: "0 auto" }}>
          <Eyebrow color="var(--red)">The problem</Eyebrow>
          <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(32px,5vw,60px)", lineHeight: 1.05, letterSpacing: "-.4px", margin: "14px 0 0", color: "var(--text-bright)" }}>
            70,000 fans. One target.<br />
            <span style={{ color: "var(--red)", fontStyle: "italic" }}>One catastrophic spike.</span>
          </h2>
          <p style={{ margin: "18px auto 0", fontSize: 17, lineHeight: 1.6, color: "#A9B5C8", maxWidth: "52ch" }}>
            When everyone aims for kickoff, arrivals collapse into a single 15-minute window — gridlock, idling engines, and a wall of carbon.
          </p>
        </Reveal>
        <Reveal delay={0.12} style={{ marginTop: 42, background: "linear-gradient(180deg,rgba(226,104,91,.07),rgba(13,19,31,.4))", border: "1px solid rgba(226,104,91,.18)", borderRadius: 20, padding: "30px clamp(16px,3vw,34px)" }}>
          <ArrivalChart chart={chart} variant="problem" height={320} />
        </Reveal>
      </section>

      {/* ─── SOLUTION ─────────────────────────────────────────── */}
      <section style={{ ...sectionWrap, padding: "clamp(40px,6vw,80px) clamp(20px,4vw,40px) 30px" }}>
        <Reveal style={{ textAlign: "center", maxWidth: "64ch", margin: "0 auto" }}>
          <Eyebrow color="var(--green)">The solution</Eyebrow>
          <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(32px,5vw,60px)", lineHeight: 1.05, letterSpacing: "-.4px", margin: "14px 0 0", color: "var(--text-bright)" }}>
            WaveIn spreads arrivals across<br />
            <span style={{ color: "var(--green)", fontStyle: "italic" }}>the full entry window.</span>
          </h2>
          <p style={{ margin: "18px auto 0", fontSize: 17, lineHeight: 1.6, color: "#A9B5C8", maxWidth: "52ch" }}>
            Personalized waves flatten the spike into a smooth, manageable flow — fewer idling engines, calmer gates, a better night.
          </p>
        </Reveal>
        <Reveal delay={0.12} style={{ marginTop: 42, background: "linear-gradient(180deg,rgba(91,214,160,.06),rgba(13,19,31,.4))", border: "1px solid rgba(255,255,255,.09)", borderRadius: 20, padding: "30px clamp(16px,3vw,34px)" }}>
          <div style={{ display: "flex", gap: 22, justifyContent: "flex-end", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--red)" }}>
              <span style={{ width: 14, height: 3, borderRadius: 2, background: "var(--red)" }} />Without WaveIn
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--green)" }}>
              <span style={{ width: 14, height: 3, borderRadius: 2, background: "var(--green)" }} />With WaveIn
            </span>
          </div>
          <ArrivalChart chart={chart} variant="solution" height={320} />
        </Reveal>
      </section>

      {/* ─── HOW IT WORKS (cream) ─────────────────────────────── */}
      <section style={{ background: "var(--cream-bg)", color: "var(--ink-on-cream)", marginTop: "clamp(50px,7vw,100px)", padding: "clamp(60px,8vw,108px) clamp(20px,4vw,40px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, right: -80, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(224,162,74,.16),transparent 70%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <Reveal style={{ textAlign: "center" }}>
            <Eyebrow color="var(--gold-on-cream)">How it works</Eyebrow>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(32px,4.8vw,58px)", lineHeight: 1.05, letterSpacing: "-.3px", margin: "12px 0 0", color: "var(--ink-on-cream)" }}>
              Three steps to a <span style={{ fontStyle: "italic", color: "var(--gold-on-cream)" }}>better arrival.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 46 }}>
            <HowCard n="01" title="Enter your origin" body="Tell WaveIn where you're starting and how you'll travel — MARTA, driving, or rideshare.">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1A2235" strokeWidth="1.6"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>
            </HowCard>
            <HowCard n="02" title="Get your wave" body="In seconds, you're matched to a personalized arrival window — with priority for the early & green.">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1A2235" strokeWidth="1.6"><path d="M3 13c3-5 6-5 9 0s6 5 9 0" /><path d="M3 18c3-5 6-5 9 0s6 5 9 0" opacity=".5" /></svg>
            </HowCard>
            <HowCard n="03" title="Arrive stress-free" body="Glide past the crush, walk into a calmer gate, and unlock rewards for showing up smart.">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1A2235" strokeWidth="1.6"><path d="M20 7H4v5h16V7Z" /><path d="M5 12v8h14v-8M12 7v13M12 7S9 3 7 4.5 9 7 12 7Zm0 0s3-4 5-2.5S15 7 12 7Z" /></svg>
            </HowCard>
          </Reveal>
        </div>
      </section>

      {/* ─── SUSTAINABILITY ───────────────────────────────────── */}
      <section style={{ position: "relative", padding: "clamp(70px,9vw,128px) clamp(20px,4vw,40px)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 0%,rgba(91,214,160,.10),transparent 60%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <Reveal>
            <Eyebrow color="var(--green)">Sustainability impact</Eyebrow>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(32px,5vw,60px)", lineHeight: 1.04, letterSpacing: "-.4px", margin: "12px 0 0", color: "var(--text-bright)" }}>
              A small change, at <span style={{ fontStyle: "italic", color: "var(--green)" }}>stadium scale.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 44, background: "linear-gradient(180deg,rgba(91,214,160,.10),rgba(13,22,30,.55))", border: "1px solid rgba(91,214,160,.22)", borderRadius: 24, padding: "clamp(34px,5vw,56px)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "1.4px", color: "var(--green-soft)", textTransform: "uppercase" }}>Projected across 8 WC26 games</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
              <CountUp to={SEASON.co2} duration={2100} style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(58px,11vw,128px)", lineHeight: 1, color: "var(--green)", letterSpacing: "-1px" }} />
              <span style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 700, color: "#CDEFDF" }}>kg CO₂ eliminated</span>
            </div>
            <div style={{ width: 120, height: 3, borderRadius: 2, background: "linear-gradient(90deg,transparent,#5BD6A0,transparent)", margin: "26px auto 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 34 }}>
              <EquivCard emoji="🌳" to={SEASON.trees} label="trees planted" />
              <EquivCard emoji="🚗" to={SEASON.cars} label="cars removed for a year" />
              <EquivCard emoji="✈️" to={SEASON.flights} label="transatlantic flights offset" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── TWO PATHS CTA ────────────────────────────────────── */}
      <section style={{ ...sectionWrap, padding: "clamp(20px,3vw,40px) clamp(20px,4vw,40px) clamp(70px,9vw,120px)" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 38 }}>
          <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(30px,4.6vw,56px)", letterSpacing: "-.3px", margin: 0, color: "var(--text-bright)" }}>
            Choose your <span style={{ fontStyle: "italic", color: "var(--gold)" }}>side of the wave.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Organizers */}
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 22, padding: "clamp(30px,4vw,46px)", background: "linear-gradient(160deg,#16243F,#0D1729)", border: "1px solid rgba(255,255,255,.09)", minHeight: 300, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(52,116,196,.3),transparent 70%)" }} />
            <Eyebrow color="#7FA8E0">For Organizers</Eyebrow>
            <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(26px,3.4vw,38px)", margin: "12px 0 0", lineHeight: 1.1, color: "var(--text)" }}>Run the night from one command center.</h3>
            <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.6, color: "#9FB0C8", flex: 1 }}>Live arrival curves, wave assignments, and real-time CO₂ savings for city operators, event staff, and MARTA.</p>
            <button onClick={onOpenOrg} style={{ alignSelf: "flex-start", marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 26px", borderRadius: 12, border: "1px solid rgba(127,168,224,.4)", cursor: "pointer", fontFamily: "inherit", fontSize: 15.5, fontWeight: 700, color: "var(--text)", background: "rgba(52,116,196,.18)" }}>
              Open the dashboard <span>→</span>
            </button>
          </div>
          {/* Fans */}
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 22, padding: "clamp(30px,4vw,46px)", background: "linear-gradient(160deg,#F6EFE2,#EFE2CC)", border: "1px solid rgba(224,162,74,.3)", minHeight: 300, display: "flex", flexDirection: "column", color: "var(--ink-on-cream)" }}>
            <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(224,162,74,.3),transparent 70%)" }} />
            <Eyebrow color="var(--gold-on-cream)">For Fans</Eyebrow>
            <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(26px,3.4vw,38px)", margin: "12px 0 0", lineHeight: 1.1 }}>Find your wave in under a minute.</h3>
            <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.6, color: "#5A6276", flex: 1 }}>Get a personalized arrival window for WC26 — plus rewards when you come early and ride MARTA.</p>
            <button onClick={onOpenFan} style={{ alignSelf: "flex-start", marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 26px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 15.5, fontWeight: 700, color: "#1A1206", background: "linear-gradient(180deg,#F0C572,#E0A24A)", boxShadow: "0 10px 26px rgba(224,162,74,.32)" }}>
              Find my wave <span>→</span>
            </button>
          </div>
        </Reveal>

        <div style={{ textAlign: "center", marginTop: 48, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 15, fontWeight: 700, color: "var(--muted-1)" }}>
            Wave<span style={{ color: "var(--gold)" }}>In</span>
            <span style={{ color: "var(--muted-4)", fontWeight: 500, marginLeft: 6 }}>· Play With Purpose · Atlanta 2026</span>
          </span>
          <span style={{ fontSize: 13, color: "var(--muted-4)" }}>Free Kick Track — Events &amp; Entertainment</span>
        </div>
      </section>
    </div>
  );
}

function HowCard({ n, title, body, children }) {
  return (
    <div style={{ background: "var(--cream-card)", border: "1px solid rgba(26,34,53,.08)", borderRadius: 18, padding: "30px 26px", boxShadow: "0 16px 40px rgba(120,90,40,.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <span style={{ fontFamily: serif, fontSize: 40, color: "var(--gold-btn-bot)", lineHeight: 1 }}>{n}</span>
        {children}
      </div>
      <h3 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-.2px" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--muted-on-cream)" }}>{body}</p>
    </div>
  );
}

function EquivCard({ emoji, to, label }) {
  return (
    <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "26px 18px" }}>
      <div style={{ fontSize: 30, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontFamily: serif, fontSize: "clamp(30px,4vw,48px)", color: "var(--text)", lineHeight: 1 }}>
        <CountUp to={to} duration={1800} />
      </div>
      <div style={{ fontSize: 14, color: "#9FB6AC", marginTop: 8, fontWeight: 600 }}>{label}</div>
    </div>
  );
}
