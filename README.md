<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/hero-dark.png">
    <img src=".github/assets/hero-light.png" alt="Wouter Wisse" width="400">
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

- **Seasonal themes** - 12 unique monthly themes with custom illustrations
- **Light/dark mode** - System preference sync with manual toggle
- **AI-generated art** - Weekly hero images generated via Replicate
- **Parallax effects** - Mouse and device orientation responsive
- **Swipe navigation** - Browse months with touch gestures on mobile
- **Keyboard navigation** - Arrow keys to explore themes
- **Blur placeholders** - Smooth progressive image loading
- **Responsive design** - Optimized for all screen sizes

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run generate:daily` | Generate daily hero images using AI |
| `npm run generate-blur-placeholders` | Create blur placeholders for images |
| `npm run generate-theme-colors` | Extract colors from theme images |
| `npm run generate-images` | Generate all theme images |

## Deployment

Deployed on [Vercel](https://vercel.com) with automatic deployments on push to `develop`.

To deploy your own:
1. Fork this repository
2. Import to Vercel
3. Add `REPLICATE_API_TOKEN` secret for weekly image generation
4. Add your custom domain in Vercel dashboard

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components (Hero, ThemeToggle, SocialLinks)
├── config/        # Theme configuration and extracted colors
├── hooks/         # Custom hooks (parallax, orientation, theme)
└── types/         # TypeScript definitions

public/images/
└── themes/        # Monthly theme images (12 months × light/dark)

scripts/           # Image generation and processing utilities

docs/              # Documentation (weekly image generation)
```

## Weekly Image Generation

A GitHub Actions workflow generates fresh hero images every week using Replicate's AI. See [docs/WEEKLY_IMAGES.md](docs/WEEKLY_IMAGES.md) for setup and configuration.

## License

MIT
