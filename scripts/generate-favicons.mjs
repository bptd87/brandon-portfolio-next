import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve("client/public");

const size = 512;
const center = 256;
const clusterRadius = 196;
const spacing = 15;
const dots = [];

for (let y = center - clusterRadius; y <= center + clusterRadius; y += spacing) {
  for (let x = center - clusterRadius; x <= center + clusterRadius; x += spacing) {
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > clusterRadius) continue;

    const normalized = 1 - distance / clusterRadius;
    const radius = 0.8 + normalized * 6.8;
    const opacity = 0.2 + normalized * 0.8;
    dots.push(
      `<circle cx="${x}" cy="${y}" r="${radius.toFixed(2)}" fill="#f7f4ef" opacity="${opacity.toFixed(3)}" />`
    );
  }
}

const iconSvg = String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Brandon PT Davis favicon">
  <defs>
    <radialGradient id="bg" cx="50%" cy="45%" r="78%">
      <stop offset="0%" stop-color="#2a2426"/>
      <stop offset="62%" stop-color="#221d1f"/>
      <stop offset="100%" stop-color="#171315"/>
    </radialGradient>
    <filter id="soften" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.6" />
    </filter>
  </defs>
  <rect width="${size}" height="${size}" rx="112" fill="url(#bg)" />
  <g filter="url(#soften)">
    ${dots.join("\n    ")}
  </g>
</svg>`;

const outputs = [
  { file: "favicon.svg", write: "text", size: null },
  { file: "favicon-16x16.png", write: "png", size: 16 },
  { file: "favicon-32x32.png", write: "png", size: 32 },
  { file: "apple-touch-icon.png", write: "png", size: 180 },
  { file: "android-chrome-192x192.png", write: "png", size: 192 },
  { file: "android-chrome-512x512.png", write: "png", size: 512 },
  { file: "pwa-192x192.png", write: "png", size: 192 },
  { file: "pwa-512x512.png", write: "png", size: 512 },
];

function buildIco(pngBuffer) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, pngBuffer]);
}

await fs.writeFile(path.join(publicDir, "favicon.svg"), iconSvg, "utf8");

for (const output of outputs) {
  if (output.write !== "png") continue;
  const buffer = await sharp(Buffer.from(iconSvg))
    .resize(output.size, output.size)
    .png()
    .toBuffer();
  await fs.writeFile(path.join(publicDir, output.file), buffer);
}

const icoPng = await sharp(Buffer.from(iconSvg)).resize(32, 32).png().toBuffer();
await fs.writeFile(path.join(publicDir, "favicon.ico"), buildIco(icoPng));

console.log("Generated favicon set in client/public");
