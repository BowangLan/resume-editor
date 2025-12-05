# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 resume editor application built with React 19, TypeScript, and Tailwind CSS 4. The project uses shadcn/ui components (New York style) for the UI library and appears to work with LaTeX resume files (.lex format).

## Development Commands

```bash
# Start development server (opens on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Tech Stack & Dependencies

- **Framework**: Next.js 16.0.7 with App Router (React Server Components enabled)
- **React**: Version 19.2.0
- **TypeScript**: Version 5 with strict mode enabled
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **UI Components**: shadcn/ui (New York style variant)
- **Forms**: react-hook-form with zod validation (@hookform/resolvers)
- **Icons**: lucide-react
- **Animations**: tw-animate-css
- **Themes**: next-themes for dark mode support
- **Notifications**: sonner for toast notifications

## Project Structure

```
/app                 # Next.js App Router pages
  /globals.css       # Global styles and Tailwind theme variables
  /layout.tsx        # Root layout with Geist fonts
  /page.tsx          # Home page
/components
  /ui                # shadcn/ui component library (50+ components)
/lib
  /utils.ts          # Utility functions (cn helper for class merging)
/hooks
  /use-mobile.ts     # Mobile detection hook
/public              # Static assets
```

## Key Architecture Details

### Path Aliases

The project uses TypeScript path aliases configured in tsconfig.json:
- `@/*` maps to the root directory
- Direct access to: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`

### Styling System

- Uses Tailwind CSS 4 with inline @theme configuration
- CSS variables defined for comprehensive theming (light/dark modes)
- Color system uses OKLCH color space for better perceptual uniformity
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))`
- Radius tokens: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- Sidebar theming variables included for potential sidebar components

### shadcn/ui Configuration

Components are configured via `components.json`:
- Style: "new-york"
- RSC: enabled (React Server Components)
- TSX: enabled
- Base color: neutral
- CSS variables: enabled
- Icon library: lucide
- No prefix on component classes

### Fonts

The app uses Geist font family:
- `--font-geist-sans` for sans-serif
- `--font-geist-mono` for monospace

### Resume Format

The project works with LaTeX resume files (`.lex` extension). Sample file `sample-resume.lex` uses standard LaTeX article document class with resume-specific packages.

## Development Notes

- The app uses React 19 features, ensure compatibility when adding new dependencies
- Tailwind CSS 4 syntax differs from v3 (uses @import and @theme instead of tailwind.config)
- All UI components are pre-installed from shadcn/ui library
- Form validation uses zod schemas with react-hook-form integration
- The build target is ES2017 for browser compatibility

## UI Component Library

50+ shadcn/ui components are available in `/components/ui/`, including:
- Form controls: input, textarea, select, checkbox, radio-group, switch, slider
- Layout: card, separator, tabs, accordion, collapsible, resizable
- Overlays: dialog, sheet, drawer, popover, hover-card, tooltip
- Navigation: navigation-menu, menubar, breadcrumb, sidebar
- Feedback: alert, badge, progress, spinner, skeleton, sonner (toast)
- Data display: table, calendar, chart, carousel, pagination
- Utility: button, button-group, avatar, kbd, empty, field, item, input-group

All components support dark mode via next-themes and use Radix UI primitives.
