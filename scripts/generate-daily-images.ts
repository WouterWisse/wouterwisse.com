import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';
import { LIGHT_PROMPTS, DARK_PROMPTS, MONTHS, Month } from '../src/config/prompts';
import { fetchTopHeadlines, generateNewsPromptAdditions } from './fetch-news';

const replicate = new Replicate();

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'themes');

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dateArg = args.find(a => a.startsWith('--date='))?.split('=')[1];

// Character reference image for consistent look
const CHARACTER_REFERENCE = process.env.CHARACTER_REF || 'https://raw.githubusercontent.com/WouterWisse/wouterwisse.com/6b78c66e44740d126b53c2281c429427fb347738/public/images/character-reference.png';

// API Keys
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

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

function getMonthFromDate(date: Date): Month {
  const monthNames: Month[] = MONTHS;
  return monthNames[date.getMonth()];
}

function getBasePromptForMonth(month: Month, mode: 'light' | 'dark'): string {
  // Use the full monthly themed prompts from config
  // These contain the rich, detailed scene descriptions for each month
  const prompts = mode === 'light' ? LIGHT_PROMPTS : DARK_PROMPTS;
  return prompts[month];
}

async function main() {
  console.log('📰 Daily News-Based Image Generation');
  console.log('====================================\n');

  // Check for required API keys
  if (!NEWS_API_KEY && !dryRun) {
    console.error('❌ ERROR: NEWS_API_KEY environment variable not set');
    console.error('   Get your free API key from: https://newsapi.org/');
    process.exit(1);
  }

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

  // Determine the date to generate images for
  const targetDate = dateArg ? new Date(dateArg) : new Date();
  const dateString = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const month = getMonthFromDate(targetDate);

  console.log(`📅 Generating images for: ${dateString} (${month})\n`);

  // Fetch news headlines
  console.log('📡 Fetching news headlines...');
  let newsAdditions = { light: '', dark: '' };

  if (NEWS_API_KEY) {
    try {
      const newsSummary = await fetchTopHeadlines(targetDate, NEWS_API_KEY);
      console.log(`✅ Fetched ${newsSummary.headlines.length} headlines:`);
      newsSummary.headlines.forEach((h, i) => {
        console.log(`   ${i + 1}. ${h.title}`);
      });
      console.log(`\n   Detected topics: ${newsSummary.topics.join(', ') || 'none'}`);

      newsAdditions = generateNewsPromptAdditions(newsSummary);
      console.log(`\n   Light mode additions: ${newsAdditions.light || '(none)'}`);
      console.log(`   Dark mode additions: ${newsAdditions.dark || '(none)'}\n`);
    } catch (error) {
      console.error('⚠️  Failed to fetch news, continuing without news context\n', error);
    }
  } else {
    console.log('⚠️  No NEWS_API_KEY, skipping news fetch\n');
  }

  const monthDir = path.join(OUTPUT_DIR, month);
  await ensureDir(monthDir);

  const modes: ('light' | 'dark')[] = ['light', 'dark'];
  let generatedImages = 0;

  for (let i = 0; i < modes.length; i++) {
    const mode = modes[i];
    const basePrompt = getBasePromptForMonth(month, mode);
    const newsAddition = newsAdditions[mode];
    const fullPrompt = basePrompt + newsAddition;

    console.log(`🎨 Generating ${mode} mode image [${i + 1}/${modes.length}]`);
    console.log(`  📝 Full prompt:\n${fullPrompt}\n`);

    const outputPath = path.join(monthDir, `${dateString}-${mode}.png`);

    console.log(`  🖼️  Generating scene...`);

    const imageUrl = await generateScene(fullPrompt);

    if (imageUrl) {
      const imageBuffer = await downloadImage(imageUrl);
      await fs.writeFile(outputPath, imageBuffer);
      console.log(`  ✅ Saved to ${outputPath}`);
      generatedImages++;
    } else {
      console.log(`  ❌ Failed to generate ${mode} mode image`);
    }

    // Rate limiting between requests (not after the last one)
    if (!dryRun && i < modes.length - 1) {
      console.log(`  ⏳ Waiting ${RATE_LIMIT_DELAY / 1000}s for rate limit...\n`);
      await sleep(RATE_LIMIT_DELAY);
    } else {
      console.log('');
    }
  }

  console.log('====================================');
  console.log(`✨ Complete! ${dryRun ? 'Would generate' : 'Generated'} ${generatedImages}/${modes.length} images`);

  if (!dryRun && generatedImages > 0) {
    console.log(`\n💡 Images saved to: ${monthDir}`);
  }
}

main().catch(console.error);
