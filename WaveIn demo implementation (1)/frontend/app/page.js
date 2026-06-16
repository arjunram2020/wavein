"use client";
import { useState } from "react";
import Nav from "@/components/Nav";
import OrganizerView from "@/components/OrganizerView";
import FanView from "@/components/FanView";
import { EVENTS } from "@/lib/data";

export default function Home() {
  const [view, setView] = useState("organizer");
  const [events, setEvents] = useState(EVENTS);

  const handleCreateEvent = (newEvent) => setEvents((prev) => [...prev, newEvent]);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <Nav view={view} setView={setView} />
      {view === "organizer"
        ? <OrganizerView events={events} onCreateEvent={handleCreateEvent} />
        : <FanView events={events} />}
    </main>
  );
}
