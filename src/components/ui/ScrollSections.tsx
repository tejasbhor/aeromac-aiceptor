"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { SectionLabel } from "./SectionLabel";
import { TactileButton } from "./TactileButton";

// ─── Panel ─────────────────────────────────────────────────
// All panels use position:fixed so they float over the canvas.
// Text is always pushed LEFT or RIGHT — never center — so the
// centered drone is never obscured.
interface PanelProps {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  verticalAlign?: "top" | "center" | "bottom";
  paddingOverride?: string;
  persistAtEnd?: boolean;
}

function Panel({
  scrollYProgress,
  inStart,
  inEnd,
  outStart,
  outEnd,
  children,
  align = "left",
  verticalAlign = "center",
  paddingOverride,
  persistAtEnd = false,
}: PanelProps) {
  const opacity = useTransform(scrollYProgress, (value) => {
    if (persistAtEnd) {
      if (value < inStart) return 0;
      if (value >= inEnd) return 1;
      return (value - inStart) / (inEnd - inStart);
    } else {
      if (value <= inStart || value >= outEnd) return 0;
      if (value >= inEnd && value <= outStart) return 1;
      if (value > inStart && value < inEnd) {
        return (value - inStart) / (inEnd - inStart);
      }
      return 1 - (value - outStart) / (outEnd - outStart);
    }
  });

  const rawBlur = useTransform(scrollYProgress, (value) => {
    if (persistAtEnd) {
      if (value < inStart) return 10;
      if (value >= inEnd) return 0;
      return 10 - ((value - inStart) / (inEnd - inStart)) * 10;
    } else {
      if (value <= inStart || value >= outEnd) return 10;
      if (value >= inEnd && value <= outStart) return 0;
      if (value > inStart && value < inEnd) {
        return 10 - ((value - inStart) / (inEnd - inStart)) * 10;
      }
      return ((value - outStart) / (outEnd - outStart)) * 10;
    }
  });
  const filter = useTransform(rawBlur, (v) => `blur(${v}px)`);

  const translateX = useTransform(scrollYProgress, (value) => {
    const shift = align === "right" ? 20 : align === "center" ? 0 : -20;
    if (shift === 0) return 0;

    if (persistAtEnd) {
      if (value < inStart) return shift;
      if (value >= inEnd) return 0;
      return shift - ((value - inStart) / (inEnd - inStart)) * shift;
    } else {
      if (value <= inStart || value >= outEnd) return shift;
      if (value >= inEnd && value <= outStart) return 0;
      if (value > inStart && value < inEnd) {
        return shift - ((value - inStart) / (inEnd - inStart)) * shift;
      }
      return ((value - outStart) / (outEnd - outStart)) * shift;
    }
  });

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems:
          align === "right"
            ? "flex-end"
            : align === "center"
            ? "center"
            : "flex-start",
        justifyContent:
          verticalAlign === "top"
            ? "flex-start"
            : verticalAlign === "bottom"
            ? "flex-end"
            : "center",
        padding: paddingOverride ?? "9rem 3.5rem",
        pointerEvents: "none",
        opacity,
        filter,
        x: translateX,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Spec row ───────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "1.5rem",
        borderBottom: "1px solid rgba(26,36,48,0.6)",
        padding: "0.75rem 0",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
          fontSize: "0.48rem",
          letterSpacing: "0.2em",
          color: "#1A2430",
          textTransform: "uppercase",
          width: "96px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: "0.72rem",
          fontWeight: 300,
          color: "#A8B2BD",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionHeading({
  children,
  align = "left",
  maxWidth = "38vw",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  maxWidth?: string;
}) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
        fontSize: "clamp(1.8rem, 3.6vw, 4.8rem)",
        fontWeight: 600,
        letterSpacing: "-0.03em",
        lineHeight: 0.93,
        color: "#F8FAFC",
        maxWidth,
        marginBottom: "1.8rem",
        textAlign: align,
      }}
    >
      {children}
    </h2>
  );
}

function SectionBody({
  children,
  align = "left",
  maxWidth = "300px",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  maxWidth?: string;
}) {
  return (
    <p
      style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: "0.7rem",
        fontWeight: 300,
        lineHeight: 1.8,
        color: "#A8B2BD",
        maxWidth,
        textAlign: align,
      }}
    >
      {children}
    </p>
  );
}

// ─── Callout stat ───────────────────────────────────────────
function StatCallout({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
        <span
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 6rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "#F8FAFC",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
            fontSize: "0.7rem",
            color: "#4AA8FF",
            letterSpacing: "0.1em",
          }}
        >
          {unit}
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
          fontSize: "0.48rem",
          letterSpacing: "0.22em",
          color: "#1A2430",
          textTransform: "uppercase",
          marginTop: "0.2rem",
        }}
      >
        {label}
      </p>
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────
// Total page = 800vh.
// First 100vh is "free" hero (no scroll progress).
// Remaining 700vh maps to progress 0.125 → 1.0.
//
// Section scroll bands (in/out as fraction of full 800vh):
//   01 Engineering  : 0.10 → 0.26
//   02 Materials    : 0.25 → 0.40
//   03 Autonomy     : 0.39 → 0.54
//   04 Key stats    : 0.53 → 0.67
//   05 Manufacturing: 0.66 → 0.79
//   06 Specs        : 0.78 → 0.92
//   07 Final CTA    : 0.91 → 1.00
export function ScrollSections() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* 01 — Engineering (left) */}
      <Panel
        scrollYProgress={scrollYProgress}
        inStart={0.10} inEnd={0.15}
        outStart={0.22} outEnd={0.26}
        align="left" verticalAlign="center"
      >
        <SectionLabel label="Engineering" index="01" style={{ marginBottom: "1.8rem" }} />
        <SectionHeading>
          BUILT FOR
          <br />
          ZERO
          <br />
          COMPROMISE
        </SectionHeading>
        <SectionBody>
          Every dimension, every tolerance, every gram — engineered with
          aerospace precision and validated across thousands of simulated
          flight hours.
        </SectionBody>
      </Panel>

      {/* 02 — Materials (right) */}
      <Panel
        scrollYProgress={scrollYProgress}
        inStart={0.25} inEnd={0.30}
        outStart={0.37} outEnd={0.40}
        align="right" verticalAlign="center"
      >
        <SectionLabel label="Materials" index="02" style={{ marginBottom: "1.8rem" }} />
        <SectionHeading align="right">
          AEROSPACE-GRADE
          <br />
          COMPOSITE
          <br />
          STRUCTURE
        </SectionHeading>
        <SectionBody align="right">
          Carbon fibre reinforced polymer monocoque chassis, titanium
          structural inserts and full-weather surface coatings.
        </SectionBody>
      </Panel>

      {/* 03 — Autonomy (left, bottom) */}
      <Panel
        scrollYProgress={scrollYProgress}
        inStart={0.39} inEnd={0.44}
        outStart={0.50} outEnd={0.54}
        align="left" verticalAlign="bottom"
        paddingOverride="9rem 3.5rem 8rem"
      >
        <SectionLabel label="Autonomy" index="03" style={{ marginBottom: "1.8rem" }} />
        <SectionHeading>
          INTELLIGENCE
          <br />
          THAT LEARNS
        </SectionHeading>
        <SectionBody>
          Onboard edge AI with real-time terrain mapping, obstacle avoidance
          and adaptive mission planning — no operator required.
        </SectionBody>
      </Panel>

      {/* 04 — Key Stats (right, top) */}
      <Panel
        scrollYProgress={scrollYProgress}
        inStart={0.53} inEnd={0.57}
        outStart={0.63} outEnd={0.67}
        align="right" verticalAlign="top"
        paddingOverride="10rem 3.5rem 9rem"
      >
        <SectionLabel label="Performance" index="04" style={{ marginBottom: "2rem" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "flex-end" }}>
          <StatCallout value="58" unit="min" label="Endurance" />
          <StatCallout value="124" unit="km/h" label="Max Speed" />
          <StatCallout value="22" unit="km" label="BVLOS Range" />
        </div>
      </Panel>

      {/* 05 — Manufacturing (left) */}
      <Panel
        scrollYProgress={scrollYProgress}
        inStart={0.66} inEnd={0.71}
        outStart={0.75} outEnd={0.79}
        align="left" verticalAlign="center"
      >
        <SectionLabel label="Manufacturing" index="05" style={{ marginBottom: "1.8rem" }} />
        <SectionHeading>
          PRECISION AT
          <br />
          EVERY SCALE
        </SectionHeading>
        <SectionBody>
          CNC-machined aluminium and titanium components, sub-0.01 mm
          tolerances throughout, assembled in a Class 10,000 controlled
          environment.
        </SectionBody>
      </Panel>

      {/* 06 — Specifications (right) */}
      <Panel
        scrollYProgress={scrollYProgress}
        inStart={0.78} inEnd={0.82}
        outStart={0.89} outEnd={0.92}
        align="right" verticalAlign="center"
      >
        <SectionLabel label="Specifications" index="06" style={{ marginBottom: "2rem" }} />
        <div style={{ maxWidth: "380px" }}>
          <SpecRow label="Wingspan" value="1,240 mm" />
          <SpecRow label="MTOW" value="4.8 kg" />
          <SpecRow label="Max Speed" value="124 km/h" />
          <SpecRow label="Endurance" value="58 min" />
          <SpecRow label="Range" value="22 km BVLOS" />
          <SpecRow label="Ceiling" value="6,000 m ASL" />
          <SpecRow label="Payload" value="1.2 kg mission bay" />
          <SpecRow label="IP Rating" value="IP67 — full weather" />
        </div>
      </Panel>

      {/* 07 — Final CTA (Split Layout — Left Statement, Right summary specs, persists at the bottom) */}
      <Panel
        scrollYProgress={scrollYProgress}
        inStart={0.91}
        inEnd={0.96}
        outStart={1.0}
        outEnd={1.0}
        persistAtEnd={true}
        align="center"
        verticalAlign="bottom"
        paddingOverride="9rem 3.5rem 6.5rem"
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-end",
            pointerEvents: "auto",
            gap: "4rem",
            flexWrap: "wrap",
          }}
        >
          {/* Left Side: Statement + Request Access Button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: "1 1 350px" }}>
            <SectionLabel label="Request Access" style={{ marginBottom: "1.8rem" }} />
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                fontSize: "clamp(2rem, 4.5vw, 5.2rem)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: "#F8FAFC",
                marginBottom: "2.8rem",
              }}
            >
              THE FUTURE
              <br />
              IS AIRBORNE
            </h2>
            <TactileButton
              id="cta-final-request"
              href="mailto:contact@aeromacdynamics.com"
              variant="primary"
              showIcon={true}
            >
              Request Access
            </TactileButton>
          </div>

          {/* Right Side: Quick Spec Summary + Technical Brief Button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: "380px", width: "100%", flex: "1 1 300px" }}>
            <SectionLabel label="Technical Summary" style={{ marginBottom: "1.8rem", alignSelf: "flex-end" }} />
            <div style={{ width: "100%", marginBottom: "2.8rem" }}>
              <SpecRow label="Autonomy" value="Edge AI / BVLOS Enabled" />
              <SpecRow label="Payload" value="1.2 kg Modular Bay" />
              <SpecRow label="Range" value="22 km BVLOS" />
            </div>
            <TactileButton
              id="cta-final-spec"
              href="#specs"
              variant="secondary"
              showIcon={false}
            >
              Technical Brief
            </TactileButton>
          </div>
        </div>
      </Panel>
    </>
  );
}
