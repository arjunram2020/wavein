"use client";

// Fixed, non-interactive layer of three drifting gradient blobs.
// All page content should sit in a `position: relative; z-index: 1` layer above.
export default function AmbientBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", width: "62vw", height: "62vw", left: "-12vw", top: "-14vh",
        background: "radial-gradient(circle, rgba(232,180,90,.16), transparent 62%)",
        filter: "blur(36px)", animation: "drift1 24s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: "58vw", height: "58vw", right: "-16vw", top: "18vh",
        background: "radial-gradient(circle, rgba(52,116,196,.20), transparent 62%)",
        filter: "blur(46px)", animation: "drift2 30s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: "52vw", height: "52vw", left: "24vw", bottom: "-24vh",
        background: "radial-gradient(circle, rgba(91,214,160,.12), transparent 62%)",
        filter: "blur(48px)", animation: "drift3 34s ease-in-out infinite",
      }} />
    </div>
  );
}
