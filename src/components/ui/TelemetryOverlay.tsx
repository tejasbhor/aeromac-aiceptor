"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export function TelemetryOverlay() {
  const [telemetry, setTelemetry] = useState({
    mouseX: "0.000",
    mouseY: "0.000",
    pitch: "0.00°",
    yaw: "0.00°",
    roll: "0.00°",
    velocity: "0.00m/s",
    systemStatus: "STABLE",
    frameRate: "60.0FPS",
  });

  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef({ lastY: 0, speed: 0 });
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    // Scroll velocity tracking
    const handleScroll = () => {
      const currentY = window.scrollY;
      const now = Date.now();
      const deltaT = Math.max(1, now - lastTimeRef.current);
      const deltaY = Math.abs(currentY - scrollRef.current.lastY);

      // Convert scroll difference to simulated speed metric
      scrollRef.current.speed = (deltaY / deltaT) * 12;
      scrollRef.current.lastY = currentY;
      lastTimeRef.current = now;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Coordinates normalized to center
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.x = nx;
      mouseRef.current.y = ny;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic telemetry calculations inside animation loop
    let rafId: number;
    let frameCount = 0;
    let fpsTime = Date.now();

    const loop = () => {
      frameCount++;
      const now = Date.now();
      if (now >= fpsTime + 1000) {
        const fps = ((frameCount * 1000) / (now - fpsTime)).toFixed(1);
        setTelemetry((prev) => ({ ...prev, frameRate: `${fps}FPS` }));
        frameCount = 0;
        fpsTime = now;
      }

      // Decay scroll speed metric slowly
      scrollRef.current.speed *= 0.95;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Simulated values calculated from physical state
      const targetPitch = (my * -12.5 + scrollRef.current.speed * 0.4).toFixed(2);
      const targetYaw = (mx * 18.0).toFixed(2);
      const targetRoll = (mx * 8.5 - my * 2.0).toFixed(2);
      const velocityNum = (scrollRef.current.speed + 1.2).toFixed(2);

      setTelemetry((prev) => ({
        ...prev,
        mouseX: mx.toFixed(3),
        mouseY: my.toFixed(3),
        pitch: `${targetPitch}°`,
        yaw: `${targetYaw}°`,
        roll: `${targetRoll}°`,
        velocity: `${velocityNum}m/s`,
        systemStatus: scrollRef.current.speed > 8 ? "DYN_COMP" : "STABLE",
      }));

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 15,
        pointerEvents: "none",
        fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
        fontSize: "0.5rem",
        color: "rgba(168, 178, 189, 0.4)",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        padding: "3rem",
      }}
    >
      {/* Top Left: Subsystem ID and FPS */}
      <div style={{ position: "absolute", top: "6.5rem", left: "3rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ width: "3px", height: "3px", backgroundColor: "#4AA8FF", borderRadius: "50%" }} />
          <span>SYS_CORE: v2.4_READY</span>
        </div>
        <div>RENDER_RATE: {telemetry.frameRate}</div>
        <div>LINK: TEL_SECURE</div>
      </div>

      {/* Mid-Left: Mouse coordinates and Yaw/Pitch/Roll simulation */}
      <div style={{ position: "absolute", top: "11.5rem", left: "3rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div>COORDS_GRID: X={telemetry.mouseX} / Y={telemetry.mouseY}</div>
        <div>PITCH: {telemetry.pitch}</div>
        <div>YAW: {telemetry.yaw}</div>
        <div>ROLL: {telemetry.roll}</div>
      </div>

      {/* Mid-Right: Velocities, Flight Stats and Status */}
      <div style={{ position: "absolute", top: "10rem", right: "3rem", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
        <div>EST_VELOCITY: {telemetry.velocity}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span>STATUS:</span>
          <span
            style={{
              color: telemetry.systemStatus === "STABLE" ? "#A8B2BD" : "#4AA8FF",
              transition: "color 0.2s ease",
            }}
          >
            {telemetry.systemStatus}
          </span>
        </div>
        <div>ALTITUDE: 1,480m ASL</div>
      </div>

      {/* Margins: Altitude and Heading tape graphics */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "3rem",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          opacity: 0.3,
        }}
      >
        {[20, 15, 10, 5, 0, -5, -10].map((tick) => (
          <div key={tick} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: tick === 0 ? "12px" : "6px", height: "1px", backgroundColor: "#A8B2BD" }} />
            {tick === 0 && <span style={{ fontSize: "0.45rem", color: "#4AA8FF" }}>HUD_ELEV</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
