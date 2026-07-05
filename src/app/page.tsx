"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollyCanvas, FRAME_COUNT } from "@/components/canvas/ScrollyCanvas";
import { LoadingScreen } from "@/components/canvas/LoadingScreen";
import { Navbar } from "@/components/ui/Navbar";
import { HeroText } from "@/components/ui/HeroText";
import { ScrollSections } from "@/components/ui/ScrollSections";
import { ParallaxGrid } from "@/components/ui/ParallaxGrid";
import { TelemetryOverlay } from "@/components/ui/TelemetryOverlay";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  const handleLoadProgress = useCallback((p: number) => {
    setLoadProgress(p);
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
    setTimeout(() => {
      setShowLoading(false);
      setTimeout(() => setHeroVisible(true), 700);
    }, 400);
  }, []);

  useScrollyCanvas({
    canvasRef,
    spacerRef,
    onLoadProgress: handleLoadProgress,
    onLoaded: handleLoaded,
  });

  // Prevent scroll while loading
  useEffect(() => {
    document.body.style.overflow = isLoaded ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isLoaded]);

  return (
    <>
      {/* ── Skip to Main Content Link (WCAG 2.4.1 Bypass Blocks) ── */}
      <a
        href="#main-content"
        style={{
          position: "fixed",
          top: "-100px",
          left: "1.5rem",
          zIndex: 10000,
          background: "#0A111B",
          color: "#4AA8FF",
          padding: "0.8rem 1.5rem",
          border: "1px solid #4AA8FF",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "top 0.2s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = "1.5rem";
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = "-100px";
        }}
      >
        Skip to Main Content
      </a>



      {/* ── Preloader / Loading Screen ───────────────── */}
      <LoadingScreen progress={loadProgress} isVisible={showLoading} />

      {/* ── Parallax Technical Grid Background ───────── */}
      {isLoaded && <ParallaxGrid />}

      {/* ── Telemetry HUD Information ────────────────── */}
      {heroVisible && <TelemetryOverlay />}

      {/* ── Fixed canvas (always behind) ─────────────── */}
      <canvas
        ref={canvasRef}
        id="sequenceCanvas"
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          display: "block",
          background: "#05070B",
        }}
      />

      {/* ── Edge vignette (non-interactive) ──────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 5,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 55% at 50% 50%, transparent 40%, rgba(5,7,11,0.6) 100%),
            linear-gradient(to bottom, rgba(5,7,11,0.5) 0%, transparent 15%, transparent 82%, rgba(5,7,11,0.85) 100%)
          `,
        }}
      />

      {/* ── Navbar ───────────────────────────────────── */}
      {heroVisible && <Navbar />}

      {/* ── Main Content Area (WCAG 1.3.1 Info and Relationships) ── */}
      <main id="main-content">
        {/* ── Hero copy ────────────────────────────────── */}
        <HeroText isVisible={heroVisible} />

        {/* ── Scroll spacer (800vh drives frame scrub) ─── */}
        <div
          ref={spacerRef}
          style={{
            height: "800vh",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Named anchors for nav links */}
          <div id="explore"      style={{ position: "absolute", top: "14%"  }} />
          <div id="engineering"  style={{ position: "absolute", top: "25%"  }} />
          <div id="technology"   style={{ position: "absolute", top: "50%"  }} />
          <div id="specs"        style={{ position: "absolute", top: "78%"  }} />
        </div>

        {/* ── Scroll-driven text panels ─────────────────── */}
        <ScrollSections />
      </main>

      {/* ── Dev frame indicator ───────────────────────── */}
      {process.env.NODE_ENV === "development" && isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            position: "fixed",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontSize: "0.42rem",
            letterSpacing: "0.15em",
            color: "rgba(26,36,48,0.5)",
            pointerEvents: "none",
          }}
        >
          {FRAME_COUNT} FRAMES · 800VH
        </motion.div>
      )}
    </>
  );
}
