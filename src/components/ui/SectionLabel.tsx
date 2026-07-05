"use client";

import { motion } from "framer-motion";

interface SectionLabelProps {
  label: string;
  index?: string;
  style?: React.CSSProperties;
}

export function SectionLabel({ label, index, style }: SectionLabelProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        ...style,
      }}
    >
      {index && (
        <span
          style={{
            fontFamily:
              "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
            fontSize: "0.5rem",
            color: "#4AA8FF",
            letterSpacing: "0.1em",
          }}
        >
          {index}
        </span>
      )}
      <div
        style={{
          width: "24px",
          height: "1px",
          background: "#1A2430",
        }}
      />
      <span
        style={{
          fontFamily:
            "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.28em",
          color: "#A8B2BD",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}
