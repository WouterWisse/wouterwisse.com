import bounds from './office-layer-bounds.json';
import nightBounds from './office-night-layer-bounds.json';

export const OFFICE_WIDTH = 1536;
export const OFFICE_HEIGHT = 1024;
// Measured from deep-house.mp3's bass onsets; offset is in seconds.
export const OFFICE_MUSIC_BEAT = { bpm: 110, offset: .065 };

// Positions are in the shared 1536×1024 scene. Only these bounds need changing
// to move or resize an individual object; source artwork remains untouched.
export const OFFICE_LAYERS = [
  { id: 'room', x: 0, y: 0, width: 1536, height: 1024 },
  { id: 'chair', x: 501, y: 270, width: 450, height: 642 },
  { id: 'character', x: 565, y: 178, width: 323, height: 760 },
  { id: 'desk', x: 222, y: 500, width: 1020, height: 470 },
  { id: 'keyboard', x: 578, y: 523, width: 320, height: 25 },
  { id: 'mac-studio', x: 294, y: 520.5, width: 128.76, height: 74.5 },
  { id: 'phone', x: 918, y: 522, width: 100, height: 30 },
  { id: 'mug', x: 1050, y: 460, width: 78, height: 66 },
  { id: 'monitor', x: 428, y: 274, width: 635, height: 326 },
  { id: 'lamp', x: 1175, y: 184, width: 146, height: 262 },
  { id: 'sonos', x: 1119.5, y: 469.3, width: 88.5, height: 133.7 },
] as const;

export function officeLayerStyle(layer: typeof OFFICE_LAYERS[number], night = false) {
  const source = (night ? nightBounds : bounds)[layer.id];
  const scaleX = layer.width / source.width;
  const scaleY = layer.height / source.height;
  return {
    left: `${(layer.x - source.left * scaleX) / OFFICE_WIDTH * 100}%`,
    top: `${(layer.y - source.top * scaleY) / OFFICE_HEIGHT * 100}%`,
    width: `${scaleX * 100}%`,
    height: `${scaleY * 100}%`,
  };
}
