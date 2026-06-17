"use client";
import { useState } from "react";
import Nav from "@/components/Nav";
import OrganizerView from "@/components/OrganizerView";
import FanView from "@/components/FanView";
import { EVENTS } from "@/lib/data";
import { seedSubmissions } from "@/lib/waveLogic";

// Seed each event with simulated fan submissions so the Organizer chart looks
// populated before any real fans complete the Fan View form. Keyed by event id.
const seedAll = (events) =>
  Object.fromEntries(events.map((e) => [e.id, seedSubmissions(e)]));

export default function Home() {
  const [view, setView] = useState("organizer");
  const [events, setEvents] = useState(EVENTS);
  // { [eventId]: [{ earliestArrivalMin, assignedWindow }, ...] }
  const [submissions, setSubmissions] = useState(() => seedAll(EVENTS));

  const handleCreateEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
    setSubmissions((prev) => ({ ...prev, [newEvent.id]: seedSubmissions(newEvent) }));
  };

  // Called when a fan finishes the questionnaire — appends their real submission.
  const handleFanSubmit = (eventId, submission) => {
    setSubmissions((prev) => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), submission],
    }));
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <Nav view={view} setView={setView} />
      {view === "organizer"
        ? <OrganizerView events={events} submissions={submissions} onCreateEvent={handleCreateEvent} />
        : <FanView events={events} onFanSubmit={handleFanSubmit} />}
    </main>
  );
}
