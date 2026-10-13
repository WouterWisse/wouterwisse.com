import sharp from 'sharp';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const night = process.argv.includes('--night');
const root = path.resolve('public/images/office/scene', night ? 'night' : '.');
const names = ['room', 'chair', 'character', 'desk', 'keyboard', 'monitor', 'mac-studio', 'phone', 'mug', 'wine', 'lamp', 'sonos'];

async function main() {
  await mkdir(root, { recursive: true });
  const bounds: Record<string, { left: number; top: number; width: number; height: number }> = {};
  let total = 0;
  for (const name of names) {
    const input = path.join(root, 'sources', name + '.png');
    const metadata = await sharp(input).metadata();
    assert.equal(metadata.width, 1536, name);
    assert.equal(metadata.height, 1024, name);
    if (name === 'room') {
      bounds[name] = { left: 0, top: 0, width: 1536, height: 1024 };
    } else {
      assert(metadata.hasAlpha, `${name} requires genuine transparency`);
      const pixels = await sharp(input).ensureAlpha().raw().toBuffer();
      let left = 1536, top = 1024, right = 0, bottom = 0, transparent = 0;
      for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1536; x++) {
          const alpha = pixels[(y * 1536 + x) * 4 + 3];
          if (alpha === 0) transparent++;
          if (alpha > 230) {
            left = Math.min(left, x); right = Math.max(right, x);
            top = Math.min(top, y); bottom = Math.max(bottom, y);
          }
        }
      }
      assert(transparent > 1536 * 1024 * .2, `${name} must be an isolated object`);
      assert(right > left && bottom > top, `${name} is empty`);
      bounds[name] = { left, top, width: right - left + 1, height: bottom - top + 1 };
    }
    const output = path.join(root, name + '.webp');
    await sharp(input).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(output);
    total += (await stat(output)).size;
  }
  await writeFile(`src/config/office${night ? '-night' : ''}-layer-bounds.json`, JSON.stringify(bounds, null, 2) + '\n');
  console.log(`Validated ${names.length} independent layers (${(total / 1024 / 1024).toFixed(2)} MB); source PNGs retained.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
