import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';
import { MONTHS, Month } from '../src/config/prompts';

const replicate = new Replicate();

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'themes');

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const monthArg = args.find(a => a.startsWith('--month='))?.split('=')[1] as Month | undefined;

// Rate limiting - 10 seconds per request to stay under 6/min limit
const RATE_LIMIT_DELAY = 10000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function removeBackground(imagePath: string): Promise<Buffer | null> {
  if (dryRun) {
    console.log(`  [DRY RUN] Would remove background from: ${imagePath}`);
    return null;
  }

  try {
    // Read the local image and convert to base64 data URI
    const imageBuffer = await fs.readFile(imagePath);
    const base64 = imageBuffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;

    const output = await replicate.run(
      'lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1',
      {
        input: {
          image: dataUri,
        }
      }
    );

    // Handle different output formats from Replicate
    let imageUrl: string | null = null;
    if (typeof output === 'string') {
      imageUrl = output;
    } else if (Array.isArray(output) && typeof output[0] === 'string') {
      imageUrl = output[0];
    }

    if (!imageUrl) {
      console.error('  Unexpected output format:', typeof output);
      return null;
    }

    // Download the result
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error(`  Error removing background:`, error);
    return null;
  }
}

async function main() {
  console.log('🔲 Background Removal Pipeline');
  console.log('==============================\n');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No images will be modified\n');
  }

  const monthsToProcess = monthArg ? [monthArg] : MONTHS;

  console.log(`📋 Processing ${monthsToProcess.length} image(s)...\n`);

  let processed = 0;
  let successful = 0;

  for (const month of monthsToProcess) {
    processed++;
    console.log(`📅 ${month.charAt(0).toUpperCase() + month.slice(1)} (${processed}/${monthsToProcess.length})`);

    const imagePath = path.join(IMAGES_DIR, month, 'scene.png');

    // Check if image exists
    try {
      await fs.access(imagePath);
    } catch {
      console.log(`  ⚠️  Image not found: ${imagePath}`);
      continue;
    }

    console.log(`  🔲 Removing background...`);

    const result = await removeBackground(imagePath);

    if (result) {
      await fs.writeFile(imagePath, result);
      console.log(`  ✅ Saved transparent image`);
      successful++;
    }

    // Rate limiting between requests (not after the last one)
    if (!dryRun && monthsToProcess.indexOf(month) < monthsToProcess.length - 1) {
      console.log(`  ⏳ Waiting ${RATE_LIMIT_DELAY / 1000}s for rate limit...\n`);
      await sleep(RATE_LIMIT_DELAY);
    } else {
      console.log('');
    }
  }

  console.log('==============================');
  console.log(`✨ Complete! ${dryRun ? 'Would process' : 'Processed'} ${successful}/${processed} images`);
}

main().catch(console.error);
