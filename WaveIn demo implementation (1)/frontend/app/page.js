"use client";
import { useState } from "react";
import Nav from "@/components/Nav";
import OrganizerView from "@/components/OrganizerView";
import FanView from "@/components/FanView";

export default function Home() {
  const [view, setView] = useState("organizer");

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <Nav view={view} setView={setView} />
      {view === "organizer" ? <OrganizerView /> : <FanView />}
    </main>
  );
}
