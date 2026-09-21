// Генерация набора фавиконок из public/favicon.svg (запуск: npm run icons).
// На выходе в public/: favicon.ico (16/32/48), favicon-96x96.png, apple-touch-icon.png (180)
// и web-app-manifest-{192,512}x{192,512}.png (maskable — рисунок уменьшен до безопасной зоны).
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC = path.resolve(import.meta.dirname, '..', 'public');
const BG = '#1d2d3d'; // фон иконки (совпадает с theme_color манифеста)

const svg = await readFile(path.join(PUBLIC, 'favicon.svg'));

const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

/** Maskable-иконка: рисунок занимает ~66 % стороны, вокруг — фон (безопасная зона — круг 80 % диаметра). */
async function maskable(size) {
  const inner = Math.round(size * 0.66);
  const art = await png(inner);
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: art, gravity: 'centre' }])
    .png()
    .toBuffer();
}

/** ICO-контейнер с PNG-кадрами (поддерживается всеми современными браузерами и Яндексом). */
function ico(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(frames.length, 4);
  const dir = Buffer.alloc(16 * frames.length);
  let offset = header.length + dir.length;
  frames.forEach(({ size, data }, i) => {
    const e = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, e);
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1);
    dir.writeUInt8(0, e + 2); // palette
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // color planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(data.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...frames.map((f) => f.data)]);
}

const out = async (name, data) => {
  await writeFile(path.join(PUBLIC, name), data);
  console.log(`${name}  ${data.length} B`);
};

await out('favicon-96x96.png', await png(96));
await out('apple-touch-icon.png', await png(180));
await out('web-app-manifest-192x192.png', await maskable(192));
await out('web-app-manifest-512x512.png', await maskable(512));
await out(
  'favicon.ico',
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) })))),
);
