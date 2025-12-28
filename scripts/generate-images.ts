import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';
import { LIGHT_PROMPTS, DARK_PROMPTS, MONTHS, Month, Mode } from '../src/config/prompts';

const replicate = new Replicate();

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'themes');

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const monthArg = args.find(a => a.startsWith('--month='))?.split('=')[1] as Month | undefined;
const modeArg = args.find(a => a.startsWith('--mode='))?.split('=')[1] as Mode | undefined;

// Character reference image for consistent look
const CHARACTER_REFERENCE = process.env.CHARACTER_REF || 'https://github.com/WouterWisse/wouterwisse.com/blob/develop/public/images/character-reference.png?raw=true';

// Rate limiting delay (ms between requests) - Replicate has 6 req/min limit
const RATE_LIMIT_DELAY = 12000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateScene(prompt: string): Promise<string | null> {
  if (dryRun) {
    console.log(`  [DRY RUN] Would generate: "${prompt.substring(0, 100)}..."`);
    return null;
  }

  try {
    const input: Record<string, unknown> = {
      prompt,
      aspect_ratio: '1:1',
      output_format: 'png',
    };

    // Use character reference if provided for consistent character appearance
    if (CHARACTER_REFERENCE) {
      input.image = CHARACTER_REFERENCE;
    }

    const output = await replicate.run(
      'black-forest-labs/flux-kontext-pro',
      { input }
    );

    // Handle different output formats from Replicate
    if (typeof output === 'string') {
      return output;
    }
    if (Array.isArray(output) && typeof output[0] === 'string') {
      return output[0];
    }
    // Handle FileOutput object (has url() method or direct URL property)
    if (output && typeof output === 'object') {
      const obj = output as { url?: () => string | Promise<string> } | { toString?: () => string };
      if ('url' in obj && typeof obj.url === 'function') {
        return await obj.url();
      }
      // Try toString which often returns the URL
      const str = String(output);
      if (str.startsWith('http')) {
        return str;
      }
    }
    console.error('  Unexpected output format:', typeof output, output);
    return null;
  } catch (error) {
    console.error(`  Error generating scene:`, error);
    return null;
  }
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  console.log('🎨 Scene Generation Pipeline');
  console.log('============================\n');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No images will be generated\n');
  }

  if (CHARACTER_REFERENCE) {
    console.log(`✅ Using character reference: ${CHARACTER_REFERENCE.substring(0, 50)}...\n`);
  } else {
    console.log('⚠️  No CHARACTER_REF set - character may vary between scenes\n');
  }

  const monthsToProcess = monthArg ? [monthArg] : MONTHS;
  const modesToProcess: Mode[] = modeArg ? [modeArg] : ['light', 'dark'];

  const totalImages = monthsToProcess.length * modesToProcess.length;
  console.log(`📋 Generating ${totalImages} image(s) (${monthsToProcess.length} month(s) × ${modesToProcess.length} mode(s))...\n`);

  let processedImages = 0;
  let generatedImages = 0;

  for (const month of monthsToProcess) {
    for (const mode of modesToProcess) {
      processedImages++;
      const prompts = mode === 'light' ? LIGHT_PROMPTS : DARK_PROMPTS;
      const prompt = prompts[month];

      console.log(`📅 ${month} (${mode}) [${processedImages}/${totalImages}]`);

      const monthDir = path.join(OUTPUT_DIR, month);
      await ensureDir(monthDir);

      const outputPath = path.join(monthDir, `${mode}.png`);

      console.log(`  🖼️  Generating ${mode} scene...`);

      const imageUrl = await generateScene(prompt);

      if (imageUrl) {
        const imageBuffer = await downloadImage(imageUrl);
        await fs.writeFile(outputPath, imageBuffer);
        console.log(`  ✅ Saved to ${outputPath}`);
        generatedImages++;
      }

      // Rate limiting between requests (not after the last one)
      if (!dryRun && processedImages < totalImages) {
        console.log(`  ⏳ Waiting ${RATE_LIMIT_DELAY / 1000}s for rate limit...\n`);
        await sleep(RATE_LIMIT_DELAY);
      } else {
        console.log('');
      }
    }
  }

  console.log('============================');
  console.log(`✨ Complete! ${dryRun ? 'Would generate' : 'Generated'} ${generatedImages}/${totalImages} images`);

  if (!dryRun && generatedImages > 0) {
    console.log(`\n💡 Images saved to: ${OUTPUT_DIR}`);
  }
}

main().catch(console.error);
