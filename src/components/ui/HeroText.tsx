"use client";

import { motion, type Variants, useScroll, useTransform } from "framer-motion";
import { TactileButton } from "@/components/ui/TactileButton";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "30%", filter: "blur(15px)" },
  show: {
    opacity: 1,
    y: "0%",
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
  },
};

const HEADING = "ENGINEERING THE FUTURE OF AUTONOMOUS FLIGHT";

interface HeroTextProps {
  isVisible: boolean;
}

export function HeroText({ isVisible }: HeroTextProps) {
  const words = HEADING.split(" ");

  // Fade the entire hero out as user scrolls into Act 1 (~first 8% of scroll)
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        pointerEvents: isVisible ? "auto" : "none",
        opacity: heroOpacity,
      }}
    >
      {/* ── Top-right: product label ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isVisible ? 1 : 0, x: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          top: "6rem",
          right: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.28em",
            color: "#4AA8FF",
            textTransform: "uppercase",
          }}
        >
          Autonomous Platform
        </p>
        <p
          style={{
            fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            color: "#1A2430",
            textTransform: "uppercase",
          }}
        >
          v2.4 — Flight Ready
        </p>
      </motion.div>

      {/* ── Bottom-left: headline + body + CTAs ─────── */}
      <div
        style={{
          position: "absolute",
          bottom: "4.5rem",
          left: "3rem",
          right: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Product name chip */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ width: "16px", height: "1px", background: "#4AA8FF" }} />
          <p
            style={{
              fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.3em",
              color: "#4AA8FF",
              textTransform: "uppercase",
            }}
          >
            AI-CEPTOR
          </p>
        </motion.div>

        {/* Big staggered headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            fontSize: "clamp(2rem, 4.8vw, 6rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 0.92,
            color: "#F8FAFC",
            maxWidth: "60vw",
            marginBottom: "2rem",
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              style={{ display: "inline-block", marginRight: "0.26em" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Row: subheading + CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.0, ease: [0.76, 0, 0.24, 1] }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "4rem",
            flexWrap: "wrap",
          }}
        >
          {/* Subheading */}
          <p
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: "0.7rem",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "#A8B2BD",
              maxWidth: "280px",
            }}
          >
            Precision engineered aerospace intelligence built for modern
            autonomous operations.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <TactileButton
              id="cta-explore"
              href="#explore"
              variant="primary"
              showIcon={true}
            >
              Explore AI-CEPTOR
            </TactileButton>

            <TactileButton
              id="cta-engineering"
              href="#engineering"
              variant="secondary"
              showIcon={false}
            >
              View Engineering
            </TactileButton>
          </div>
        </motion.div>
      </div>

      {/* ── Scroll indicator (right edge, vertical) ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        style={{
          position: "absolute",
          right: "3rem",
          bottom: "4.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "44px",
            background: "linear-gradient(to bottom, transparent, #4AA8FF)",
            animation: "pulse-slow 2.4s ease-in-out infinite",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
            fontSize: "0.42rem",
            letterSpacing: "0.22em",
            color: "#1A2430",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          Scroll
        </p>
      </motion.div>
    </motion.div>
  );
}
