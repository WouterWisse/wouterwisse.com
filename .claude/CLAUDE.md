# Project Rules

> Knowledge accumulated from development work. Each learning makes future work easier.

## Patterns

- Use Next.js App Router conventions for routing and layouts
- Co-locate hooks in `src/hooks/` with `use` prefix and barrel exports
- Store configuration in `src/config/` with typed exports
- The homepage is one layered office scene (`OfficeScene.tsx`) registered to a 1536×1024 coordinate system in `src/config/office.ts`

## Gotchas

- After replacing an office layer's source PNG, run `npx tsx scripts/prepare-office-assets.ts` (add `--night` for night assets), then `npm run test:office`
- Bump the layer's `?v=` cache version in `OfficeScene.tsx` when its artwork changes
- Theme mode changes sync with browser meta theme-color
- The Turbopack dev server can keep serving stale CSS after files change in quick succession (e.g. a branch switch); restart with `npm run dev`, which clears `.next`

## Conventions

- TypeScript strict mode for all source files
- Tailwind CSS 4 for styling with CSS variables
- CSS and the Web Animations API for animations (respect reduced motion preferences)
- Named exports with barrel files (index.ts) for modules
- Record image-generation prompts in `docs/` and sound sources and licenses in `public/sounds/office-sources.md`

## Architecture

- `src/app/` - Next.js App Router pages, layouts and the link-preview image
- `src/components/` - React components (Hero, OfficeScene)
- `src/hooks/` - Custom React hooks (theme mode, office sounds)
- `src/config/` - Office layer placement and generated layer bounds
- `src/types/` - TypeScript type definitions
- `scripts/` - Office asset preparation and validation
- `public/images/office/scene/` - Office layers (day, `night/`, expressions, interactions, stickers) with source PNGs in `sources/`
- `public/sounds/` - Typing, interaction and sticker sounds
