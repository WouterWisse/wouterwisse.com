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
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Language | TypeScript 5 |
| AI Images | Replicate (Flux) |
| Analytics | Vercel Analytics & Speed Insights |
| Deployment | Vercel |

## Features

- **Seasonal Themes**: 12 unique monthly themes with AI-generated illustrations
- **Daily/Weekly Images**: Fresh images generated weekly with automatic fallback system
- **Light/Dark Mode**: Seamless theme switching with system preference sync
- **Dynamic Colors**: Auto-extracted color palettes from theme images
- **Interactive Navigation**:
  - Swipe gestures for month navigation (mobile)
  - Keyboard arrow keys for desktop
- **Work Mode**: Secret project sneak peek (click the Work button to discover)
- **Smooth Animations**: Framer Motion for fluid transitions
- **Performance**:
  - Blur placeholders for progressive image loading
  - Vercel Analytics and Speed Insights integration
- **Responsive Design**: Optimized for all screen sizes

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm run start

# Build for production
npm run build

# Lint code
npm run lint

# Clean build cache
npm run clean
```

### Image Generation Scripts

```bash
# Generate all monthly theme images
npm run generate-images

# Generate weekly images for current week
npm run generate:daily

# Generate blur placeholders for images
npm run generate-blur-placeholders

# Extract and generate theme colors from images
npm run generate-theme-colors

# Generate work mode images
# (See scripts/generate-work-images.ts)
```

## Documentation

- [Weekly Image Generation](docs/WEEKLY_IMAGES.md) - Automated hero image generation with GitHub Actions

## Deployment

This site is deployed on [Vercel](https://vercel.com) with automatic deployments on push to the `develop` branch.

To deploy your own:
1. Fork this repository
2. Import to Vercel
3. Add your custom domain in Vercel dashboard

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with Analytics
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── Hero.tsx             # Main hero component with themes
│   ├── SocialLinks.tsx      # Social media links
│   └── ThemeToggle.tsx      # Light/dark mode toggle
├── config/
│   ├── themes.ts            # Monthly theme definitions
│   ├── blur-placeholders.ts # Generated blur data
│   ├── extracted-colors.ts  # Generated theme colors
│   ├── work.ts              # Work mode configuration
│   └── prompts.ts           # AI image generation prompts
├── hooks/
│   └── useCurrentMonth.ts   # Month navigation logic
│   └── useThemeMode.ts      # Theme mode state
└── types/
    └── theme.ts             # TypeScript type definitions

public/
└── images/
    └── themes/              # Monthly theme images
        ├── january/         # Light & dark variants
        ├── february/        # Each contains: light.png, dark.png
        └── ...              # Plus dated images: YYYY-MM-DD-light.png

scripts/
├── generate-images.ts           # Generate all monthly images
├── generate-daily-images.ts     # Generate weekly images
├── generate-blur-placeholders.ts # Generate blur data
├── generate-theme-colors.ts     # Extract theme colors
└── generate-work-images.ts      # Generate work mode images

docs/                        # Additional documentation
└── WEEKLY_IMAGES.md

.github/
├── assets/                  # README hero images
└── workflows/               # GitHub Actions (weekly-images.yml)
```

## Theme Customization

Each month has unique light and dark themes with:
- Custom AI-generated illustrations
- Unique taglines that reflect the season and coding lifestyle
- Auto-extracted color palettes for cohesive design
- Weekly image variants for fresh content

To customize themes:
1. Update prompts in `src/config/prompts.ts`
2. Run `npm run generate-images` to create new images
3. Run `npm run generate-blur-placeholders` to generate blur data
4. Run `npm run generate-theme-colors` to extract color palettes

## License

This project is open source and available under the MIT License.
