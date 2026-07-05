"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollProgressOptions {
  totalHeight: string; // e.g. "600vh"
  onProgress: (progress: number) => void;
  enabled: boolean;
}

/**
 * Creates a GSAP ScrollTrigger that drives a scroll progress value (0–1)
 * over a tall spacer element. The progress is passed to `onProgress` on every tick.
 */
export function useScrollProgress({
  totalHeight,
  onProgress,
  enabled,
}: UseScrollProgressOptions) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const handleProgress = useCallback(
    (self: ScrollTrigger) => {
      progressRef.current = self.progress;
      onProgress(self.progress);
    },
    [onProgress]
  );

  useEffect(() => {
    if (!enabled || !spacerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: spacerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: handleProgress,
    });

    return () => {
      trigger.kill();
    };
  }, [enabled, handleProgress]);

  return { spacerRef, progressRef };
}
