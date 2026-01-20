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
| Deployment | Vercel |

## Features

### Core Experience
- **12 Seasonal Themes** - Monthly themes with unique AI-generated illustrations and witty taglines
- **Daily Image Variations** - Weekly refreshed images with topical visual props (news, events, trends)
- **Light/Dark Mode** - Manual toggle with system preference sync and sun position awareness
- **Work Mode** - Secret project sneak peek with timed reveal (10s display)

### Navigation & Interaction
- **Keyboard Navigation** - Arrow keys to browse through months
- **Swipe Gestures** - Touch-friendly month navigation on mobile
- **Mouse Parallax** - Subtle depth effect following cursor movement
- **Smooth Animations** - Framer Motion powered transitions and interactions

### Performance & UX
- **Blur Placeholders** - Progressive image loading with auto-generated blur data URLs
- **Auto-extracted Theme Colors** - Dynamic color palettes from theme images
- **Responsive Design** - Mobile-first approach with device orientation support
- **Reduced Motion Support** - Respects user accessibility preferences

### Analytics & Monitoring
- **Vercel Analytics** - Real-time traffic and page insights
- **Speed Insights** - Core Web Vitals monitoring

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Image Generation Scripts

The project includes several scripts for generating and optimizing theme images using AI:

```bash
# Generate all monthly theme images (light + dark)
npm run generate-images

# Generate daily/weekly variations with topical props
npm run generate:daily

# Generate work mode images
npm run generate-work-images

# Generate blur placeholders for all images
npm run generate-blur-placeholders

# Extract and generate theme colors from images
npm run generate-theme-colors
```

**Note:** Image generation requires a `REPLICATE_API_TOKEN` environment variable.

## Environment Variables

```bash
# Required for AI image generation scripts only
REPLICATE_API_TOKEN=your_token_here
```

Image generation scripts use [Replicate](https://replicate.com) to generate theme illustrations via FLUX.1 models. This is only needed for generating new images, not for running the site.

## Technical Highlights

### AI-Powered Design System
- **Consistent Character Design** - All 24+ illustrations maintain visual consistency through detailed prompts
- **Monthly Themes** - Each month has light mode (active/multitasking) and dark mode (relaxed/crashed) variants
- **Dynamic Props** - Weekly image updates include topical visual elements based on current events
- **Pixar-style 3D Renders** - High-quality AI-generated illustrations with professional aesthetics

### Smart Theme Management
- **Geolocation-based Defaults** - Uses `suncalc` and browser geolocation to set initial light/dark mode
- **Automatic Color Extraction** - Theme colors are extracted from images using Sharp image processing
- **Optimized Loading** - Blur placeholders generated at build time for instant perceived load
- **Fallback Strategy** - Daily images gracefully fall back to monthly defaults if unavailable

### Performance Optimizations
- **App Router** - Leverages Next.js 16 App Router for optimal performance
- **Client Components** - Strategic use of client-side rendering for interactive features
- **Image Optimization** - Next.js Image component with blur placeholders
- **Motion Preferences** - Respects `prefers-reduced-motion` for accessibility

## Deployment

This site is deployed on [Vercel](https://vercel.com) with automatic deployments on push to the `develop` branch.

**Deployment Features:**
- Zero-config deployment
- Automatic HTTPS
- Edge network CDN
- Analytics and Speed Insights included
- Preview deployments for pull requests

To deploy your own:
1. Fork this repository
2. Import to Vercel
3. Add your custom domain in Vercel dashboard
4. (Optional) Add `REPLICATE_API_TOKEN` if you want to generate custom images

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with analytics
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── Hero.tsx                 # Main hero component with theme display
│   ├── SocialLinks.tsx          # Social media links
│   └── ThemeToggle.tsx          # Light/dark mode toggle
├── config/                       # Configuration files
│   ├── themes.ts                # Monthly theme definitions and taglines
│   ├── prompts.ts               # AI image generation prompts
│   ├── work.ts                  # Work mode configuration
│   ├── blur-placeholders.ts     # Auto-generated blur data URLs
│   └── extracted-colors.ts      # Auto-generated theme colors
├── hooks/                        # Custom React hooks
│   ├── useCurrentMonth.ts       # Month navigation logic
│   ├── useThemeMode.ts          # Light/dark mode management
│   ├── useSunPosition.ts        # Geolocation-based day/night detection
│   ├── useMouseParallax.ts      # Mouse-based parallax effects
│   ├── useReducedMotion.ts      # Accessibility preference detection
│   └── useDeviceOrientation.ts  # Mobile orientation handling
└── types/                        # TypeScript definitions
    └── theme.ts                 # Theme and color type definitions

public/
└── images/
    ├── themes/                  # Monthly theme images
    │   ├── january/            # Light + dark + daily variations
    │   ├── february/           # (Pattern repeats for all 12 months)
    │   └── ...
    └── work/                    # Work mode images
        ├── light.png
        └── dark.png

scripts/                          # Automation utilities
├── generate-images.ts           # Generate monthly theme images
├── generate-daily-images.ts     # Generate daily/weekly variations
├── generate-work-images.ts      # Generate work mode images
├── generate-blur-placeholders.ts # Generate blur data URLs
├── generate-theme-colors.ts     # Extract colors from images
└── generate-reference.ts        # Generate character reference
```
