export type Month =
  | 'january' | 'february' | 'march' | 'april'
  | 'may' | 'june' | 'july' | 'august'
  | 'september' | 'october' | 'november' | 'december';

// Single scene per month now (not 3 layers)
export const CHARACTER_DESC = 'young man with short blonde hair and light stubble beard, friendly smile, blue eyes, Pixar 3D style character';

export const BASE_STYLE = '3D render, Pixar Disney animation style, soft lighting, vibrant colors, highly detailed, cute, white background';

export const SCENE_PROMPTS: Record<Month, string> = {
  january: `${BASE_STYLE}, ${CHARACTER_DESC} wearing ski goggles on head and blue ski jacket, holding ski poles, standing on small floating snowy mountain island with pine trees and tiny ski lodge, snow particles, winter wonderland diorama, isometric view`,

  february: `${BASE_STYLE}, ${CHARACTER_DESC} wearing cozy sweater, sitting in comfortable armchair reading a book, on small floating cozy room island with fireplace and stack of books, warm lighting, cozy winter diorama, isometric view`,

  march: `${BASE_STYLE}, ${CHARACTER_DESC} wearing running gear and sneakers, jogging pose, on small floating spring park island with cherry blossom trees and running trail, morning light, spring diorama, isometric view`,

  april: `${BASE_STYLE}, ${CHARACTER_DESC} on road bicycle wearing cycling jersey and helmet, riding on small floating countryside island with winding road and spring flowers, sunny day, cycling diorama, isometric view`,

  may: `${BASE_STYLE}, ${CHARACTER_DESC} wearing casual clothes and sunglasses, holding MacBook laptop, sitting on park bench on small floating sunny park island with trees and flowers, outdoor coding, spring diorama, isometric view`,

  june: `${BASE_STYLE}, ${CHARACTER_DESC} wearing wetsuit and swim goggles on forehead, standing on small floating lake island with wooden dock and blue water, triathlon swimmer, summer morning diorama, isometric view`,

  july: `${BASE_STYLE}, ${CHARACTER_DESC} wearing board shorts, holding surfboard under arm, standing on small floating tropical beach island with palm tree and turquoise water, summer surf diorama, isometric view`,

  august: `${BASE_STYLE}, ${CHARACTER_DESC} wearing Hawaiian shirt and sunglasses, relaxing in hammock with coconut drink, on small floating paradise island with two palm trees, tropical vacation diorama, isometric view`,

  september: `${BASE_STYLE}, ${CHARACTER_DESC} wearing casual hoodie, standing at desk with multiple monitors typing on keyboard, on small floating modern desk island with plants and coffee mug, productive coder diorama, isometric view`,

  october: `${BASE_STYLE}, ${CHARACTER_DESC} wearing work overalls, holding wrench, working on vintage car engine, on small floating garage workshop island with tools and car parts, mechanic diorama, isometric view`,

  november: `${BASE_STYLE}, ${CHARACTER_DESC} wearing warm chunky sweater, sitting in reading nook with book and hot drink, on small floating cozy corner island with bookshelf and rain on window, autumn reading diorama, isometric view`,

  december: `${BASE_STYLE}, ${CHARACTER_DESC} wearing red santa hat and christmas sweater, holding laptop showing code, on small floating winter cabin island with christmas tree and presents and fairy lights, holiday coding diorama, isometric view`,
};

export const MONTHS: Month[] = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];
