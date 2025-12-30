// Auto-generate theme colors from dominant colors in images
// Run: npm run generate-theme-colors

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
] as const;

const MODES = ['light', 'dark'] as const;

// Background colors to exclude from dominant color extraction
const LIGHT_BG = { r: 250, g: 250, b: 250 }; // #fafafa
const DARK_BG = { r: 26, g: 16, b: 37 };     // #1a1025

interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Calculate color saturation (0-1)
function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

// Calculate perceived brightness (0-255)
function getBrightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

// Check if color is too close to background
function isTooCloseToBackground(color: RGB, mode: 'light' | 'dark'): boolean {
  const bg = mode === 'light' ? LIGHT_BG : DARK_BG;
  const distance = Math.sqrt(
    Math.pow(color.r - bg.r, 2) +
    Math.pow(color.g - bg.g, 2) +
    Math.pow(color.b - bg.b, 2)
  );
  return distance < 100; // Threshold for "too similar"
}

// Check if color is too neutral (grey/white/black)
function isTooNeutral(r: number, g: number, b: number): boolean {
  const saturation = getSaturation(r, g, b);
  return saturation < 0.2;
}

// Ensure minimum contrast with background
function ensureContrast(color: RGB, mode: 'light' | 'dark'): RGB {
  const brightness = getBrightness(color.r, color.g, color.b);

  if (mode === 'light') {
    // For light mode, we need darker colors (brightness < 180)
    if (brightness > 180) {
      const factor = 150 / brightness;
      return {
        r: Math.round(color.r * factor),
        g: Math.round(color.g * factor),
        b: Math.round(color.b * factor)
      };
    }
  } else {
    // For dark mode, we need lighter colors (brightness > 120)
    if (brightness < 120) {
      const factor = 150 / brightness;
      return {
        r: Math.min(255, Math.round(color.r * factor)),
        g: Math.min(255, Math.round(color.g * factor)),
        b: Math.min(255, Math.round(color.b * factor))
      };
    }
  }

  return color;
}

// Extract dominant vibrant color from image using sampling
async function extractDominantColor(imagePath: string, mode: 'light' | 'dark'): Promise<string> {
  // Resize to manageable size and get raw pixel data
  const { data, info } = await sharp(imagePath)
    .resize(100, 100, { fit: 'cover' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Count color occurrences, focusing on center region for character colors
  const colorCounts: Map<string, { count: number; r: number; g: number; b: number; saturation: number }> = new Map();

  const centerStartX = Math.floor(info.width * 0.2);
  const centerEndX = Math.floor(info.width * 0.8);
  const centerStartY = Math.floor(info.height * 0.2);
  const centerEndY = Math.floor(info.height * 0.8);

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Skip near-white and near-black pixels
      const brightness = getBrightness(r, g, b);
      if (brightness > 240 || brightness < 15) continue;

      // Skip too neutral colors
      if (isTooNeutral(r, g, b)) continue;

      // Skip colors too close to background
      if (isTooCloseToBackground({ r, g, b }, mode)) continue;

      // Quantize to reduce unique colors (group similar colors)
      const qr = Math.round(r / 16) * 16;
      const qg = Math.round(g / 16) * 16;
      const qb = Math.round(b / 16) * 16;
      const key = `${qr},${qg},${qb}`;

      const saturation = getSaturation(r, g, b);

      // Weight center pixels more heavily
      const isCenter = x >= centerStartX && x <= centerEndX && y >= centerStartY && y <= centerEndY;
      const weight = isCenter ? 3 : 1;

      const existing = colorCounts.get(key);
      if (existing) {
        existing.count += weight;
        // Keep track of actual average color for this bucket
        existing.r = (existing.r * (existing.count - weight) + r * weight) / existing.count;
        existing.g = (existing.g * (existing.count - weight) + g * weight) / existing.count;
        existing.b = (existing.b * (existing.count - weight) + b * weight) / existing.count;
        existing.saturation = Math.max(existing.saturation, saturation);
      } else {
        colorCounts.set(key, { count: weight, r, g, b, saturation });
      }
    }
  }

  // Find the most vibrant color with good presence
  let bestColor: RGB = { r: 128, g: 128, b: 128 };
  let bestScore = 0;

  for (const [, colorInfo] of colorCounts) {
    // Score = saturation * count (prefer vibrant colors that appear often)
    const score = colorInfo.saturation * Math.sqrt(colorInfo.count);

    if (score > bestScore) {
      bestScore = score;
      bestColor = { r: colorInfo.r, g: colorInfo.g, b: colorInfo.b };
    }
  }

  // Ensure good contrast with background
  bestColor = ensureContrast(bestColor, mode);

  return rgbToHex(bestColor.r, bestColor.g, bestColor.b);
}

async function main() {
  console.log('Extracting dominant colors from theme images...\n');

  const colors: Record<string, { light: string; dark: string }> = {};

  for (const month of MONTHS) {
    colors[month] = { light: '', dark: '' };

    for (const mode of MODES) {
      const imagePath = path.join(process.cwd(), 'public', 'images', 'themes', month, `${mode}.png`);

      if (fs.existsSync(imagePath)) {
        const color = await extractDominantColor(imagePath, mode);
        colors[month][mode] = color;
        console.log(`${month.padEnd(10)} ${mode.padEnd(5)} → ${color}`);
      } else {
        console.warn(`Warning: Image not found: ${imagePath}`);
        // Fallback colors
        colors[month][mode] = mode === 'light' ? '#666666' : '#aaaaaa';
      }
    }
  }

  // Generate TypeScript output that can be used in themes.ts
  const output = `// Auto-generated theme colors from image analysis
// Run: npm run generate-theme-colors
// Generated: ${new Date().toISOString()}

import type { Month, ModeColors } from '@/types/theme';

export const EXTRACTED_COLORS: Record<Month, ModeColors> = {
${MONTHS.map(month => `  ${month}: {
    light: { top: '${colors[month].light}', bottom: '${colors[month].light}' },
    dark: { top: '${colors[month].dark}', bottom: '${colors[month].dark}' },
  },`).join('\n')}
};
`;

  const outputPath = path.join(process.cwd(), 'src', 'config', 'extracted-colors.ts');
  fs.writeFileSync(outputPath, output);

  console.log(`\n✓ Generated extracted colors at: ${outputPath}`);
  console.log('\nTo use these colors, update themes.ts to import from extracted-colors.ts');
}

main().catch(console.error);
