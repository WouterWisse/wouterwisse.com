export type Month =
  | 'january' | 'february' | 'march' | 'april'
  | 'may' | 'june' | 'july' | 'august'
  | 'september' | 'october' | 'november' | 'december';

export type Mode = 'light' | 'dark';

// Single scene per month - self-contained spot illustrations
// Base character - footwear specified per activity in each prompt
export const CHARACTER_DESC = 'single person, one man only, friendly young man in his early 30s, slim thin athletic build, lean body type, exactly two arms, exactly two hands, exactly two legs, short blonde hair, light stubble, bright blue eyes, vivid blue eye color, natural human proportions, gold wedding ring on left ring finger, Apple Watch on left wrist only';

// Background colors
export const LIGHT_BACKGROUND = '#fafafa';
export const DARK_BACKGROUND = '#1a1025';

export const LIGHT_BASE_STYLE = `3D render, Pixar Disney animation style, soft lighting, vibrant colors, highly detailed, cute, solid white background, simple minimalist scene, anatomically correct human with exactly two arms and exactly two legs, slim thin athletic body, lean proportions, clear visible ground plane, sharp clean outlines, crisp edges, high contrast between subject and background, isolated subject, single character only`;

export const DARK_BASE_STYLE = `3D render, Pixar Disney animation style, warm moody lighting, rich colors, highly detailed, cute, solid dark purple background, simple minimalist scene, anatomically correct human with exactly two arms and exactly two legs, slim thin body even when lying down or relaxed, lean athletic proportions maintained in all poses, clear visible ground plane, sharp clean outlines, crisp edges, high contrast between subject and background, isolated subject, single character only`;

// Light mode: Active, productive, daytime activities - MacBook in scene
export const LIGHT_PROMPTS: Record<Month, string> = {
  january: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing ski goggles on forehead, red ski jacket, black ski trousers, ski boots, standing in ski lodge looking out large window at snowy mountain, single MacBook laptop open on wooden table, coffee mug, skis propped against wall`,

  february: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing brown cable-knit sweater, jeans, wool socks, sitting in armchair with headphones on, eyes closed enjoying music, single MacBook laptop on side table, mug of hot cocoa, fireplace glowing, cozy living room`,

  march: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing blue running shirt, black shorts, running shoes, stretching by park bench, single MacBook laptop on bench, water bottle nearby, cherry blossom tree in bloom, morning sunlight`,

  april: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing blue cycling jersey, black cycling shorts, cycling shoes, helmet, standing next to road bicycle, single MacBook laptop balanced on bike saddle, countryside road with spring flowers`,

  may: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing casual t-shirt, jeans, white Nike Air Max sneakers, sitting on grass under tree, single MacBook laptop on lap, coffee cup beside him, sunny park with flowers`,

  june: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing black wetsuit unzipped to waist, swim goggles on forehead, barefoot, sitting on wooden dock with feet in water, single MacBook laptop beside him, towel nearby, calm lake`,

  july: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing orange board shorts, rash guard, barefoot, sitting on beach towel, surfboard stuck in sand, single MacBook laptop open, coconut drink, palm tree and waves`,

  august: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing Hawaiian shirt, linen shorts, barefoot, sunglasses, lounging in hammock, single MacBook laptop on stomach, coconut drink in hand, palm trees, blue sky`,

  september: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing grey hoodie, jeans, Nike Air Max sneakers, sitting at desk with ultrawide monitor and single MacBook laptop, coffee mug, headphones around neck, home office`,

  october: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing blue work overalls with grease stains, work boots, holding wrench, working on vintage car with hood open, single MacBook laptop on workbench showing repair video, toolbox nearby`,

  november: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing orange sweater, comfortable pants, wool socks, curled up in reading chair scrolling on phone, single MacBook laptop on ottoman, cup of tea, bookshelf, rainy window, cat on armrest`,

  december: `${LIGHT_BASE_STYLE}, ${CHARACTER_DESC} wearing red christmas sweater, comfortable pants, wool socks, sitting on floor next to christmas tree, single MacBook laptop open, mug of hot cocoa, wrapped presents, string lights, cozy holiday scene`,
};

// Dark mode: Relaxed, after-hours, fun evening activities - MacBook only where it makes sense
export const DARK_PROMPTS: Record<Month, string> = {
  january: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing open ski jacket, ski trousers, ski boots, sitting at wooden après-ski bar table, holding large beer mug, rosy cheeks, plate of cheese fondue, skis propped against wall, cozy lodge with string lights`,

  february: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing cable-knit sweater, comfortable pants, wool socks, passed out on couch, headphones still on, soft blanket, empty hot cocoa mug, fireplace glowing, empty wine bottle on coffee table`,

  march: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing running shirt, shorts, running shoes, collapsed on grass in starfish position, exhausted but happy expression, empty water bottle knocked over, energy gel packets, grass stains on shirt, sunset sky`,

  april: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing cycling jersey, cycling shorts, cycling shoes, sitting defeated on ground next to bike with flat tire, holding phone looking confused, bike pump on ground, spare tube still in package, evening light`,

  may: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing t-shirt, jeans, Nike Air Max sneakers, napping on park bench, single MacBook laptop closed on chest, sunglasses crooked, empty coffee cup on ground, sunset through trees`,

  june: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing swim trunks, barefoot, floating on pink inflatable flamingo in pool, sunglasses, holding tropical cocktail with umbrella, pool lights glowing, starry evening sky, relaxed expression`,

  july: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing board shorts, barefoot, sleeping on beach towel, surfboard in sand, empty coconut drink, sunglasses on face, sunset beach, cooler with beers nearby`,

  august: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing unbuttoned Hawaiian shirt, linen shorts, barefoot, asleep in hammock, empty cocktail glass dangling from hand, fairy lights in palm trees, starry night`,

  september: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing grey hoodie, sweatpants, socks, asleep at desk with face on keyboard, single MacBook laptop screen showing code, stack of empty coffee cups, pizza box with last slice, desk lamp on, night window`,

  october: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing oil-stained overalls, work boots, lying under vintage car on creeper, only legs visible, tools scattered, pizza box and beer bottle on workbench, single MacBook showing YouTube repair video, garage light`,

  november: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing orange sweater, pants, wool socks, asleep in armchair, phone fallen in lap, wine glass tilted on armrest, cheese plate, cat curled up on lap, rain on window, candles`,

  december: `${DARK_BASE_STYLE}, ${CHARACTER_DESC} wearing red christmas sweater, pants, wool socks, lying on couch with one arm on chest and one arm hanging off edge, peaceful sleeping face, cookie crumbs on sweater, empty wine bottle on coffee table, christmas tree with lights, wrapping paper on floor`,
};

export const MONTHS: Month[] = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];
