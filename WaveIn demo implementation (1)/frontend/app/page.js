"use client";
import { useState } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import Nav from "@/components/Nav";
import LandingPage from "@/components/LandingPage";
import OrganizerView from "@/components/OrganizerView";
import FanView from "@/components/FanView";
import LoginModal from "@/components/LoginModal";
import { EVENTS } from "@/lib/data";
import { seedSubmissions } from "@/lib/waveLogic";

// Seed each event with simulated fan submissions so the Organizer chart looks
// populated before any real fan completes the Fan View form. Keyed by event id.
const seedAll = (events) =>
  Object.fromEntries(events.map((e) => [e.id, seedSubmissions(e)]));

// Single-page app: a `screen` state machine (landing → dashboard / fan) plus a
// role-aware login modal. The modal doesn't authenticate yet — it just routes.
export default function Home() {
  const [screen, setScreen] = useState("landing"); // 'landing' | 'organizer' | 'fan'
  const [modalRole, setModalRole] = useState(null); // null = closed

  // Shared, lifted state so the Organizer chart reflects real fan submissions.
  const [events, setEvents] = useState(EVENTS);
  const [submissions, setSubmissions] = useState(() => seedAll(EVENTS));

  // Called when a fan finishes the questionnaire — appends their submission.
  const handleFanSubmit = (eventId, submission) =>
    setSubmissions((prev) => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), submission],
    }));

  // Called when an organizer creates an event — adds it and seeds its chart.
  const handleCreateEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
    setSubmissions((prev) => ({ ...prev, [newEvent.id]: seedSubmissions(newEvent) }));
  };

  const toTop = () => { try { window.scrollTo(0, 0); } catch {} };
  const go = (s) => { setScreen(s); setModalRole(null); toTop(); };

  const openModal = (role) => setModalRole(role);
  const closeModal = () => setModalRole(null);
  const modalEnter = (role) => { go(role === "organizer" ? "organizer" : "fan"); };

  return (
    <main style={{ position: "relative", minHeight: "100vh" }}>
      <AmbientBackground />
      <Nav
        screen={screen}
        onHome={() => go("landing")}
        onOrganizer={() => go("organizer")}
        onFan={() => go("fan")}
      />

      {screen === "landing" && (
        <LandingPage onOpenOrg={() => openModal("organizer")} onOpenFan={() => openModal("fan")} />
      )}
      {screen === "organizer" && <OrganizerView events={events} submissions={submissions} onCreateEvent={handleCreateEvent} />}
      {screen === "fan" && <FanView events={events} onFanSubmit={handleFanSubmit} />}

      {modalRole && (
        <LoginModal role={modalRole} onClose={closeModal} onEnter={modalEnter} />
      )}
    </main>
  );
}
