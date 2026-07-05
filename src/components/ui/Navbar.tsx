"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Navbar() {
  const { scrollYProgress } = useScroll();

  // Navbar fades slightly on deep scroll
  const navBg = useTransform(
    scrollYProgress,
    [0, 0.05],
    ["rgba(5,7,11,0)", "rgba(5,7,11,0.7)"]
  );

  return (
    <header>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1.75rem 3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: navBg,
          backdropFilter: "blur(0px)",
        }}
      >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/Logo.png"
          alt="AEROMAC DYNAMICS"
          style={{
            height: "26px",
            width: "auto",
            display: "block",
            opacity: 0.95,
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>

      {/* Nav links */}
      <ul
        style={{
          display: "flex",
          gap: "3rem",
          listStyle: "none",
          alignItems: "center",
        }}
      >
        {["Technology", "Engineering", "Contact"].map((label) => (
          <li key={label}>
            <a
              href={`#${label.toLowerCase()}`}
              data-magnetic
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: "0.625rem",
                fontWeight: 300,
                letterSpacing: "0.14em",
                color: "#A8B2BD",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
                display: "inline-block",
                padding: "0.5rem 1rem",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = "#A8B2BD";
              }}
            >
              <span className="magnetic-inner" style={{ display: "inline-block" }}>
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
    </header>
  );
}
