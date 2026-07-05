"use client";

export function ParallaxGrid() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Layer 1: Subtle Main Grid (80px lines) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(26, 36, 48, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26, 36, 48, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          backgroundPosition: "center center",
        }}
      />

      {/* Layer 2: Technical Tech Marks (Crosshairs and ticks spaced at 240px) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle, rgba(74, 168, 255, 0.05) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "240px 240px",
          backgroundPosition: "center center",
          opacity: 0.8,
        }}
      />
    </div>
  );
}
