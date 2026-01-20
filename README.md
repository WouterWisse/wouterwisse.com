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
| Language | TypeScript |
| Analytics | Vercel Analytics & Speed Insights |
| Deployment | Vercel |

## Features

### Themes & Visuals
- Seasonal themes that automatically change each month
- Weekly refreshed AI-generated illustrations with thematic variations
- Light/dark mode with system preference sync
- Smooth transitions and animations powered by Framer Motion
- Blur placeholders for smooth image loading
- Work mode: Secret project sneak peek with special illustrations

### Navigation
- Swipe gestures for month navigation (mobile)
- Keyboard navigation with arrow keys
- Month indicator with navigation controls

### Performance & Analytics
- Vercel Speed Insights for real-time performance monitoring
- Vercel Analytics for visitor tracking
- Optimized images with Next.js Image component
- Responsive design optimized for all devices

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Generate blur placeholders (after adding new images)
npm run generate-blur-placeholders

# Generate weekly images (automated via GitHub Actions)
npm run generate:daily

# Generate theme colors
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
│   ├── Hero.tsx   # Main hero component with theme switching
│   └── ...
├── config/        # Theme & feature configuration
│   ├── themes.ts  # Monthly theme definitions
│   └── work.ts    # Work mode configuration
├── hooks/         # Custom React hooks
└── types/         # TypeScript definitions

public/
└── images/
    ├── themes/    # Monthly theme images
    │   └── [month]/
    │       ├── light.png          # Default monthly image
    │       ├── dark.png           # Default monthly image
    │       ├── YYYY-MM-DD-light.png  # Weekly variant
    │       └── YYYY-MM-DD-dark.png   # Weekly variant
    └── work/      # Work mode images (light/dark)

scripts/           # Image generation utilities
└── .claude/       # Claude Code skills for automation
```
