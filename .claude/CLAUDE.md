# Project Rules

> Knowledge accumulated from development work. Each learning makes future work easier.

## Patterns

- Use Next.js App Router conventions for routing and layouts
- Co-locate hooks in `src/hooks/` with `use` prefix and barrel exports
- Store configuration in `src/config/` with typed exports
- Pre-generate blur placeholders and theme colors via scripts

## Gotchas

- Run `npm run generate-blur-placeholders` after adding new images
- Run `npm run generate-theme-colors` after adding new theme images
- Daily images fallback to monthly theme images when not available
- Theme mode changes sync with browser meta theme-color

## Conventions

- TypeScript strict mode for all source files
- Tailwind CSS 4 for styling with CSS variables
- Framer Motion for animations (respect reduced motion preferences)
- Named exports with barrel files (index.ts) for modules

## Architecture

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components (Hero, ThemeToggle, SocialLinks)
- `src/hooks/` - Custom React hooks for state and effects
- `src/config/` - Static configuration and generated data
- `src/types/` - TypeScript type definitions
- `scripts/` - Node.js utilities for image generation
- `public/images/` - Static assets organized by theme/month
