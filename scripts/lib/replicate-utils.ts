import Replicate from 'replicate';

const replicate = new Replicate();

// Rate limiting delay (ms between requests) - Replicate has 6 req/min limit
export const RATE_LIMIT_DELAY = 12000;

/**
 * Sleep for a specified duration
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a scene using Replicate API with robust output format handling
 */
export async function generateScene(
  prompt: string,
  options?: {
    model?: `${string}/${string}` | `${string}/${string}:${string}`;
    aspectRatio?: string;
    outputFormat?: string;
    characterReference?: string;
    dryRun?: boolean;
  }
): Promise<string | null> {
  const {
    model = 'black-forest-labs/flux-kontext-pro' as const,
    aspectRatio = '1:1',
    outputFormat = 'png',
    characterReference,
    dryRun = false,
  } = options || {};

  if (dryRun) {
    console.log(`  [DRY RUN] Would generate: "${prompt.substring(0, 100)}..."`);
    return null;
  }

  try {
    const input: Record<string, unknown> = {
      prompt,
      aspect_ratio: aspectRatio,
      output_format: outputFormat,
    };

    // Use character reference if provided for consistent character appearance
    if (characterReference) {
      input.image = characterReference;
    }

    const output = await replicate.run(model, { input });

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
