// Baixa as fotografias (Unsplash License) listadas em images.json e gera WebP em duas larguras.
// Uso: npm run images  (requer internet). Saída: public/images/<nome>-{sm,lg}.webp
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, '..', 'public', 'images');
const list = JSON.parse(await fs.readFile(path.join(root, 'images.json'), 'utf8'));
await fs.mkdir(out, { recursive: true });
const sizes = [{ suffix: 'sm', width: 800 }, { suffix: 'lg', width: 1800 }];

for (const [name, id] of Object.entries(list)) {
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=2400&q=85&fm=jpg`);
  if (!res.ok) { console.error('falhou', name, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  for (const { suffix, width } of sizes) {
    await sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality: 76 })
      .toFile(path.join(out, `${name}-${suffix}.webp`));
  }
  const meta = await sharp(buf).metadata();
  console.log('ok', name, `${meta.width}x${meta.height}`);
}
