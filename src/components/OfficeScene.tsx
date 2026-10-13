'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode, type SVGProps } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiAndroid, SiApple, SiClaude, SiKotlin, SiNextdotjs, SiOpenai, SiReact, SiSwift, SiTailwindcss, SiTypescript } from 'react-icons/si';
import { OFFICE_LAYERS, OFFICE_MUSIC_BEAT, officeLayerStyle } from '@/config/office';
import dayBounds from '@/config/office-layer-bounds.json';
import nightBounds from '@/config/office-night-layer-bounds.json';
import type { OfficeSound } from '@/hooks/useKeyboardSounds';

const character = OFFICE_LAYERS.find(layer => layer.id === 'character')!;
// Reveal only the fingers over the keys; the complete body stays behind the desk.
const handPoints = [
  [[623, 444], [651, 436], [674, 427], [706, 426], [723, 432], [735, 451], [747, 459], [747, 467], [735, 472], [727, 470], [721, 477], [711, 478], [704, 473], [696, 478], [688, 477], [683, 471], [674, 475], [663, 473], [651, 479], [638, 479], [628, 473], [623, 461]],
  [[778, 461], [792, 439], [810, 427], [836, 426], [856, 433], [875, 436], [898, 445], [903, 461], [899, 474], [889, 480], [873, 479], [860, 474], [852, 478], [843, 478], [836, 472], [828, 477], [818, 477], [813, 471], [805, 475], [795, 473], [790, 469], [781, 470], [777, 466]],
];
function handClip(index: number, night: boolean) {
  const from = dayBounds.character;
  const to = night ? nightBounds.character : from;
  return `polygon(${handPoints[index].map(([x, y]) => `${(to.left + (x - from.left) / from.width * to.width) / 1536 * 100}% ${(to.top + (y - from.top) / from.height * to.height) / 1024 * 100}%`).join(', ')})`;
}

// The artwork's legs read ~2× life size next to the desk. They shrink toward a seam at scene y 625,
// hidden behind the desk top (its underside is at y 642), so the head and hands keep their size.
// Length shrinks less than width so the shoes still land at the chair's wheel line (y ~916).
const LEG_SCALE = '.8, .93';
const LEG_SEAM = (625 - 168.7) / 794.1 * 100; // scene y 625 as % of the character image box
const legsOrigin = `${725 / 1536 * 100}% ${625 / 1024 * 100}%`; // centre of the legs, on the seam

const lamp = OFFICE_LAYERS.find(layer => layer.id === 'lamp')!;
const monitor = OFFICE_LAYERS.find(layer => layer.id === 'monitor')!;
const phone = OFFICE_LAYERS.find(layer => layer.id === 'phone')!;
const wineBottle = OFFICE_LAYERS.find(layer => layer.id === 'wine')!;
const mug = OFFICE_LAYERS.find(layer => layer.id === 'mug')!;
const macStudio = OFFICE_LAYERS.find(layer => layer.id === 'mac-studio')!;
const sonos = OFFICE_LAYERS.find(layer => layer.id === 'sonos')!;
const faces = ['blink-half', 'blink-closed', 'smile', 'focus', 'side-eye', 'look-bottle'];
type Reaction = 'idle' | 'phone' | 'drink' | 'turbo';
type Phase = 'start' | 'sip' | 'return' | 'success';
// Besona is retired for now; uncomment this and its sticker entry to bring it back.
// // The viewBox crops the 72×72 brand square so the mark fills the sticker like the original logo.
// function BesonaLogo({ size, ...props }: SVGProps<SVGSVGElement> & { size: number }) {
//   return (
//     <svg {...props} width={size} height={size} viewBox="7 7 58 58">
//       <path d="M30.4516 22.0282C35.0753 21.9971 37.9873 28.6103 40.6624 28.6107C43.3373 28.6107 44.9574 21.6359 48.5953 22.0149C52.2333 22.3939 53.0469 30.3523 52.998 36.2074C52.9503 41.9092 52.2336 49.605 48.5953 49.9844C44.9571 50.3638 43.3375 43.6884 40.6624 43.6884C37.9873 43.6884 35.0218 50.0437 30.4516 49.971C23.7527 49.8644 18.9726 43.2997 19.0001 35.9418C19.0275 28.6174 23.7826 22.073 30.4516 22.0282Z" fill="#050505" fillOpacity=".95" />
//     </svg>
//   );
// }
// The 6wines wordmark from 6wines.nl, drawn in currentColor.
function SixWinesLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 138 36">
      <g fill="currentColor" fillRule="evenodd">
        <path d="M43.302 24.548 37.931 9.91l-4.762.234-3.907 15.095-5.116-14.651-5.253.258 8.235 22.319.035.095 4.927-.243 3.861-14.845 5.265 14.299.035.095 4.927-.242 6.029-23.117-5.254.259z" />
        <path transform="translate(.5 .329)" d="M5.183 24.255a4.74 4.74 0 0 1 4.05-5.331 4.738 4.738 0 0 1 5.33 4.048 4.74 4.74 0 0 1-4.048 5.332 4.735 4.735 0 0 1-5.332-4.049m3.39-10.15c-.91.124-1.77.375-2.571.728C8.319 8.166 13.66 4.758 13.978 4.56l.439-.274L11.86.151l-.442.272c-.144.09-3.565 2.227-6.6 6.395-2.643 3.633-5.977 9.487-4.42 18.327l.074.425H.48c.927 4.463 4.886 7.643 9.387 7.643.431 0 .868-.03 1.307-.09 5.243-.716 8.926-5.566 8.21-10.809-.718-5.244-5.57-8.923-10.81-8.21" />
        <path d="m53.784 33.749 4.94.32 1.48-22.744-4.941-.321zm4.17-30.794a2.836 2.836 0 1 0-.368 5.659 2.836 2.836 0 0 0 .368-5.66m23.042 9.967a8.246 8.246 0 0 0-2.986-1.947c-1.11-.418-2.434-.624-3.944-.609-1.566.016-2.982.432-4.21 1.235-.487.32-.948.672-1.373 1.05l-.02-1.892-4.95.05.232 22.792 4.95-.05-.132-12.991c-.017-1.638.484-2.94 1.529-3.982 1.056-1.03 2.317-1.538 3.854-1.554h.071c1.457 0 2.613.46 3.53 1.405.945.973 1.413 2.276 1.43 3.983l.131 12.895.001.138 4.951-.05-.133-13.117c-.03-3.036-1.017-5.511-2.93-7.356m45.69 7.427a18.317 18.317 0 0 0-3.441-1.386 47.387 47.387 0 0 1-3.233-1.066c-.915-.341-1.667-.737-2.235-1.175-.4-.308-.55-.667-.5-1.2.028-.303.075-.811.583-1.212.648-.513 1.838-.696 3.545-.534 3.62.337 4.088 1.807 4.125 2.883l.027.792 4.973.464-.021-1.011c-.043-1.948-.72-3.6-2.015-4.914-1.51-1.508-3.678-2.404-6.444-2.662-2.89-.267-5.188.11-6.828 1.128-1.722 1.07-2.699 2.72-2.902 4.9-.14 1.513.173 2.772.931 3.743.69.886 1.602 1.626 2.708 2.2a19.35 19.35 0 0 0 3.433 1.36 40.63 40.63 0 0 1 3.22 1.083c.911.353 1.658.764 2.22 1.225.408.332.566.733.513 1.3-.083.896-.593 1.45-1.604 1.745a7.236 7.236 0 0 1-1.637.26c-1.5.065-2.716-.105-3.714-.517-1.6-.712-2.35-1.784-2.364-3.375l-.006-.815-5.02-.466-.036.952c-.082 2.242.67 4.16 2.234 5.696 1.66 1.696 4.02 2.697 7.012 2.976.38.035.75.059 1.112.07 2.305.074 4.25-.333 5.796-1.214 1.895-1.08 2.966-2.811 3.183-5.146.144-1.535-.163-2.818-.912-3.815-.69-.916-1.599-1.68-2.703-2.269m-23.472-2.735-11.953 1.504c.184-1.207.638-2.23 1.383-3.123 1.013-1.192 2.332-1.875 4.032-2.09.329-.04.651-.062.964-.062.182 0 .36.007.535.021a5.722 5.722 0 0 1 2.918 1.061c.948.684 1.643 1.565 2.121 2.689Zm5.57 1.9c-.416-3.3-1.77-5.943-4.025-7.857-2.396-1.996-5.312-2.794-8.664-2.372-3.355.423-5.983 1.92-7.81 4.45-1.71 2.41-2.365 5.305-1.95 8.603.413 3.277 1.81 5.916 4.156 7.845 1.999 1.641 4.351 2.469 7.01 2.469.564 0 1.141-.037 1.732-.112 2.655-.334 4.793-1.261 6.351-2.755 1.541-1.478 2.588-3.312 3.112-5.45l.31-1.273-5.254.662-.19.51c-.81 2.166-2.403 3.37-4.87 3.68-1.833.231-3.361-.131-4.672-1.106a6.468 6.468 0 0 1-2.249-2.977l17.282-2.174-.27-2.143Z" />
        <path transform="translate(129.734 1.92)" d="M3.013 5.515C1.707 5.515.679 4.462.679 3.091S1.707.675 3.013.675 5.347 1.72 5.347 3.091 4.32 5.515 3.013 5.515m0-5.436C1.364.08.042 1.434.042 3.091s1.322 3.02 2.97 3.02c1.658 0 2.997-1.363 2.997-3.02A3.006 3.006 0 0 0 3.013.08" />
        <path d="M132.796 4.865h-.425v-.98h.425c.367 0 .571.18.571.498 0 .302-.204.482-.571.482m1.2-.49c0-.58-.474-1.029-1.11-1.029h-1.135v3.282h.62V5.403h.245l.686 1.225h.71l-.735-1.282c.425-.139.719-.514.719-.971" />
      </g>
    </svg>
  );
}

interface Sticker {
  id: string;
  label: string;
  /** Link stickers stick back after peeling; the rest can be pulled clean off. */
  href?: string;
  /** Lets a link sticker be pulled clean off too. */
  removable?: boolean;
  left: string;
  top: string;
  tilt: number;
  paper: string;
  /** Backing card centred on (50, 50) in the decal's 100-unit-wide viewBox. */
  shape: { width: number; height: number; radius: number };
  /** Artwork drawn upright; the sticker tilts it with the backing. */
  art: ReactNode;
  viewBox?: string;
  sheen?: boolean;
}
const circle = { width: 82, height: 82, radius: 41 };
const square = { width: 82, height: 82, radius: 13 };
const stickers: Sticker[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/WouterWisse', art: <FaGithub x="17" y="17" size={66} />, paper: '#fffaf0', tilt: -14, shape: circle, left: '15%', top: '32%' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/wwisse/', art: <FaLinkedin x="17" y="17" size={66} />, paper: '#fffaf0', tilt: 11, shape: square, left: '75%', top: '19%' },
  // { id: 'besona', label: 'Besona', href: 'https://besona.ai', art: <BesonaLogo x="17" y="17" size={66} />, paper: '#c4bdf2', tilt: -5, shape: circle, left: '66.75%', top: '51.4%' },
  // A pill in 6wines' burgundy and peach, centred where Besona was.
  { id: 'sixwines', label: '6wines', href: 'https://www.6wines.nl/', removable: true, viewBox: '0 32 100 36', sheen: false, art: <SixWinesLogo x="12" y="40.1" width="76" height="19.8" />, paper: '#511027', tilt: -4, shape: { width: 92, height: 32, radius: 16 }, left: '64.5%', top: '55.1%' },
  { id: 'claude', label: 'Claude', art: <SiClaude x="22" y="22" size={56} />, paper: '#faf9f5', tilt: 9, shape: circle, left: '8%', top: '9%' },
  { id: 'chatgpt', label: 'ChatGPT', art: <SiOpenai x="22" y="22" size={56} />, paper: '#fffaf0', tilt: -8, shape: square, left: '29%', top: '57%' },
  // Tiny decals of the platforms and packages Wouter builds with.
  { id: 'react', label: 'React', art: <SiReact x="19" y="19" size={62} />, paper: '#20232a', tilt: 12, shape: circle, left: '20%', top: '6%' },
  { id: 'nextjs', label: 'Next.js', art: <SiNextdotjs x="12" y="12" size={76} />, paper: '#fff', tilt: -10, shape: circle, left: '28%', top: '15%' },
  { id: 'typescript', label: 'TypeScript', art: <SiTypescript x="17" y="17" size={66} />, paper: '#fff', tilt: 7, shape: square, left: '61%', top: '9%' },
  { id: 'tailwind', label: 'Tailwind CSS', art: <SiTailwindcss x="19" y="19" size={62} />, paper: '#fff', tilt: -6, shape: circle, left: '66%', top: '27%' },
  { id: 'apple', label: 'Apple', art: <SiApple x="21" y="19" size={58} />, paper: '#fff', tilt: -9, shape: circle, left: '88.5%', top: '22%' },
  { id: 'android', label: 'Android', art: <SiAndroid x="17" y="17" size={66} />, paper: '#fffaf0', tilt: 10, shape: circle, left: '12%', top: '62%' },
  { id: 'kotlin', label: 'Kotlin', art: <SiKotlin x="22" y="22" size={56} />, paper: '#fff', tilt: -7, shape: square, left: '38.5%', top: '66%' },
  { id: 'swift', label: 'Swift', art: <SiSwift x="20" y="20" size={60} />, paper: '#fff', tilt: 8, shape: square, left: '57.5%', top: '62%' },
  // Credits the deep-house track the Sonos plays, with the artist's Pixabay avatar.
  { id: 'the-mountain', label: 'Music by The_Mountain', href: 'https://pixabay.com/users/the_mountain-3616498/', paper: '#fffaf0', tilt: 6, shape: circle, left: '81%', top: '50%', art: <>
    <clipPath id="the-mountain-avatar"><circle cx="50" cy="50" r="35" /></clipPath>
    <image href="/images/office/scene/stickers/the-mountain.webp" x="15" y="15" width="70" height="70" clipPath="url(#the-mountain-avatar)" />
  </> },
  // The page heading, as a decal: Hero keeps a screen-reader-only h1 for it. Drawn at half scale across the
  // viewBox's middle band, so its centre stays at (50, 50) like the square stickers.
  { id: 'property', label: 'Property of Wouter Wisse', viewBox: '0 36 100 28', sheen: false, paper: '#f3f0e8', tilt: -1.5, shape: { width: 99, height: 27, radius: 2.5 }, left: '39%', top: '17%', art: (
    <g transform="translate(0 36) scale(.5)">
      <rect x="1" y="1" width="198" height="54" rx="5" fill="none" stroke="#cfc8b8" strokeWidth="1.2" />
      <path d="M1 6a5 5 0 0 1 5-5h188a5 5 0 0 1 5 5v15H1Z" fill="#2c3340" />
      <text x="100" y="15.5" textAnchor="middle" fill="#f3f0e8" fontSize="10" fontWeight="800" letterSpacing="3">PROPERTY OF</text>
      <text x="100" y="46" textAnchor="middle" fill="#2c3340" fontSize="23" fontWeight="900" letterSpacing="-.5">WOUTER WISSE</text>
    </g>
  ) },
];

// How far a sticker's backing reaches from its centre towards `angle`, in viewBox units.
function stickerReach({ shape: { width, height, radius }, tilt }: Sticker, angle: number) {
  const local = angle - tilt * Math.PI / 180;
  return (width / 2 - radius) * Math.abs(Math.cos(local)) + (height / 2 - radius) * Math.abs(Math.sin(local)) + radius;
}

interface OfficeSceneProps {
  isDark: boolean;
  onToggleLamp: () => void;
  onType: () => void;
  onPause: () => void;
  onSound: (name: OfficeSound) => void;
  onStopSounds: () => void;
  musicPlaying: boolean;
  onToggleMusic: () => void;
  getMusicTime: () => number;
}

export function OfficeScene({ isDark, onToggleLamp, onType, onPause, onSound, onStopSounds, musicPlaying, onToggleMusic, getMusicTime }: OfficeSceneProps) {
  const stage = useRef<HTMLDivElement>(null);
  const loaded = useRef(new Set<string>());
  const [ready, setReady] = useState(false);
  const [expression, setExpression] = useState('neutral');
  const [facesReady, setFacesReady] = useState(false);
  const faceLoads = useRef(new Set<string>());
  const [reaction, setReaction] = useState<Reaction>('idle');
  const [phase, setPhase] = useState<Phase>('start');
  const [empty, setEmpty] = useState({ day: false, night: false });
  // The 6wines bottle replaces the cup until the lamp resets the desk; one sip empties it.
  const [wine, setWine] = useState<'none' | 'full' | 'empty'>('none');
  const [popping, setPopping] = useState(false);
  const [lookingAtBottle, setLookingAtBottle] = useState(false);
  const [interactionsReady, setInteractionsReady] = useState(false);
  const interactionLoads = useRef(new Set<string>());
  const busy = useRef(false);
  const reactionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const glanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const peel = useRef<{ rect: DOMRect; top: number; x: number; y: number; moved: boolean; loose?: { x: number; y: number; dx: number; dy: number } } | null>(null);
  const [removed, setRemoved] = useState<string[]>([]);
  const peeledClick = useRef(false);
  const mode = isDark ? 'night' : 'day';

  // Dragging peels a sticker from wherever it's grabbed. Positions are in the decal's viewBox, 100 units wide.
  const startPeel = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.button !== 0) return;
    const sticker = event.currentTarget;
    const rect = sticker.getBoundingClientRect();
    const top = sticker.querySelector('svg')!.viewBox.baseVal.y;
    sticker.setPointerCapture(event.pointerId);
    sticker.dataset.peeling = 'true';
    peeledClick.current = false;
    peel.current = { rect, top, x: (event.clientX - rect.left) * 100 / rect.width, y: top + (event.clientY - rect.top) * 100 / rect.width, moved: false };
  };
  const movePeel = (event: React.PointerEvent<HTMLAnchorElement>, shape: Sticker) => {
    const drag = peel.current;
    const sticker = event.currentTarget;
    if (!drag) {
      if (event.pointerType !== 'mouse') return;
      // Hovering lifts the edge nearest the mouse.
      const rect = sticker.getBoundingClientRect();
      const angle = Math.atan2(event.clientY - rect.top - rect.height / 2, event.clientX - rect.left - rect.width / 2);
      sticker.style.setProperty('--peel-angle', `${angle}rad`);
      sticker.style.setProperty('--peel', `${stickerReach(shape, angle) - 7}px`);
      return;
    }
    if (drag.loose) {
      drag.loose.dx = event.clientX - drag.loose.x;
      drag.loose.dy = event.clientY - drag.loose.y;
      sticker.style.translate = `${drag.loose.dx}px ${drag.loose.dy}px`;
      return;
    }
    const dx = (event.clientX - drag.rect.left) * 100 / drag.rect.width - drag.x;
    const dy = drag.top + (event.clientY - drag.rect.top) * 100 / drag.rect.width - drag.y;
    const length = Math.hypot(dx, dy);
    if (!drag.moved && length * drag.rect.width / 100 < 4) return;
    if (!drag.moved) onSound('sticker-peel');
    drag.moved = true;
    // Fold along the perpendicular bisector of grab → pointer, so the grabbed spot lands under the pointer.
    // The fold's normal points back at the grabbed side, which is the side that flips over.
    const nx = -dx / length, ny = -dy / length;
    const angle = Math.atan2(ny, nx);
    const fold = (drag.x + dx / 2 - 50) * nx + (drag.y + dy / 2 - 50) * ny;
    const reach = stickerReach(shape, angle);
    const removable = shape.removable ?? !shape.href;
    sticker.style.setProperty('--peel-angle', `${angle}rad`);
    if (removable && fold < -reach) {
      // Folded clean off: freeze the flipped-over sticker and carry it with the pointer from here.
      drag.loose = { x: event.clientX, y: event.clientY, dx: 0, dy: 0 };
      onSound('sticker-loose');
      sticker.dataset.loose = 'true';
      sticker.style.setProperty('--peel', `${-reach - 1}px`);
      return;
    }
    // Fixed stickers leave a sliver stuck down so they hang off the monitor rather than detaching.
    sticker.style.setProperty('--peel', `${removable ? fold : Math.max(-36, fold)}px`);
  };
  // Pulling the 6wines sticker off pops the cup away and a bottle of their red up in its place;
  // he glances at it with raised eyebrows while it wobbles and settles.
  const popBottle = () => {
    setWine('full');
    setPopping(true);
    setLookingAtBottle(true);
    onSound('pop');
    setTimeout(() => setPopping(false), 1200);
    setTimeout(() => setLookingAtBottle(false), 2600);
  };
  // Stick back down along the current fold (60 clears every sticker), then hand back to the resting peel.
  const settlePeel = (sticker: HTMLElement) => {
    if (sticker.dataset.loose) return;
    sticker.style.setProperty('--peel', '60px');
    setTimeout(() => {
      if (sticker.dataset.peeling || sticker.matches(':hover')) return;
      sticker.style.removeProperty('--peel');
      sticker.style.removeProperty('--peel-angle');
    }, 300);
  };
  const endPeel = (event: React.PointerEvent<HTMLAnchorElement>, id: string) => {
    const sticker = event.currentTarget;
    const drag = peel.current;
    // A drag shouldn't open the link; the click only follows pointerup.
    peeledClick.current = event.type === 'pointerup' && !!drag?.moved;
    peel.current = null;
    delete sticker.dataset.peeling;
    if (!drag?.loose) {
      if (drag?.moved) settlePeel(sticker);
      return;
    }
    // Let go of a loose sticker and it drops away, tumbling around the point it was held by.
    const { x, y, dx, dy } = drag.loose;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sticker.style.transformOrigin = `${x - drag.rect.left}px ${y - drag.rect.top}px`;
    sticker.animate([
      { translate: `${dx}px ${dy}px`, rotate: '0deg', opacity: 1 },
      { translate: `${dx + (still ? 0 : (Math.random() - .5) * 40)}px ${dy + (still ? 0 : 140)}px`, rotate: `${still ? 0 : (Math.random() - .5) * 60}deg`, opacity: 0 },
    ], { duration: still ? 200 : 650, easing: 'cubic-bezier(.5, 0, .9, .5)', fill: 'forwards' }).onfinish = () => {
      setRemoved(previous => [...previous, id]);
      if (id === 'sixwines') popBottle();
    };
  };
  // At night each sticker takes the light the monitor gets where it sits: the night monitor's colour
  // there divided by the day monitor's, applied to that sticker as a colour matrix.
  const [nightLight, setNightLight] = useState<Record<string, string>>({});
  useEffect(() => {
    const root = stage.current;
    const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const [day, night] = (['day', 'night'] as const).map(mode => root?.querySelector<HTMLImageElement>(`.office-layer-monitor .office-mode-${mode}`));
    if (!ready || !root || !context || !day?.naturalWidth || !night?.naturalWidth) return;
    const colourAt = (image: HTMLImageElement, x: number, y: number) => {
      const rect = image.getBoundingClientRect();
      const scale = image.naturalWidth / rect.width;
      context.clearRect(0, 0, 8, 8);
      context.drawImage(image, (x - rect.left) * scale - 12, (y - rect.top) * scale - 12, 24, 24, 0, 0, 8, 8);
      const pixels = context.getImageData(0, 0, 8, 8).data;
      const sum = [0, 0, 0];
      let count = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] < 200) continue;
        sum[0] += pixels[i]; sum[1] += pixels[i + 1]; sum[2] += pixels[i + 2];
        count++;
      }
      return count ? sum.map(channel => channel / count) : null;
    };
    const light: Record<string, string> = {};
    root.querySelectorAll<HTMLElement>('[data-sticker]').forEach(sticker => {
      const rect = sticker.getBoundingClientRect();
      const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
      const [lit, base] = [colourAt(night, x, y), colourAt(day, x, y)];
      if (!lit || !base) return;
      // The .85 exponent eases the darkest corners so stickers stay legible; tune it to taste.
      const [r, g, b] = lit.map((channel, i) => Math.min(1.1, (channel / Math.max(1, base[i])) ** .85).toFixed(3));
      light[sticker.dataset.sticker!] = `${r} 0 0 0 0  0 ${g} 0 0 0  0 0 ${b} 0 0  0 0 0 1 0`;
    });
    setNightLight(light);
  }, [ready]);
  const reacting = reaction !== 'idle';
  const bodyReaction = reaction === 'phone' || reaction === 'drink';
  const turboRunning = reaction === 'turbo' && phase === 'start';
  const typingPaused = reacting && !turboRunning;
  const vibing = musicPlaying && !reacting;
  const visibleExpression = lookingAtBottle ? 'look-bottle' : vibing ? 'smile' : expression;

  const finishReaction = () => {
    reactionTimers.current.forEach(clearTimeout);
    reactionTimers.current = [];
    clearTimeout(glanceTimer.current);
    busy.current = false;
    setReaction('idle');
    setPhase('start');
    setExpression('neutral');
    onStopSounds();
  };

  useEffect(() => {
    const cancel = () => {
      if (!document.hidden) return;
      reactionTimers.current.forEach(clearTimeout);
      reactionTimers.current = [];
      clearTimeout(glanceTimer.current);
      busy.current = false;
      setReaction('idle');
      setPhase('start');
      setExpression('neutral');
      onStopSounds();
    };
    document.addEventListener('visibilitychange', cancel);
    return () => {
      reactionTimers.current.forEach(clearTimeout);
      clearTimeout(glanceTimer.current);
      onStopSounds();
      document.removeEventListener('visibilitychange', cancel);
    };
  }, [onStopSounds]);

  const react = (next: Exclude<Reaction, 'idle'>) => {
    if (!ready || !interactionsReady || !facesReady) return;
    if (busy.current) {
      if (next === 'turbo' && turboRunning) {
        clearTimeout(glanceTimer.current);
        setExpression('side-eye');
        glanceTimer.current = setTimeout(() => setExpression('focus'), 850);
      }
      return;
    }
    if (next === 'drink' && (wine === 'none' ? empty[mode] : wine === 'empty')) return;
    busy.current = true;
    onPause();
    setExpression('neutral');
    setPhase('start');
    setReaction(next);
    const later = (callback: () => void, delay: number) => { reactionTimers.current.push(setTimeout(callback, delay)); };
    if (next === 'phone') {
      onSound('notification');
      later(() => onSound('growl'), 550);
      later(() => setPhase('return'), 2100);
      later(finishReaction, 2550);
    } else if (next === 'drink') {
      later(() => {
        setPhase('sip');
        if (wine === 'none') setEmpty(previous => ({ ...previous, [mode]: true }));
        // Wine gets the sip without the coffee's "ahh"; a burp follows instead.
        onSound(wine === 'none' ? 'slurp' : 'sip');
      }, 800);
      // The slurp ends in a satisfied "ahh" 1.55 s in: lower the cup and raise the eyebrows on it.
      later(() => {
        setPhase('return');
        setExpression('smile');
        // The bottle stays visible at his mouth, so it only comes back down empty.
        if (wine !== 'none') setWine('empty');
      }, 2350);
      // The burp waits until the bottle is back on the desk (the return takes 800 ms).
      if (wine !== 'none') later(() => onSound('burp'), 3250);
      later(finishReaction, 4250);
    } else {
      setExpression('focus');
      onSound('fan');
      later(() => {
        clearTimeout(glanceTimer.current);
        setPhase('success');
        setExpression('smile');
        onSound('success');
      }, 5200);
      later(finishReaction, 6800);
    }
  };

  useEffect(() => {
    if (!ready || !facesReady || reacting) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout>;
    const later = (callback: () => void, delay: number) => { timer = setTimeout(callback, delay); };
    const idle = () => {
      setExpression('neutral');
      later(express, 3000 + Math.random() * 5000);
    };
    const express = () => {
      if (document.hidden || reducedMotion.matches) return;
      if (Math.random() < .25) {
        setExpression('smile');
        later(idle, 1400 + Math.random() * 1200);
      } else {
        setExpression('blink-half');
        later(() => {
          setExpression('blink-closed');
          later(() => { setExpression('blink-half'); later(idle, 55); }, 90);
        }, 45);
      }
    };
    const resume = () => {
      clearTimeout(timer);
      setExpression('neutral');
      if (!document.hidden && !reducedMotion.matches) later(express, 2000 + Math.random() * 4000);
    };
    if (!document.hidden && !reducedMotion.matches) later(express, 2500);
    document.addEventListener('visibilitychange', resume);
    reducedMotion.addEventListener('change', resume);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', resume);
      reducedMotion.removeEventListener('change', resume);
    };
  }, [ready, facesReady, reacting]);

  useEffect(() => {
    if (!ready || typingPaused) return;
    const body = stage.current?.querySelector('.office-layer-character');
    const hands = stage.current?.querySelectorAll('.office-hand');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout>;
    let strokes = 0;
    let burstLength = 12 + Math.floor(Math.random() * 14);

    const stop = () => {
      clearTimeout(timer);
      onPause();
      // Leave mode crossfades alone when the tab is hidden.
      stage.current?.getAnimations({ subtree: true }).filter(animation => animation.id === 'office-motion').forEach(animation => animation.cancel());
    };
    const type = () => {
      if (document.hidden) return;
      if (!turboRunning) onType();
      if (!reducedMotion.matches) {
        hands?.[strokes % 2]?.animate([
          { transform: 'translateY(0)' },
          { transform: 'translateY(.16%)', offset: .3 },
          { transform: 'translateY(0)' },
        ], { id: 'office-motion', duration: 150, easing: 'ease-out' });
        // Move the complete silhouette, anchored at the feet, without separating the torso.
        if (strokes % 4 === 0) body?.animate([
          { transform: 'scaleY(1) rotate(0deg)' },
          { transform: `scaleY(.997) rotate(${strokes % 8 ? '-' : ''}.1deg)` },
          { transform: 'scaleY(1) rotate(0deg)' },
        ], { id: 'office-motion', duration: 560, easing: 'ease-in-out' });
      }
      strokes++;
      const pause = strokes >= burstLength;
      if (pause) { strokes = 0; burstLength = 12 + Math.floor(Math.random() * 14); }
      timer = setTimeout(type, pause ? 900 + Math.random() * 1400 : 115 + Math.random() * 135);
    };
    const resume = () => { stop(); if (!document.hidden) timer = setTimeout(type, 400); };
    resume();
    document.addEventListener('visibilitychange', resume);
    reducedMotion.addEventListener('change', resume);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', resume);
      reducedMotion.removeEventListener('change', resume);
    };
  }, [ready, onType, onPause, typingPaused, turboRunning]);

  useEffect(() => {
    if (!turboRunning) return;
    let timer: ReturnType<typeof setTimeout>;
    // Turbo accelerates the audio independently of the hands and body.
    const type = () => {
      if (document.hidden) return;
      onType();
      timer = setTimeout(type, 55 + Math.random() * 40);
    };
    type();
    return () => clearTimeout(timer);
  }, [turboRunning, onType]);

  useEffect(() => {
    if (!ready || bodyReaction || vibing) return;
    const feet = stage.current?.querySelectorAll('.office-foot');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout>;
    const stop = () => {
      clearTimeout(timer);
      feet?.forEach(foot => foot.getAnimations().filter(animation => animation.id === 'office-foot-tap').forEach(animation => animation.cancel()));
    };
    const tap = () => {
      if (document.hidden || reducedMotion.matches) return;
      const duration = 280 + Math.random() * 140;
      const iterations = 2 + Math.floor(Math.random() * 3);
      const lift = .92 + Math.random() * .04;
      feet?.forEach(foot => foot.animate([
        { transform: 'scaleY(1)' },
        { transform: `scaleY(${lift})`, offset: .4 },
        { transform: 'scaleY(1)', offset: .8 },
        { transform: 'scaleY(1)' },
      ], { id: 'office-foot-tap', duration, iterations, easing: 'ease-in-out' }));
      timer = setTimeout(tap, duration * iterations + 4000 + Math.random() * 6000);
    };
    const resume = () => {
      stop();
      if (!document.hidden && !reducedMotion.matches) timer = setTimeout(tap, 1200 + Math.random() * 2800);
    };
    resume();
    document.addEventListener('visibilitychange', resume);
    reducedMotion.addEventListener('change', resume);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', resume);
      reducedMotion.removeEventListener('change', resume);
    };
  }, [ready, bodyReaction, vibing]);

  useEffect(() => {
    if (!ready || !musicPlaying) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let animations: Animation[] = [];
    const stop = () => {
      cancelAnimationFrame(frame);
      animations.forEach(animation => animation.cancel());
      animations = [];
    };
    const animate = (selector: string, keyframes: Keyframe[], id: string) => {
      stage.current?.querySelectorAll(selector).forEach(element => {
        const animation = element.animate(keyframes, { id, duration: 60000 / OFFICE_MUSIC_BEAT.bpm, iterations: Infinity, easing: 'ease-in-out' });
        animation.pause();
        animations.push(animation);
      });
    };
    const sync = () => {
      // Follow the audio clock, including pauses, loops, and returning from a reaction.
      const time = Math.max(0, (getMusicTime() - OFFICE_MUSIC_BEAT.offset) * 1000);
      animations.forEach(animation => { animation.currentTime = time; });
      frame = requestAnimationFrame(sync);
    };
    const resume = () => {
      stop();
      if (document.hidden || reducedMotion.matches) return;
      animate('.office-layer-sonos', [
        { transform: 'scale(1.014, .982)' },
        { transform: 'translateY(-.08%) scale(.997, 1.008)', offset: .22 },
        { transform: 'none', offset: .55 },
        { transform: 'none', offset: .85 },
        { transform: 'scale(1.014, .982)' },
      ], 'office-vibe-speaker');
      if (vibing) {
        animate('.office-face[data-face="smile"]', [
          { transform: 'translateY(.6%) rotate(-.5deg)' },
          { transform: 'translateY(-.1%) rotate(.5deg)', offset: .45 },
          { transform: 'translateY(.6%) rotate(-.5deg)' },
        ], 'office-vibe-head');
        animate('.office-foot', [
          { transform: 'scaleY(1)' },
          { transform: 'scaleY(.93)', offset: .45 },
          { transform: 'scaleY(1)' },
        ], 'office-vibe-foot');
      }
      sync();
    };
    resume();
    document.addEventListener('visibilitychange', resume);
    reducedMotion.addEventListener('change', resume);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', resume);
      reducedMotion.removeEventListener('change', resume);
    };
  }, [ready, musicPlaying, vibing, getMusicTime]);

  const toggleLamp = () => {
    finishReaction();
    setEmpty({ day: false, night: false });
    setWine('none');
    onSound('lamp');
    onToggleLamp();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const image = stage.current?.querySelector('.office-layer-lamp');
    image?.getAnimations().forEach(animation => animation.cancel());
    image?.animate([
      { transform: 'rotate(0deg)' }, { transform: 'rotate(-3deg)' },
      { transform: 'rotate(2deg)' }, { transform: 'rotate(-1deg)' },
      { transform: 'rotate(0deg)' },
    ], { id: 'office-motion', duration: 450, easing: 'ease-out' });
  };

  return (
    <div ref={stage} className="office-stage" data-renderer="layers" data-ready={ready} data-expression={reaction === 'phone' ? 'angry' : reaction === 'drink' && phase === 'sip' ? 'sip' : visibleExpression} data-reaction={reaction} data-phase={phase} data-cup={empty[mode] ? 'empty' : 'full'} data-pop={popping || undefined} data-looking={lookingAtBottle || undefined} data-music={musicPlaying} data-vibing={vibing}>
      <div className="office-visual" role="img" aria-label={`Wouter typing in his home office ${isDark ? 'at night, lit by a warm table lamp' : 'in daylight'}, behind a curved monitor on an oak desk.`}>
        {OFFICE_LAYERS.map((layer, index) => (
          <div key={layer.id} className={`office-layer-group office-layer-${layer.id}`} data-layer={layer.id} style={{ zIndex: index * 2, visibility: ready ? 'visible' : 'hidden', transformOrigin: layer.id === 'sonos' ? `${(layer.x + layer.width / 2) / 1536 * 100}% ${(layer.y + layer.height) / 1024 * 100}%` : undefined }}>
            {(['day', 'night'] as const).map(mode => (
              <Image
                key={mode}
                src={`/images/office/scene/${mode === 'night' ? 'night/' : ''}${layer.id}.webp?v=${layer.id === 'character' ? 13 : layer.id === 'room' ? 18 : layer.id === 'sonos' || layer.id === 'mac-studio' ? 17 : 11}`}
                alt=""
                aria-hidden="true"
                width={1536}
                height={1024}
                priority
                unoptimized
                className={`office-layer office-base-layer office-mode-layer office-mode-${mode}`}
                style={{ ...officeLayerStyle(layer, mode === 'night'), clipPath: layer.id === 'character' ? `polygon(0 ${bodyReaction ? 52 : visibleExpression === 'neutral' ? 0 : 28}%, 100% ${bodyReaction ? 52 : visibleExpression === 'neutral' ? 0 : 28}%, 100% ${LEG_SEAM}%, 0 ${LEG_SEAM}%)` : undefined, visibility: layer.id === 'phone' && reaction === 'phone' || layer.id === 'mug' && (empty[mode] || wine !== 'none' && !popping) || layer.id === 'wine' && wine !== 'full' ? 'hidden' : undefined }}
                onLoad={() => { loaded.current.add(`${mode}-${layer.id}`); if (loaded.current.size === OFFICE_LAYERS.length * 2) setReady(true); }}
              />
            ))}
            {layer.id === 'mac-studio' && <span className="office-mac-led" aria-hidden="true" style={{ left: `${(macStudio.x + macStudio.width * .75) / 1536 * 100}%`, top: `${(macStudio.y + macStudio.height * .75) / 1024 * 100}%` }} />}
            {(layer.id === 'phone' || layer.id === 'mug' || layer.id === 'wine') && (['day', 'night'] as const).map(mode => {
              const variant = layer.id === 'phone' ? 'phone-lit' : `${layer.id}-empty`;
              const shown = layer.id === 'phone' ? reaction === 'phone' : layer.id === 'mug' ? empty[mode] && (wine === 'none' || popping) : wine === 'empty';
              return <Image
                key={`${mode}-${variant}`}
                src={`/images/office/scene/interactions/${mode}-${variant}.webp`}
                alt="" aria-hidden="true" width={1536} height={1024} unoptimized loading="eager"
                className={`office-layer office-mode-layer office-mode-${mode}`}
                style={{ ...officeLayerStyle(layer, mode === 'night'), visibility: ready && shown ? 'visible' : 'hidden' }}
                onLoad={() => { interactionLoads.current.add(`${mode}-${variant}`); if (interactionLoads.current.size === 10) setInteractionsReady(true); }}
              />;
            })}
            {layer.id === 'character' && <div className="office-layer-group office-reaction-body" style={{ visibility: ready && bodyReaction ? 'visible' : 'hidden' }}>
              {(['day', 'night'] as const).map(mode => <div key={mode} className={`office-layer-group office-mode-layer office-mode-${mode}`}>
                {['neutral', 'angry', 'sip'].map(pose => <Image
                  key={pose}
                  src={pose === 'neutral' ? `/images/office/scene/${mode === 'night' ? 'night/' : ''}character.webp?v=13` : `/images/office/scene/interactions/${mode}-${pose}.webp`}
                  alt="" aria-hidden="true" width={1536} height={1024} unoptimized loading="eager"
                  className="office-layer"
                  data-pose={pose}
                  style={{ ...officeLayerStyle(character, mode === 'night'), clipPath: 'inset(0 0 48% 0)', visibility: ready && bodyReaction && pose === (reaction === 'phone' ? 'angry' : phase === 'sip' ? 'sip' : 'neutral') ? 'visible' : 'hidden' }}
                  onLoad={() => { if (pose !== 'neutral') interactionLoads.current.add(`${mode}-${pose}`); if (interactionLoads.current.size === 10) setInteractionsReady(true); }}
                />)}
              </div>)}
            </div>}
            {layer.id === 'character' && <div className="office-layer-group office-legs" style={{ transform: `scale(${LEG_SCALE})`, transformOrigin: legsOrigin }}>
              {(['day', 'night'] as const).map(mode => (
                <Image
                  key={`legs-${mode}`}
                  src={`/images/office/scene/${mode === 'night' ? 'night/' : ''}character.webp?v=13`}
                  alt=""
                  aria-hidden="true"
                  width={1536}
                  height={1024}
                  unoptimized
                  loading="eager"
                  className={`office-layer office-mode-layer office-mode-${mode}`}
                  style={{ ...officeLayerStyle(character, mode === 'night'), clipPath: `polygon(0 ${LEG_SEAM}%, 100% ${LEG_SEAM}%, 100% 100%, 50% 100%, 50% 80%, 0 80%)` }}
                />
              ))}
              {(['day', 'night'] as const).map(mode => (
                <Image
                  key={`foot-${mode}`}
                  src={`/images/office/scene/${mode === 'night' ? 'night/' : ''}character.webp?v=13`}
                  alt=""
                  aria-hidden="true"
                  width={1536}
                  height={1024}
                  unoptimized
                  loading="eager"
                  className={`office-layer office-foot office-mode-layer office-mode-${mode}`}
                  // Split below the right cuff (screen left); scaling at the seam keeps the ankle attached.
                  style={{ ...officeLayerStyle(character, mode === 'night'), clipPath: 'inset(80% 50% 0 0)', transformOrigin: '50% 80%' }}
                />
              ))}
            </div>}
            {layer.id === 'character' && (['day', 'night'] as const).map(mode => (
              <div key={`faces-${mode}`} className={`office-layer-group office-mode-layer office-mode-${mode}`}>
                {faces.map(face => (
                  <Image
                    key={face}
                    src={`/images/office/scene/expressions/${mode}-${face}.webp`}
                    alt=""
                    aria-hidden="true"
                    width={1536}
                    height={1024}
                    unoptimized
                    loading="eager"
                    className="office-layer office-face"
                    data-face={face}
                    style={{ ...officeLayerStyle(character, mode === 'night'), clipPath: 'inset(0 0 72% 0)', visibility: ready && (!bodyReaction || phase === 'return') && visibleExpression === face ? 'visible' : 'hidden' }}
                    onLoad={() => { faceLoads.current.add(`${mode}-${face}`); if (faceLoads.current.size === faces.length * 2) setFacesReady(true); }}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
        {handPoints.map((_, index) => (
          <div key={index} className="office-layer-group office-hand" style={{ zIndex: 9, visibility: ready && !bodyReaction ? 'visible' : 'hidden' }}>
            {(['day', 'night'] as const).map(mode => {
              const style = officeLayerStyle(character, mode === 'night');
              return <Image
                key={mode}
                src={`/images/office/scene/${mode === 'night' ? 'night/' : ''}character.webp?v=13`}
                alt=""
                aria-hidden="true"
                width={1536}
                height={1024}
                unoptimized
                className={`office-layer office-mode-layer office-mode-${mode}`}
                style={{ ...style, top: `calc(${style.top} - ${6 / 1024 * 100}%)`, clipPath: handClip(index, mode === 'night') }}
              />;
            })}
          </div>
        ))}
      </div>
      <div
        className="office-monitor-stickers"
        style={{ left: `${monitor.x / 1536 * 100}%`, top: `${monitor.y / 1024 * 100}%`, width: `${monitor.width / 1536 * 100}%`, height: `${monitor.height / 1024 * 100}%`, visibility: ready ? 'visible' : 'hidden' }}
      >
        {stickers.filter(({ id }) => !removed.includes(id)).map(sticker => {
          const { id, label, href, art, paper, tilt, shape, left, top, viewBox = '0 0 100 100', sheen = true } = sticker;
          return <a key={id} {...href ? { href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': label } : { 'aria-hidden': true }} className={`office-sticker office-sticker-${id}`} data-sticker={id} style={{ left, top }}
            draggable={false}
            onPointerDown={startPeel}
            onPointerMove={event => movePeel(event, sticker)}
            onPointerLeave={event => { if (!peel.current) settlePeel(event.currentTarget); }}
            onPointerUp={event => endPeel(event, id)}
            onPointerCancel={event => endPeel(event, id)}
            onClick={event => { if (peeledClick.current) { peeledClick.current = false; event.preventDefault(); } }}
          >
            {/* Keyed by lighting: Safari keeps painting a stale filter on these 3D-transformed decals otherwise. */}
            <svg key={isDark && nightLight[id] ? 'night' : 'day'} className="office-sticker-decal" viewBox={viewBox} aria-hidden="true">
              <defs>
                <linearGradient id={`${id}-surface`} x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#26354b" stopOpacity=".24" />
                  <stop offset=".55" stopColor="#fff8e6" stopOpacity=".03" />
                  <stop offset="1" stopColor="#fff8e6" stopOpacity=".2" />
                </linearGradient>
                <rect id={`${id}-shape`} x={50 - shape.width / 2} y={50 - shape.height / 2} width={shape.width} height={shape.height} rx={shape.radius} transform={`rotate(${tilt} 50 50)`} />
                <g id={`${id}-artwork`}>
                  <use href={`#${id}-shape`} fill={paper} />
                  <g transform={`rotate(${tilt} 50 50)`}>{art}</g>
                  {sheen && <use href={`#${id}-shape`} fill={`url(#${id}-surface)`} />}
                </g>
                {nightLight[id] && <filter id={`${id}-night`} filterUnits="userSpaceOnUse" x="-150" y="-150" width="400" height="400" colorInterpolationFilters="sRGB">
                  <feColorMatrix values={nightLight[id]} />
                </filter>}
                {/* Everything past the fold line (at --peel along --peel-angle) is mirrored back as the flap. */}
                <mask id={`${id}-peel`} maskUnits="userSpaceOnUse" x="-150" y="-150" width="400" height="400">
                  <g className="office-peel-frame"><rect className="office-peel-edge" x="-200" y="-100" width="200" height="200" fill="#fff" /></g>
                </mask>
                {id === 'github' && <>
                  {/* Creases follow the monitor's ridge edges, measured from the day/night monitor.webp in this (pre-perspective) viewBox. */}
                  <clipPath id="github-above-ridge"><path d="M0 0H100V62.27L0 59.91Z" /></clipPath>
                  <clipPath id="github-on-ridge"><path d="M0 59.91L100 62.27V79.02L0 71.23Z" /></clipPath>
                  <clipPath id="github-below-ridge"><path d="M0 71.23L100 79.02V100H0Z" /></clipPath>
                  <g id="github-folded">
                    <use href="#github-artwork" clipPath="url(#github-above-ridge)" />
                    {/* Foreshorten the ridge face and the lower face, keeping both seams joined. */}
                    <g clipPath="url(#github-on-ridge)"><use href="#github-artwork" transform="matrix(1 .00708 0 .7 0 17.973)" /></g>
                    <g clipPath="url(#github-below-ridge)"><use href="#github-artwork" transform="matrix(1 -.00506 0 .82 0 8.844)" /></g>
                  </g>
                  <mask id="github-folded-shape" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100" style={{ maskType: 'alpha' }}>
                    <use href="#github-folded" />
                  </mask>
                </>}
              </defs>
              <g filter={isDark && nightLight[id] ? `url(#${id}-night)` : undefined}><g mask={`url(#${id}-peel)`} pointerEvents="visiblePainted">
                {id === 'github' ? <>
                  <use href="#github-folded" />
                  <g mask="url(#github-folded-shape)">
                    <path d="M0 59.91L100 62.27V79.02L0 71.23Z" fill="#fff" fillOpacity=".16" />
                    <path d="M0 59.91L100 62.27" stroke="#fff" strokeOpacity=".6" strokeWidth=".8" />
                    <path d="M0 71.23L100 79.02" stroke="#344052" strokeOpacity=".12" strokeWidth="3" />
                    <path d="M0 71.23L100 79.02" stroke="#344052" strokeOpacity=".3" strokeWidth=".7" />
                  </g>
                </> : <use href={`#${id}-artwork`} />}
                {/* The fold-back flap waits, masked away, beside the sticker. Browsers hit-test through masks,
                    so it must not catch the pointer over a neighbour; drags capture the pointer anyway. */}
                <g className="office-peel-frame" pointerEvents="none">
                  <g className="office-peel-flap">
                    <use href={`#${id}-shape`} className="office-peel-back" fill="#ebe5d6" />
                  </g>
                </g>
              </g></g>
            </svg>
            {href && <span className="office-hint" aria-hidden="true">{label}</span>}
          </a>;
        })}
      </div>
      <button
        type="button"
        className="office-object-button office-mac-studio-button"
        style={{ left: `${(macStudio.x + macStudio.width / 2) / 1536 * 100}%`, top: `${(macStudio.y + macStudio.height / 2) / 1024 * 100}%`, width: `${macStudio.width / 1536 * 100}%`, height: `${macStudio.height / 1024 * 100}%` }}
        aria-label="Mac Studio turbo mode"
        aria-pressed={reaction === 'turbo'}
        aria-disabled={!ready || !interactionsReady || !facesReady || (reacting && !turboRunning)}
        onClick={() => react('turbo')}
      ><span className="office-hint" aria-hidden="true">{reaction === 'turbo' ? phase === 'success' ? 'Done!' : expression === 'side-eye' ? 'Working on it...' : 'Turbo mode...' : 'Turbo mode'}</span></button>
      <button
        type="button"
        className="office-object-button office-sonos-button"
        style={{ left: `${(sonos.x + sonos.width / 2) / 1536 * 100}%`, top: `${(sonos.y + sonos.height / 2) / 1024 * 100}%`, width: `${sonos.width / 1536 * 100}%`, height: `${sonos.height / 1024 * 100}%` }}
        aria-label="Vibecode"
        aria-pressed={musicPlaying}
        disabled={!ready || !facesReady}
        onClick={onToggleMusic}
      ><span className="office-hint" aria-hidden="true">Vibecode</span></button>
      {[phone, wine === 'none' ? mug : wineBottle].map(object => <button
        key={object.id}
        type="button"
        className={`office-object-button office-${object.id}-button`}
        style={{ left: `${(object.x + object.width / 2) / 1536 * 100}%`, top: `${(object.y + object.height / 2) / 1024 * 100}%`, width: `${object.width / 1536 * 100}%`, height: `${object.height / 1024 * 100}%` }}
        aria-label={object.id === 'phone' ? 'Ping the phone' : wine === 'empty' ? 'The wine bottle is empty' : wine === 'full' ? 'Drink the red wine' : empty[mode] ? `${isDark ? 'Tea' : 'Coffee'} cup is empty` : `Drink the ${isDark ? 'tea' : 'coffee'}`}
        aria-disabled={!ready || !interactionsReady || !facesReady || reacting || (object.id === 'mug' && empty[mode]) || (object.id === 'wine' && wine === 'empty')}
        onClick={() => react(object.id === 'phone' ? 'phone' : 'drink')}
      ><span className="office-hint" aria-hidden="true">{object.id === 'phone' ? 'Ping!' : reaction === 'drink' ? 'Sip...' : (wine === 'none' ? empty[mode] : wine === 'empty') ? 'All gone' : 'Take a sip'}</span></button>)}
      <span className="sr-only" role="status">{reaction === 'turbo' ? phase === 'success' ? 'Build succeeded. Wouter smiles.' : expression === 'side-eye' ? 'Working on it! Wouter gives an annoyed sideways glance.' : 'Turbo mode. The Mac fans spin up, the keys chatter faster, and Wouter squints at the screen.' : reaction === 'phone' ? 'New notification. Wouter growls at the interruption.' : reaction === 'drink' ? `Wouter takes a sip of ${wine === 'none' ? isDark ? 'tea' : 'coffee' : 'red wine'}.` : wine === 'empty' ? 'The wine bottle is empty.' : wine === 'full' ? 'Pop! A bottle of 6wines red appears on the desk.' : empty[mode] ? `The ${isDark ? 'tea' : 'coffee'} cup is empty.` : ''}</span>
      <button
        type="button"
        className="office-lamp-switch"
        style={{ left: `${lamp.x / 1536 * 100}%`, top: `${lamp.y / 1024 * 100}%`, width: `${lamp.width / 1536 * 100}%`, height: `${lamp.height / 1024 * 100}%` }}
        aria-label={isDark ? 'Turn lamp off — daylight' : 'Turn lamp on — nighttime'}
        aria-pressed={isDark}
        disabled={!ready}
        onClick={toggleLamp}
      >
        <span className="office-hint">{isDark ? 'Lights off' : 'Lights on'}</span>
      </button>
    </div>
  );
}
