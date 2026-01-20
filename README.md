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
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Language | TypeScript 5 |
| Key Libraries | SunCalc (sun position), Sharp (image processing) |
| AI Generation | Replicate API (Flux model) |
| Analytics | Vercel Analytics, Vercel Speed Insights |
| Deployment | Vercel |

## Features

### Visual & Theming
- **12 Seasonal Themes**: Unique AI-generated illustrations for each month with custom taglines
- **Daily Image Rotation**: Images change daily with graceful fallback to monthly defaults
- **Dynamic Color Extraction**: Auto-extracted accent colors from theme images for cohesive design
- **Light/Dark Mode**:
  - Manual toggle with system preference sync
  - Automatic theme switching based on sun position (using your location)
  - Browser UI theme color synchronization
- **Smooth Animations**: 18+ custom animations including gradient shifts, parallax, and transitions
- **Blur Placeholders**: Pre-generated blur data for smooth, progressive image loading

### Navigation & Interaction
- **Month Navigation**: Browse all 12 seasonal themes
  - Swipe gestures (mobile-optimized with 50px threshold)
  - Keyboard controls (arrow keys)
  - Visual navigation buttons with direction indicators
- **Work Mode**: Click the briefcase icon to reveal a secret project sneak peek (10-second preview)

### Advanced Effects
- **Mouse Parallax**: Subtle depth effects that follow cursor movement (desktop)
- **Device Orientation**: Tilt-based parallax effects on supported mobile devices
- **Sun Position Tracking**: Uses geolocation and SunCalc to determine optimal theme based on actual sunrise/sunset times

### Accessibility & Performance
- **Reduced Motion Support**: Respects system accessibility preferences
- **Responsive Design**: Mobile-first with optimized breakpoints (768px, 1024px)
- **Viewport Units**: Dynamic viewport height (dvh) for consistent mobile experience
- **Performance Monitoring**: Integrated Vercel Analytics and Speed Insights

## Development

```bash
# Install dependencies
npm install

# Start development server (with clean build)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Image Generation Scripts

```bash
# Generate blur placeholders for all theme images
npm run generate-blur-placeholders

# Extract theme colors from images
npm run generate-theme-colors

# Generate daily images for current week
npm run generate:daily

# Generate all theme images (requires Replicate API key)
npm run generate-images
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
├── config/        # Theme configuration
├── hooks/         # Custom React hooks
└── types/         # TypeScript definitions

public/
└── images/
    └── themes/    # Monthly theme images (light/dark)

scripts/           # Image generation utilities
```
