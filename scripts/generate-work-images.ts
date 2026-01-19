import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';
import { CHARACTER_DESC, LIGHT_BASE_STYLE, DARK_BASE_STYLE } from '../src/config/prompts';

const replicate = new Replicate();

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'work');

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// Character reference image for consistent look
const CHARACTER_REFERENCE = process.env.CHARACTER_REF || 'https://raw.githubusercontent.com/WouterWisse/wouterwisse.com/6b78c66e44740d126b53c2281c429427fb347738/public/images/character-reference.png';

// API Keys
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

// Rate limiting delay (ms between requests) - Replicate has 6 req/min limit
const RATE_LIMIT_DELAY = 12000;

// Work scene prompts - secret project for tradespeople app
const WORK_LIGHT_PROMPT = `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} sitting at ergonomic desk chair in home office with clay pink terracotta walls and natural wood acoustic panels, wearing casual grey t-shirt, multiple monitors surrounding him showing colorful code editors with syntax highlighting, multiple phones on desk showing app mockups, MacBook Pro laptop open, IMPORTANT: doing shhhh gesture with index finger pressed against lips in playful secretive expression bright eyes looking at viewer sharing a secret, the room is filled with tradesperson tools and props scattered everywhere - paintbrushes in jars, hammers, screwdrivers, wrenches, measuring tape, level tool, nails and screws in containers, power drill, toolbox on floor, paint cans, all suggesting an app for tradespeople, warm productive lighting, working on something exciting and secret, compact centered desk setup`;

const WORK_DARK_PROMPT = `${DARK_BASE_STYLE}, ${CHARACTER_DESC} sitting at ergonomic desk chair in home office with clay pink terracotta walls and natural wood acoustic panels, wearing casual grey t-shirt, multiple monitors surrounding him glowing with colorful code editors with syntax highlighting providing the main light source, multiple phones on desk showing app mockups with glowing screens, MacBook Pro laptop open glowing, IMPORTANT: doing shhhh gesture with index finger pressed against lips in playful secretive expression eyes looking at viewer sharing a secret, the room is filled with tradesperson tools and props scattered everywhere - paintbrushes in jars, hammers, screwdrivers, wrenches, measuring tape, level tool, nails and screws in containers, power drill, toolbox on floor, paint cans, dim ambient moody lighting with monitors as main light source, late night coding session on secret project, working hard in the dark, compact centered desk setup`;

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
    // Handle FileOutput object
    if (output && typeof output === 'object') {
      const obj = output as { url?: () => string | Promise<string> } | { toString?: () => string };
      if ('url' in obj && typeof obj.url === 'function') {
        return await obj.url();
      }
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
  console.log('🔨 Work Image Generation');
  console.log('========================\n');

  if (!REPLICATE_TOKEN && !dryRun) {
    console.error('❌ ERROR: REPLICATE_API_TOKEN environment variable not set');
    process.exit(1);
  }

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No images will be generated\n');
  }

  if (CHARACTER_REFERENCE) {
    console.log(`✅ Using character reference: ${CHARACTER_REFERENCE.substring(0, 50)}...\n`);
  }

  await ensureDir(OUTPUT_DIR);

  const prompts = [
    { mode: 'light', prompt: WORK_LIGHT_PROMPT },
    { mode: 'dark', prompt: WORK_DARK_PROMPT },
  ];

  let generatedImages = 0;

  for (let i = 0; i < prompts.length; i++) {
    const { mode, prompt } = prompts[i];

    console.log(`🎨 Generating ${mode} mode image [${i + 1}/${prompts.length}]`);
    console.log(`  📝 Prompt:\n${prompt}\n`);

    const outputPath = path.join(OUTPUT_DIR, `${mode}.png`);

    console.log(`  🖼️  Generating scene...`);

    const imageUrl = await generateScene(prompt);

    if (imageUrl) {
      const imageBuffer = await downloadImage(imageUrl);
      await fs.writeFile(outputPath, imageBuffer);
      console.log(`  ✅ Saved to ${outputPath}`);
      generatedImages++;
    } else {
      console.log(`  ❌ Failed to generate ${mode} mode image`);
    }

    // Rate limiting between requests (not after the last one)
    if (!dryRun && i < prompts.length - 1) {
      console.log(`  ⏳ Waiting ${RATE_LIMIT_DELAY / 1000}s for rate limit...\n`);
      await sleep(RATE_LIMIT_DELAY);
    } else {
      console.log('');
    }
  }

  console.log('========================');
  console.log(`✨ Complete! ${dryRun ? 'Would generate' : 'Generated'} ${generatedImages}/${prompts.length} images`);

  if (!dryRun && generatedImages > 0) {
    console.log(`\n💡 Images saved to: ${OUTPUT_DIR}`);
    console.log('\n📌 Next steps:');
    console.log('   1. Run: npm run generate-blur-placeholders');
    console.log('   2. The blur placeholders will be updated automatically');
  }
}

main().catch(console.error);
