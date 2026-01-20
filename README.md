<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/hero-dark.png">
    <img src=".github/assets/hero-light.png" alt="Wouter Wisse" width="400">
  </picture>
  <br>
  <br>
  <picture>
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" height="28">
  </picture>
  <br>
  <br>
  <em>My personal website with seasonal themes that change throughout the year.</em>
  <br>
  <br>
  <a href="https://wouterwisse.com">wouterwisse.com</a>
  <br>
  <br>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" alt="Next.js 16"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white" alt="Vercel"></a>
</div>

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| Animation | Framer Motion |
| Analytics | Vercel Analytics & Speed Insights |
| Fonts | Geist Sans & Geist Mono |
| Image Processing | Sharp |
| Deployment | Vercel |

## Features

### Core Features
- **Seasonal themes** - 12 unique monthly themes with AI-generated illustrations
- **Daily image variations** - Weekly-generated images with automatic fallback to monthly themes
- **Light/dark mode** - System preference sync with smooth 700ms transitions
- **Work mode preview** - Secret project sneak peek with temporary overlay
- **Responsive design** - Optimized for mobile and desktop with dynamic viewport height

### Navigation
- **Swipe gestures** - Touch-based month navigation on mobile
- **Keyboard controls** - Arrow keys for desktop navigation
- **Month indicators** - Visual navigation with chevron buttons

### Performance & UX
- **Blur placeholders** - Smooth image loading with pre-generated data URLs
- **Dynamic theme colors** - Extracted color palettes per month and mode
- **Meta theme-color sync** - Updates browser UI (address bar/status bar) on mode change
- **Framer Motion animations** - Smooth slide transitions and pan gestures
- **Geolocation-based sunrise/sunset** - Uses SunCalc for location-aware daylight detection
- **Reduced motion support** - Respects user accessibility preferences
- **Device orientation** - Tilt-based parallax effects on mobile devices
- **Mouse parallax** - Subtle cursor-based animations on desktop

## Development

```bash
# Install dependencies
npm install

# Start development server (cleans .next first)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Clean build artifacts
npm run clean
```

### Image Generation Scripts

```bash
# Generate AI images for all months
npm run generate-images

# Generate weekly images (automated via workflow)
npm run generate:daily

# Generate blur placeholders (after adding new images)
npm run generate-blur-placeholders

# Extract theme colors from images
npm run generate-theme-colors
```

## Deployment

This site is deployed on [Vercel](https://vercel.com) with automatic deployments on push to the `develop` branch.

To deploy your own:
1. Fork this repository
2. Import to Vercel
3. Add your custom domain in Vercel dashboard

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with Analytics & Speed Insights
│   ├── page.tsx               # Home page with Hero component
│   └── globals.css            # Global styles and CSS variables
├── components/                 # React components
│   ├── Hero.tsx               # Main hero with images, navigation, and work mode
│   ├── SocialLinks.tsx        # Social media links
│   └── ThemeToggle.tsx        # Light/dark mode toggle
├── config/                     # Configuration files
│   ├── themes.ts              # Monthly theme definitions and image paths
│   ├── blur-placeholders.ts   # Pre-generated blur data URLs
│   ├── extracted-colors.ts    # Dynamic color palettes per theme
│   ├── work.ts                # Work mode configuration
│   └── prompts.ts             # AI image generation prompts
├── hooks/                      # Custom React hooks
│   ├── useCurrentMonth.ts     # Month state and navigation logic
│   ├── useThemeMode.ts        # Light/dark mode with system sync
│   ├── useSunPosition.ts      # Geolocation-based sunrise/sunset
│   ├── useMouseParallax.ts    # Mouse-based parallax effects
│   ├── useDeviceOrientation.ts # Tilt-based mobile parallax
│   └── useReducedMotion.ts    # Accessibility motion preferences
└── types/                      # TypeScript definitions
    └── theme.ts               # Theme and mode type definitions

public/
└── images/
    ├── themes/                # Monthly theme images (light/dark)
    ├── daily/                 # Weekly-generated image variations
    └── work/                  # Work mode preview images

scripts/                        # Image generation utilities
├── generate-images.ts         # AI-based monthly image generation
├── generate-daily-images.ts   # Weekly variation generation
├── generate-blur-placeholders.ts # Blur placeholder generation
├── generate-theme-colors.ts   # Color extraction from images
├── generate-favicon.ts        # Favicon generation
├── generate-reference.ts      # Reference image generation
├── generate-work-images.ts    # Work mode image generation
└── dev.sh                     # Development helper script
```
