import fs from 'fs/promises';
import path from 'path';
import { LIGHT_PROMPTS, DARK_PROMPTS, MONTHS, Month, Mode } from '../src/config/prompts';
import { generateScene, sleep, RATE_LIMIT_DELAY } from './lib/replicate-utils';
import { downloadImage, ensureDir } from './lib/file-utils';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'themes');

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const monthArg = args.find(a => a.startsWith('--month='))?.split('=')[1] as Month | undefined;
const modeArg = args.find(a => a.startsWith('--mode='))?.split('=')[1] as Mode | undefined;

// Character reference image for consistent look
const CHARACTER_REFERENCE = process.env.CHARACTER_REF || 'https://raw.githubusercontent.com/WouterWisse/wouterwisse.com/6b78c66e44740d126b53c2281c429427fb347738/public/images/character-reference.png';

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

      const imageUrl = await generateScene(prompt, {
        characterReference: CHARACTER_REFERENCE,
        dryRun,
      });

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
