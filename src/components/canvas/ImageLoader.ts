/**
 * Preloads all frames from the image sequence into memory.
 * Returns a promise that resolves to an ordered array of HTMLImageElement.
 * Calls onProgress(0–1) during loading.
 */
export async function loadImageSequence(
  frameCount: number,
  framePath: (index: number) => string,
  onProgress?: (progress: number) => void
): Promise<HTMLImageElement[]> {
  const images: HTMLImageElement[] = new Array(frameCount);
  let loaded = 0;

  const loadOne = (index: number): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      const src = framePath(index);
      img.src = src;

      if (img.complete) {
        images[index] = img;
        loaded++;
        onProgress?.(loaded / frameCount);
        resolve();
        return;
      }

      img.onload = () => {
        images[index] = img;
        loaded++;
        onProgress?.(loaded / frameCount);
        resolve();
      };

      img.onerror = () => {
        // On error create a transparent placeholder so array stays dense
        const placeholder = new Image();
        placeholder.src =
          "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        images[index] = placeholder;
        loaded++;
        onProgress?.(loaded / frameCount);
        resolve();
      };
    });
  };

  // Load in parallel batches of 10 for memory efficiency
  const BATCH = 10;
  for (let i = 0; i < frameCount; i += BATCH) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH, frameCount); j++) {
      batch.push(loadOne(j));
    }
    await Promise.all(batch);
  }

  return images;
}

/**
 * Maps a 0–1 scroll progress value to a frame index.
 */
export function scrollProgressToFrame(
  progress: number,
  frameCount: number
): number {
  const clamped = Math.max(0, Math.min(1, progress));
  return Math.min(Math.round(clamped * (frameCount - 1)), frameCount - 1);
}
