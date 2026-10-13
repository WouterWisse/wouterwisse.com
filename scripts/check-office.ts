import assert from 'node:assert/strict';
import sharp from 'sharp';
import { OFFICE_LAYERS, officeLayerStyle, OFFICE_WIDTH, OFFICE_HEIGHT } from '../src/config/office';
import bounds from '../src/config/office-layer-bounds.json';
import nightBounds from '../src/config/office-night-layer-bounds.json';

async function main() {
  const names = OFFICE_LAYERS.map(layer => layer.id);
  assert(names.indexOf('character') > names.indexOf('chair'));
  assert(names.indexOf('character') < names.indexOf('desk'), 'The whole body belongs behind the desk');
  assert(names.indexOf('keyboard') > names.indexOf('desk'));
  assert(names.indexOf('keyboard') < names.indexOf('monitor'));
  for (const id of ['phone', 'mug'] as const) {
    assert(names.indexOf(id) > names.indexOf('desk'));
    assert(names.indexOf(id) < names.indexOf('monitor'), `${id} must be occluded by the foreground monitor`);
  }
  const phone = OFFICE_LAYERS.find(layer => layer.id === 'phone')!;
  const mug = OFFICE_LAYERS.find(layer => layer.id === 'mug')!;
  const sonos = OFFICE_LAYERS.find(layer => layer.id === 'sonos')!;
  const desk = OFFICE_LAYERS.find(layer => layer.id === 'desk')!;
  assert(phone.x + phone.width + 20 <= mug.x, 'Keep a clear gap between the phone and coffee mug');
  assert(mug.x + mug.width / 2 < sonos.x && sonos.y > mug.y, 'Speaker belongs in front and camera-right of the mug');
  assert(sonos.x + sonos.width < desk.x + desk.width && sonos.y + sonos.height > desk.y, 'Speaker must sit on the desk');
  assert(names.indexOf('sonos') > names.indexOf('desk'), 'Speaker must be above the desktop');
  for (const night of [false, true]) for (const layer of OFFICE_LAYERS) {
    const directory = `public/images/office/scene/${night ? 'night/' : ''}`;
    const style = officeLayerStyle(layer, night);
    const source = (night ? nightBounds : bounds)[layer.id];
    // The visible object's bounds must land in the shared scene, irrespective of
    // how much transparent padding the image generator placed around that object.
    const x = parseFloat(style.left) / 100 * OFFICE_WIDTH + source.left * parseFloat(style.width) / 100;
    const y = parseFloat(style.top) / 100 * OFFICE_HEIGHT + source.top * parseFloat(style.height) / 100;
    assert(Math.abs(x - layer.x) < .001 && Math.abs(y - layer.y) < .001, layer.id);
    const metadata = await sharp(`${directory}${layer.id}.webp`).metadata();
    assert.equal(metadata.width, OFFICE_WIDTH);
    assert.equal(metadata.height, OFFICE_HEIGHT);
    if (layer.id !== 'room') assert(metadata.hasAlpha, `${layer.id} lost transparency`);
    if (['chair', 'mac-studio', 'phone', 'mug', 'sonos'].includes(layer.id)) {
      const pixels = await sharp(`${directory}${layer.id}.webp`).ensureAlpha().raw().toBuffer();
      let shadowPixels = 0;
      for (let y = source.top + source.height; y < OFFICE_HEIGHT; y++) {
        for (let x = 0; x < OFFICE_WIDTH; x++) {
          const i = (y * OFFICE_WIDTH + x) * 4;
          if (pixels[i + 3] > 12 && pixels[i + 3] < 220 && Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) < 120) shadowPixels++;
        }
      }
      assert(shadowPixels > 100, `${layer.id} needs a baked translucent contact shadow below its base`);
    }
  }
  // A single connected silhouette catches accidental separate upper/lower bodies.
  const { data, info } = await sharp('public/images/office/scene/sources/character.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const count = info.width * info.height;
  const visited = new Uint8Array(count);
  const queue = new Int32Array(count);
  let largest = 0, total = 0;
  for (let pixel = 0; pixel < count; pixel++) {
    if (data[pixel * 4 + 3] <= 230) continue;
    total++;
    if (visited[pixel]) continue;
    let head = 0, tail = 1;
    queue[0] = pixel;
    visited[pixel] = 1;
    while (head < tail) {
      const current = queue[head++];
      for (const next of [current - info.width, current + info.width, current % info.width ? current - 1 : -1, current % info.width < info.width - 1 ? current + 1 : -1]) {
        if (next < 0 || next >= count || visited[next] || data[next * 4 + 3] <= 230) continue;
        visited[next] = 1;
        queue[tail++] = next;
      }
    }
    largest = Math.max(largest, tail);
  }
  assert(largest / total > .99, 'Character should be one connected full body');
  for (const mode of ['day', 'night']) {
    for (const variant of ['phone-lit', 'mug-empty', 'angry', 'sip']) {
      const file = `public/images/office/scene/interactions/${mode}-${variant}.webp`;
      const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      assert(info.width === OFFICE_WIDTH && info.height === OFFICE_HEIGHT, `${file} must register with the original layer`);
      let opaque = 0, transparent = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 230) opaque++;
        if (data[i] === 0) transparent++;
      }
      assert(opaque > 20000 && transparent > OFFICE_WIDTH * OFFICE_HEIGHT * .2, `${file} must contain a visible object and genuine transparent surroundings`);
    }
    for (const face of ['blink-half', 'blink-closed', 'smile', 'focus', 'side-eye']) {
      const file = `public/images/office/scene/expressions/${mode}-${face}.webp`;
      const metadata = await sharp(file).metadata();
      assert(metadata.hasAlpha && metadata.width === OFFICE_WIDTH && metadata.height === OFFICE_HEIGHT, `${file} must match the character canvas and preserve transparency`);
      const pixels = await sharp(file).ensureAlpha().raw().toBuffer();
      let head = 0, clear = 0;
      for (let y = 0; y < 280; y++) for (let x = 0; x < OFFICE_WIDTH; x++) {
        const alpha = pixels[(y * OFFICE_WIDTH + x) * 4 + 3];
        if (alpha > 230) head++;
        if (alpha === 0) clear++;
      }
      assert(head > 20000 && clear > 300000, `${file} needs an opaque head and transparent surroundings`);
    }
  }
  console.log('Day and night office checks passed: layer order, alignment, alpha, baked contact shadows, connected full body, and eight interaction assets.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
