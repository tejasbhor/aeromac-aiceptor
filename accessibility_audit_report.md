# AEROMAC AI-CEPTOR — Accessibility (WCAG 2.2 AA) & UX Audit Report

This report documents the current accessibility standing, layout structures, and scroll-interaction systems of the **AEROMAC DYNAMICS — AI-CEPTOR** website, detailing the fixes applied to comply with WCAG 2.2 AA guidelines.

---

## 1. Summary of Issues Grouped by Severity

### Critical Severity (Must Fix)
- **Text Scramble Name Loss**: During hover or focus transitions, CTA button text scrambles visually. Screen readers reading the DOM directly would read gibberish characters (e.g. `01$X[]_//<>`), losing the core name/role context. 
  - *WCAG Impact*: Violates **SC 1.1.1 (Non-text Content)** and **SC 4.1.2 (Name, Role, Value)**.
- **Keyboard Navigation Trap & Landmarks**: The single-page app did not declare structural landmark elements like `<main>` or `<header>`, making navigation and bypass blocks impossible for keyboard/screen reader users.
  - *WCAG Impact*: Violates **SC 1.3.1 (Info and Relationships)** and **SC 2.4.1 (Bypass Blocks)**.

### Medium Severity (Important)
- **Hidden Keyboard Focus Indicator**: Browser default outlines on links/buttons were disabled or invisible against the dark `#05070B` background, leaving keyboard-only users without a visual focus locator.
  - *WCAG Impact*: Violates **SC 2.4.7 (Focus Visible)** and **SC 2.4.13 (Focus Appearance)**.
- **Scroll Limit Fading**: The final call-to-action layout would fade out or shift away at the absolute bottom limits of the scroll container, hiding active target inputs.
  - *UX Impact*: High cognitive friction for action completion.

---

## 2. Accessibility & Layout Fixes

### Fix 1: Aria Text Alternatives for Interactive Scramble Effects
- **File Location**: [TactileButton.tsx](file:///d:/Sample%20Website/aeromac-aiceptor/src/components/ui/TactileButton.tsx#L56-L127)
- **WCAG Success Criteria**: **SC 1.1.1 (Non-text Content)**, **SC 4.1.2 (Name, Role, Value)**.
- **Details**:
  - Attached `aria-label={children}` to the host link.
  - Wrapped the dynamic visual text chars span in `aria-hidden="true"`.
  - Added `onFocus` and `onBlur` listeners to trigger the scramble micro-interaction for keyboard users.

### Fix 2: Global Keyboard Focus Outline Override
- **File Location**: [globals.css](file:///d:/Sample%20Website/aeromac-aiceptor/src/app/globals.css#L112-L119)
- **WCAG Success Criteria**: **SC 2.4.7 (Focus Visible)**, **SC 2.4.13 (Focus Appearance)**.
- **Details**:
  - Implemented high-contrast keyboard-only outlines (`:focus-visible`) that glow in the primary brand blue (`#4AA8FF`) with a subtle offset boundary.

### Fix 3: Semantic landmarks and Bypass Blocks
- **File Location**: [page.tsx](file:///d:/Sample%20Website/aeromac-aiceptor/src/app/page.tsx#L47-L140) and [Navbar.tsx](file:///d:/Sample%20Website/aeromac-aiceptor/src/components/ui/Navbar.tsx)
- **WCAG Success Criteria**: **SC 1.3.1 (Info and Relationships)**, **SC 2.4.1 (Bypass Blocks)**.
- **Details**:
  - Added a "Skip to Main Content" link at the very top of the DOM order, styled to become visible only on keyboard tab focus.
  - Wrapped the main scroll panels inside a semantic `<main id="main-content">` landmark.
  - Wrapped the header navbar inside a semantic `<header>` landmark.

### Fix 4: Split Non-Obscuring Persistent CTA
- **File Location**: [ScrollSections.tsx](file:///d:/Sample%20Website/aeromac-aiceptor/src/components/ui/ScrollSections.tsx#L358-L435)
- **WCAG Success Criteria**: **SC 2.1.1 (Keyboard)**, **SC 2.4.3 (Focus Order)**.
- **Details**:
  - Re-arranged the centered final CTA to a wide split container layout.
  - Locked the panel visibility at the bottom (`persistAtEnd={true}`) using custom mapping ranges, preventing layout content from fading out or jumping when scrollmomentum extends beyond 1.0.

---

## 3. Core System Audits

### Layout / Design
- **Wide Spacing**: Avoided cramped grid rows. Left and right panels slide cleanly from boundaries with a subtle `blur` transition to minimize visual clutter.
- **High Contrast**: Title fonts (Space Grotesk) and body typography (Inter) use `#F8FAFC` and `#A8B2BD` which comfortably exceed the **4.5:1** contrast ratio against the `#05070B` background.

### Scroll / Interaction
- **Input Neutrality**: Scrubbing sequence maps to standard page height (800vh), allowing keyboard paging (PageDown/PageUp/ArrowDown/ArrowUp) and mouse dragging to scrub frames identically.
- **Lenis Smooth Scroll**: Easing is managed dynamically without scroll hijacking, respecting natural OS scrolling velocity settings.

### Code Quality
- Standard HTML elements (`main`, `nav`, `a`, `img`, `header`) are preferred over generic nested `div` wraps.
- Fully typed parameters in TypeScript. Zero build warnings.

---

## 4. Known Limitations & Future Work

- **Sequence Alt-Text**: The canvas is labeled `aria-hidden="true"`. If the frames contain key narrative information that isn't fully described in the accompanying side-panels, screen reader users might miss contextual detail.
  - *Recommendation*: Maintain comprehensive side-panel text for every stage of the scrub sequence.
- **Lenis Over-Scroll Bounce**: Heavy scroll acceleration can overshoot target points slightly due to momentum damping. Ensure all interpolation functions continue to handle bounds capping gracefully.
