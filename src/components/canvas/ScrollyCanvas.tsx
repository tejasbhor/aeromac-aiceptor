"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Config ────────────────────────────────────────────────
export const FRAME_COUNT = 517; // 517-frame render sequence

function getFramePath(index: number): string {
  const padded = String(index + 1).padStart(4, "0");
  return `/sequence/frame_${padded}.webp`;
}

// ─── Object-fit cover draw ─────────────────────────────────
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number
) {
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = canvasW / canvasH;

  let drawW: number, drawH: number, offsetX: number, offsetY: number;

  if (canvasAspect > imgAspect) {
    drawW = canvasW;
    drawH = canvasW / imgAspect;
    offsetX = 0;
    offsetY = (canvasH - drawH) / 2;
  } else {
    drawH = canvasH;
    drawW = canvasH * imgAspect;
    offsetX = (canvasW - drawW) / 2;
    offsetY = 0;
  }

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

// ─── Preloader ─────────────────────────────────────────────
async function preloadAll(
  count: number,
  getPath: (i: number) => string,
  onProgress: (p: number) => void
): Promise<HTMLImageElement[]> {
  const images: HTMLImageElement[] = new Array(count);
  let done = 0;
  const BATCH = 12;

  for (let i = 0; i < count; i += BATCH) {
    await Promise.all(
      Array.from({ length: Math.min(BATCH, count - i) }, (_, j) => {
        const idx = i + j;
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = getPath(idx);
          const finish = () => {
            images[idx] = img;
            done++;
            onProgress(done / count);
            resolve();
          };
          if (img.complete) { finish(); return; }
          img.onload = finish;
          img.onerror = finish; // keep going even on 404
        });
      })
    );
  }
  return images;
}

// ─── Hook Props ────────────────────────────────────────────
interface UseScrollyCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  spacerRef: React.RefObject<HTMLDivElement | null>;
  onLoadProgress: (p: number) => void;
  onLoaded: () => void;
}

export function useScrollyCanvas({
  canvasRef,
  spacerRef,
  onLoadProgress,
  onLoaded,
}: UseScrollyCanvasProps) {
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isLoadedRef = useRef(false);

  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const transXRef = useRef(0);
  const transYRef = useRef(0);

  // ── Draw current frame ──────────────────────────────────
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = framesRef.current[frameIndex];
    if (!img || !img.complete || !img.naturalWidth) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCover(ctx, img, canvas.width, canvas.height);
  }, [canvasRef]);

  // ── Resize handler ──────────────────────────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    drawFrame(currentFrameRef.current);
  }, [canvasRef, drawFrame]);

  // ── RAF render loop ─────────────────────────────────────
  const startRenderLoop = useCallback(() => {
    let lastFrame = -1;

    const loop = () => {
      const frame = currentFrameRef.current;
      if (frame !== lastFrame) {
        drawFrame(frame);
        lastFrame = frame;
      }

      // Smoothly interpolate mouse parallax coordinates
      transXRef.current += (mouseXRef.current - transXRef.current) * 0.08;
      transYRef.current += (mouseYRef.current - transYRef.current) * 0.08;

      const canvas = canvasRef.current;
      if (canvas) {
        // scale slightly larger (1.04) to prevent edges showing during shifts
        canvas.style.transform = `scale(1.04) translate3d(${transXRef.current}px, ${transYRef.current}px, 0)`;
        canvas.style.willChange = "transform";
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [canvasRef, drawFrame]);

  // ── Setup: preload → ScrollTrigger ──────────────────────
  useEffect(() => {
    let cancelled = false;

    const handleResizeFn = () => {
      handleResize();
    };

    const handleMouseMoveFn = (e: MouseEvent) => {
      const pctX = (e.clientX / window.innerWidth) - 0.5;
      const pctY = (e.clientY / window.innerHeight) - 0.5;
      mouseXRef.current = pctX * 24; // Max 12px shift
      mouseYRef.current = pctY * 24;
    };

    async function init() {
      const imgs = await preloadAll(FRAME_COUNT, getFramePath, (p) => {
        if (!cancelled) onLoadProgress(p);
      });

      if (cancelled) return;

      framesRef.current = imgs;
      isLoadedRef.current = true;
      onLoaded();

      window.addEventListener("mousemove", handleMouseMoveFn);
      handleResize();
      window.addEventListener("resize", handleResizeFn);

      // Start render loop
      startRenderLoop();

      // Draw first frame immediately
      drawFrame(0);

      // GSAP ScrollTrigger
      if (!spacerRef.current) return;

      ScrollTrigger.create({
        trigger: spacerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const frame = Math.min(
            Math.round(self.progress * (FRAME_COUNT - 1)),
            FRAME_COUNT - 1
          );
          currentFrameRef.current = frame;
        },
      });
    }

    init();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResizeFn);
      window.removeEventListener("mousemove", handleMouseMoveFn);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
