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
</div>

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| Deployment | Vercel |

## Features

- Seasonal themes that automatically change each month
- Light and dark mode support
- AI-generated illustrations for each season
- Responsive design

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

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
