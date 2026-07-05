"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { loadImageSequence, scrollProgressToFrame } from "@/components/canvas/ImageLoader";

export interface ImageSequenceState {
  frames: HTMLImageElement[];
  isLoaded: boolean;
  loadProgress: number;
  currentFrame: number;
  setScrollProgress: (progress: number) => void;
}

interface UseImageSequenceOptions {
  frameCount: number;
  framePath: (index: number) => string;
}

export function useImageSequence({
  frameCount,
  framePath,
}: UseImageSequenceOptions): ImageSequenceState {
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function preload() {
      const imgs = await loadImageSequence(frameCount, framePath, (p: number) => {
        if (!cancelled) setLoadProgress(p);
      });
      if (!cancelled) {
        framesRef.current = imgs;
        setIsLoaded(true);
      }
    }

    preload();
    return () => {
      cancelled = true;
    };
  }, [frameCount, framePath]);

  const setScrollProgress = useCallback(
    (progress: number) => {
      const frame = scrollProgressToFrame(progress, frameCount);
      setCurrentFrame(frame);
    },
    [frameCount]
  );

  return {
    frames: framesRef.current,
    isLoaded,
    loadProgress,
    currentFrame,
    setScrollProgress,
  };
}
