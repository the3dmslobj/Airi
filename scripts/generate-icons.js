// Generates the app icon / adaptive icon / splash assets as monochrome
// dot-matrix glyphs (white dots on black/transparent) to match the app theme.
// Uses only Node built-ins (no image deps): hand-rolls a PNG encoder.

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const OUT_DIR = path.resolve(__dirname, "../assets/images");

// ---- minimal PNG encoder (RGBA, 8-bit) ----
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- dot-matrix sun glyph ----
// Returns whether grid cell (gx,gy) on an NxN grid is part of the sun.
const N = 17;
const CENTER = (N - 1) / 2;
function isOn(gx, gy) {
  const dx = gx - CENTER;
  const dy = gy - CENTER;
  const d = Math.hypot(dx, dy);
  if (d <= 4.2) return true; // body disc
  const onAxis = dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy);
  if (onAxis && d >= 5.5 && d <= 7.6) return true; // 8 rays
  return false;
}

// Build the list of dot centers (normalized 0..1 across the glyph box).
function dotCenters() {
  const dots = [];
  for (let gy = 0; gy < N; gy++) {
    for (let gx = 0; gx < N; gx++) {
      if (isOn(gx, gy)) dots.push([(gx + 0.5) / N, (gy + 0.5) / N]);
    }
  }
  return dots;
}

/**
 * Render the glyph into a `size`x`size` RGBA buffer.
 * @param bg [r,g,b,a] background (use a=0 for transparent)
 * @param scale fraction of the canvas the glyph box occupies
 */
function render(size, bg, scale) {
  const rgba = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    rgba[i * 4] = bg[0];
    rgba[i * 4 + 1] = bg[1];
    rgba[i * 4 + 2] = bg[2];
    rgba[i * 4 + 3] = bg[3];
  }

  const box = size * scale;
  const origin = (size - box) / 2;
  const cell = box / N;
  const r = cell * 0.4; // dot radius

  const dots = dotCenters();
  for (const [nx, ny] of dots) {
    const cx = origin + nx * box;
    const cy = origin + ny * box;
    const minX = Math.max(0, Math.floor(cx - r - 1));
    const maxX = Math.min(size - 1, Math.ceil(cx + r + 1));
    const minY = Math.max(0, Math.floor(cy - r - 1));
    const maxY = Math.min(size - 1, Math.ceil(cy + r + 1));
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dist = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        const cov = Math.max(0, Math.min(1, r + 0.5 - dist)); // 1px AA
        if (cov <= 0) continue;
        const idx = (y * size + x) * 4;
        // composite white dot over current pixel
        const a = cov;
        rgba[idx] = Math.round(255 * a + rgba[idx] * (1 - a));
        rgba[idx + 1] = Math.round(255 * a + rgba[idx + 1] * (1 - a));
        rgba[idx + 2] = Math.round(255 * a + rgba[idx + 2] * (1 - a));
        rgba[idx + 3] = Math.max(rgba[idx + 3], Math.round(255 * a));
      }
    }
  }
  return rgba;
}

function write(name, size, bg, scale) {
  const png = encodePNG(size, size, render(size, bg, scale));
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, png);
  console.log(`wrote ${name} (${size}x${size})`);
}

const BLACK = [0, 0, 0, 255];
const TRANSPARENT = [0, 0, 0, 0];

// iOS / web: full-bleed black icon with white sun.
write("icon.png", 1024, BLACK, 0.62);
// Android adaptive foreground: transparent, glyph kept inside the safe zone.
write("adaptive-icon.png", 1024, TRANSPARENT, 0.5);
// Android themed (monochrome) icon: white glyph on transparent.
write("monochrome-icon.png", 1024, TRANSPARENT, 0.5);
// Splash: transparent glyph, sized by the splash plugin over a black background.
write("splash-icon.png", 1024, TRANSPARENT, 0.62);
