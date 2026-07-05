"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  progress: number; // 0–1
  isVisible: boolean;
}

export function LoadingScreen({ progress, isVisible }: LoadingScreenProps) {
  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading"
          initial={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
          exit={{
            clipPath: "circle(0% at 50% 50%)",
            transition: { duration: 1.6, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#05070B",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            style={{ marginBottom: "3rem", textAlign: "center" }}
          >
            <img
              src="/Logo.png"
              alt="AEROMAC DYNAMICS"
              style={{
                height: "48px",
                width: "auto",
                display: "block",
                margin: "0 auto 1.5rem",
                opacity: 0.95,
                filter: "brightness(0) invert(1)",
              }}
            />
          </motion.div>

          {/* Progress bar track */}
          <div
            style={{
              width: "180px",
              height: "1px",
              background: "#1A2430",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Sweep shimmer */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "60px",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(74,168,255,0.3), transparent)",
              }}
            />
            {/* Fill */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                background: "#4AA8FF",
                width: `${pct}%`,
                transition: "width 0.15s ease",
              }}
            />
          </div>

          {/* Percentage */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              color: "#1A2430",
              marginTop: "1.2rem",
              textTransform: "uppercase",
            }}
          >
            {pct < 100 ? `LOADING ${pct}%` : "INITIALISING"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
