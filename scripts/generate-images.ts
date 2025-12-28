import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';
import { removeBackground } from '@imgly/background-removal-node';
import { SCENE_PROMPTS, MONTHS, Month } from '../src/config/prompts';

const replicate = new Replicate();

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'themes');

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skipBgRemoval = args.includes('--skip-bg-removal');
const monthArg = args.find(a => a.startsWith('--month='))?.split('=')[1] as Month | undefined;

// Character reference image for consistent look
const CHARACTER_REFERENCE = process.env.CHARACTER_REF || '';

// Rate limiting delay (ms between requests)
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

    return output as string;
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

async function removeImageBackground(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    const resultBlob = await removeBackground(blob);
    const arrayBuffer = await resultBlob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`  Error removing background:`, error);
    return imageBuffer;
  }
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  console.log('🎨 Scene Generation Pipeline (Single Image per Month)');
  console.log('=====================================================\n');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No images will be generated\n');
  }

  if (skipBgRemoval) {
    console.log('⏭️  Skipping background removal\n');
  } else {
    console.log('🖥️  Using local background removal\n');
  }

  if (CHARACTER_REFERENCE) {
    console.log(`✅ Using character reference: ${CHARACTER_REFERENCE.substring(0, 50)}...\n`);
  } else {
    console.log('⚠️  No CHARACTER_REF set - character may vary between scenes\n');
  }

  const monthsToProcess = monthArg ? [monthArg] : MONTHS;

  let totalScenes = 0;
  let generatedScenes = 0;

  for (const month of monthsToProcess) {
    totalScenes++;
    console.log(`📅 ${month.charAt(0).toUpperCase() + month.slice(1)}`);

    const monthDir = path.join(OUTPUT_DIR, month);
    await ensureDir(monthDir);

    const prompt = SCENE_PROMPTS[month];
    const outputPath = path.join(monthDir, 'scene.png');

    console.log(`  🖼️  Generating complete scene...`);

    const imageUrl = await generateScene(prompt);

    if (imageUrl) {
      let imageBuffer = await downloadImage(imageUrl);

      if (!skipBgRemoval) {
        console.log(`  🔄 Removing background...`);
        imageBuffer = await removeImageBackground(imageBuffer);
      }

      await fs.writeFile(outputPath, imageBuffer);
      console.log(`  ✅ Saved to ${outputPath}`);
      generatedScenes++;
    }

    // Rate limiting
    if (!dryRun && monthsToProcess.indexOf(month) < monthsToProcess.length - 1) {
      console.log(`  ⏳ Waiting ${RATE_LIMIT_DELAY / 1000}s...\n`);
      await sleep(RATE_LIMIT_DELAY);
    } else {
      console.log('');
    }
  }

  console.log('=====================================================');
  console.log(`✨ Complete! ${dryRun ? 'Would generate' : 'Generated'} ${generatedScenes}/${totalScenes} scenes`);
}

main().catch(console.error);
