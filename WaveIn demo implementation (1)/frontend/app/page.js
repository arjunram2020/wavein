"use client";
import { useState } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import Nav from "@/components/Nav";
import LandingPage from "@/components/LandingPage";
import OrganizerView from "@/components/OrganizerView";
import FanView from "@/components/FanView";
import LoginModal from "@/components/LoginModal";

// Single-page app: a `screen` state machine (landing → dashboard / fan) plus a
// role-aware login modal. The modal doesn't authenticate yet — it just routes.
export default function Home() {
  const [screen, setScreen] = useState("landing"); // 'landing' | 'organizer' | 'fan'
  const [modalRole, setModalRole] = useState(null); // null = closed

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
      {screen === "organizer" && <OrganizerView />}
      {screen === "fan" && <FanView />}

      {modalRole && (
        <LoginModal role={modalRole} onClose={closeModal} onEnter={modalEnter} />
      )}
    </main>
  );
}
