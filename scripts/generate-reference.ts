import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';

const replicate = new Replicate();

const CHARACTER_DESC = 'single person, one man only, friendly young caucasian man in his early 30s, slim thin athletic build, lean body type, medium height, exactly two arms, exactly two hands with five fingers each, exactly two legs, short neat blonde hair with natural texture, light blonde eyebrows, visible light stubble beard covering jaw and chin, fair skin with slight tan, friendly long face shape, bright vivid blue eyes looking straight ahead not cross-eyed, larger than average nose, friendly slight smile showing no teeth, normal human ears, natural human proportions, gold wedding ring on left ring finger';

const PROMPT = `3D render, Pixar Disney animation style, soft lighting, vibrant colors, highly detailed, cute, solid white background, ${CHARACTER_DESC}, wearing casual grey hoodie, upper body portrait, arms relaxed at sides in neutral stance, looking directly at camera, friendly slight smile, clean simple centered composition, perfect character reference sheet`;

const CHARACTER_REFERENCE = 'https://raw.githubusercontent.com/WouterWisse/wouterwisse.com/6b78c66e44740d126b53c2281c429427fb347738/public/images/character-reference.png';

async function main() {
  console.log('🎨 Generating character reference image...\n');
  console.log('📷 Using existing reference:', CHARACTER_REFERENCE.substring(0, 60) + '...\n');

  const output = await replicate.run(
    'black-forest-labs/flux-kontext-pro',
    {
      input: {
        prompt: PROMPT,
        image: CHARACTER_REFERENCE,
        aspect_ratio: '1:1',
        output_format: 'png',
      }
    }
  );

  // Handle different output formats
  let imageUrl: string | null = null;
  if (typeof output === 'string') imageUrl = output;
  else if (Array.isArray(output) && typeof output[0] === 'string') imageUrl = output[0];
  else if (output && typeof output === 'object') {
    const str = String(output);
    if (str.startsWith('http')) imageUrl = str;
  }

  if (!imageUrl) {
    console.error('Failed to get image URL from output:', output);
    process.exit(1);
  }

  console.log('✅ Image generated, downloading...');

  const response = await fetch(imageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());

  const outputPath = path.join(process.cwd(), 'public', 'images', 'character-reference-new.png');
  await fs.writeFile(outputPath, buffer);

  console.log(`\n🎉 Saved to: ${outputPath}`);
  console.log('\nIf it looks good, replace the old reference:');
  console.log('  mv public/images/character-reference.png public/images/character-reference-old.png');
  console.log('  mv public/images/character-reference-new.png public/images/character-reference.png');
}

main().catch(console.error);
