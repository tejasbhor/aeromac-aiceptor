"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TactileButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: string;
  variant?: "primary" | "secondary";
  showIcon?: boolean;
}

export function TactileButton({
  children,
  variant = "primary",
  showIcon = false,
  ...props
}: TactileButtonProps) {
  const [chars, setChars] = useState<string[]>(children.split(""));
  const [isHovered, setIsHovered] = useState(false);

  const originalText = children;
  const techChars = "01$X[]_//<>*#+=-";

  useEffect(() => {
    if (!isHovered) {
      setChars(originalText.split(""));
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setChars((prev) =>
        prev.map((char, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          // Scramble with technical characters
          if (originalText[index] === " ") return " ";
          return techChars[Math.floor(Math.random() * techChars.length)];
        })
      );

      iterations += 1 / 3;
      if (iterations >= originalText.length) {
        clearInterval(interval);
        setChars(originalText.split(""));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, originalText]);

  const isPrimary = variant === "primary";

  return (
    <a
      data-magnetic
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={originalText}
      style={{
        position: "relative",
        fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
        fontSize: "0.55rem",
        letterSpacing: "0.22em",
        color: isPrimary ? "#05070B" : "#A8B2BD",
        textDecoration: "none",
        textTransform: "uppercase",
        background: isPrimary ? "#F8FAFC" : "transparent",
        border: isPrimary ? "1px solid #F8FAFC" : "1px solid rgba(168, 178, 189, 0.2)",
        padding: "0.85rem 2.2rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        transition: "all 0.3s ease",
        outline: "none",
        boxShadow: isHovered ? "0 0 15px rgba(168, 178, 189, 0.15)" : "none",
      }}
      {...props}
    >
      {/* Grid Corner Tick Marks (Tactile Engineering Feel) */}
      <span style={{ position: "absolute", top: "-1px", left: "-1px", width: "4px", height: "4px", borderTop: "1px solid #4AA8FF", borderLeft: "1px solid #4AA8FF", pointerEvents: "none" }} />
      <span style={{ position: "absolute", top: "-1px", right: "-1px", width: "4px", height: "4px", borderTop: "1px solid #4AA8FF", borderRight: "1px solid #4AA8FF", pointerEvents: "none" }} />
      <span style={{ position: "absolute", bottom: "-1px", left: "-1px", width: "4px", height: "4px", borderBottom: "1px solid #4AA8FF", borderLeft: "1px solid #4AA8FF", pointerEvents: "none" }} />
      <span style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "4px", height: "4px", borderBottom: "1px solid #4AA8FF", borderRight: "1px solid #4AA8FF", pointerEvents: "none" }} />

      {/* Glow sweep layer */}
      {isHovered && !isPrimary && (
        <motion.div
          layoutId="buttonGlow"
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid #A8B2BD",
            boxShadow: "0 0 10px rgba(168, 178, 189, 0.25)",
            pointerEvents: "none",
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content wrapper with class target for Magnetic snap */}
      <span className="magnetic-inner" aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
        <span>{chars.join("")}</span>
        {showIcon && (
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            style={{
              transform: isHovered ? "translateX(3px)" : "translateX(0)",
              transition: "transform 0.3s ease",
            }}
          >
            <path
              d="M1 4.5H8M5.5 2l2.5 2.5L5.5 7"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </a>
  );
}
