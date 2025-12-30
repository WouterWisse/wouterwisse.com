import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
] as const;

const MODES = ['light', 'dark'] as const;

async function generateBlurDataURL(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .resize(10, 10, { fit: 'cover' })
    .blur()
    .toBuffer();

  return `data:image/png;base64,${buffer.toString('base64')}`;
}

async function main() {
  const blurData: Record<string, Record<string, string>> = {};

  for (const month of MONTHS) {
    blurData[month] = {};

    for (const mode of MODES) {
      const imagePath = path.join(process.cwd(), 'public', 'images', 'themes', month, `${mode}.png`);

      if (fs.existsSync(imagePath)) {
        console.log(`Processing ${month}/${mode}...`);
        blurData[month][mode] = await generateBlurDataURL(imagePath);
      } else {
        console.warn(`Warning: Image not found: ${imagePath}`);
        blurData[month][mode] = '';
      }
    }
  }

  // Generate TypeScript file
  const output = `// Auto-generated blur placeholders - do not edit manually
// Run: npm run generate-blur-placeholders

import type { Month, Mode } from '@/types/theme';

export const BLUR_DATA_URLS: Record<Month, Record<Mode, string>> = ${JSON.stringify(blurData, null, 2)};

export function getBlurDataURL(month: Month, mode: Mode): string {
  return BLUR_DATA_URLS[month][mode];
}
`;

  const outputPath = path.join(process.cwd(), 'src', 'config', 'blur-placeholders.ts');
  fs.writeFileSync(outputPath, output);

  console.log(`\nGenerated blur placeholders at: ${outputPath}`);
}

main().catch(console.error);
