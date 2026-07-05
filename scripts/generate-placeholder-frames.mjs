/**
 * generate-placeholder-frames.mjs
 * Pure Node.js — no native dependencies.
 * 
 * Generates 120 minimal PNG files (1920×1080) as placeholders.
 * Uses raw PNG binary encoding — no canvas, no sharp, no jimp needed.
 * 
 * Run: node scripts/generate-placeholder-frames.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { createDeflate } from 'zlib';
import { promisify } from 'util';

const deflate = promisify((buf, opts, cb) => {
  const deflater = createDeflate(opts);
  const chunks = [];
  deflater.on('data', c => chunks.push(c));
  deflater.on('end', () => cb(null, Buffer.concat(chunks)));
  deflater.on('error', cb);
  deflater.write(buf);
  deflater.end();
});

const FRAME_COUNT = 120;
const W = 1920;
const H = 1080;
const OUT_DIR = join(process.cwd(), 'public', 'sequence');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.concat([typeBytes, data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, typeBytes, data, crc]);
}

async function makePNG(r, g, b) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Raw pixel data (one scanline = filter byte + W*3 bytes)
  const scanline = Buffer.alloc(1 + W * 3);
  scanline[0] = 0; // no filter
  for (let x = 0; x < W; x++) {
    // Slight gradient left→right
    const factor = x / W;
    scanline[1 + x * 3 + 0] = Math.round(r * (0.7 + factor * 0.3));
    scanline[1 + x * 3 + 1] = Math.round(g * (0.7 + factor * 0.3));
    scanline[1 + x * 3 + 2] = Math.round(b * (0.7 + factor * 0.3));
  }

  // Repeat for all rows with slight vertical gradient
  const rawData = Buffer.alloc(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    const vf = y / H;
    const yOff = y * (1 + W * 3);
    rawData[yOff] = 0;
    for (let x = 0; x < W; x++) {
      const hf = x / W;
      rawData[yOff + 1 + x * 3 + 0] = Math.round(r * (0.5 + hf * 0.2 + vf * 0.3));
      rawData[yOff + 1 + x * 3 + 1] = Math.round(g * (0.5 + hf * 0.2 + vf * 0.3));
      rawData[yOff + 1 + x * 3 + 2] = Math.round(b * (0.5 + hf * 0.2 + vf * 0.3));
    }
  }

  const compressed = await deflate(rawData, { level: 1 });

  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, chunk('IHDR', ihdr), idat, iend]);
}

console.log(`Generating ${FRAME_COUNT} placeholder frames…`);
console.log(`Output: ${OUT_DIR}\n`);

for (let i = 0; i < FRAME_COUNT; i++) {
  const t = i / (FRAME_COUNT - 1);

  // Dark teal-to-navy gradient as background colour, shifts per frame
  const r = Math.round(5 + t * 10);   // 5→15
  const g = Math.round(7 + t * 15);   // 7→22
  const b = Math.round(11 + t * 20);  // 11→31

  const png = await makePNG(r, g, b);
  const name = `frame_${String(i + 1).padStart(4, '0')}.webp`;
  writeFileSync(join(OUT_DIR, name), png);

  if (i % 10 === 0 || i === FRAME_COUNT - 1) {
    process.stdout.write(`\r  [${String(i + 1).padStart(3)}/${FRAME_COUNT}] ${name}`);
  }
}

console.log(`\n\n✓ Done. Drop your real render frames into:\n  ${OUT_DIR}\n`);
