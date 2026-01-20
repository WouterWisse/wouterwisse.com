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
| Analytics | Vercel Analytics, Vercel Speed Insights |
| Sun Position | suncalc |
| Image Processing | sharp |
| AI Generation | Replicate (FLUX models) |
| Deployment | Vercel |

## Features

- **Seasonal themes** - 12 unique monthly themes with 24 custom taglines and AI-generated images
- **Work Mode** - Secret briefcase button for project sneak peek
- **Sun-based theme switching** - Auto light/dark mode based on actual sunrise/sunset times
- **Parallax effects** - Mouse tracking and device orientation animations
- **Reduced motion support** - Accessibility-friendly with system preference detection
- **Dynamic browser theme-color** - Meta tag updates to match current theme
- **Daily AI image generation** - Automatic image generation with fallback system
- **Light/dark mode** - System preference sync
- **Swipe gestures** - Month navigation on mobile
- **Keyboard navigation** - Arrow key support
- **Blur placeholders** - Smooth image loading transitions
- **Responsive design** - Optimized for mobile

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Clean build cache
npm run clean

# Generate blur placeholders (after adding new images)
npm run generate-blur-placeholders
```

### Image Generation Scripts

```bash
# Generate all theme images using Replicate AI
npm run generate-images

# Generate daily image for current month
npm run generate:daily

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
├── app/           # Next.js App Router
├── components/    # React components
├── config/
│   ├── themes.ts            # Theme configuration
│   ├── work.ts              # Work mode configuration (images, taglines)
│   ├── extracted-colors.ts  # Auto-generated theme colors from images
│   ├── prompts.ts           # AI prompts for generating monthly theme images
│   └── blur-placeholders.ts # Base64 blur placeholder data
├── hooks/         # Custom React hooks
└── types/         # TypeScript definitions

public/
└── images/
    └── themes/    # Monthly theme images (light/dark)

scripts/           # Image generation utilities
```
