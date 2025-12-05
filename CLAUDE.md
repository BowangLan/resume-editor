# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a LaTeX resume editor with AI-powered PDF parsing built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Users can upload PDF resumes, edit them through a visual interface, and export to LaTeX (.lex format). The app features a split-view editor with live LaTeX code preview.

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

## Environment Setup

Create a `.env.local` file with:
```
OPENAI_API_KEY=your-openai-api-key
```
Get your API key from https://platform.openai.com/api-keys. Required for AI-powered PDF parsing and resume improvement features.

## Tech Stack & Dependencies

- **Framework**: Next.js 16.0.7 with App Router (React Server Components enabled)
- **React**: Version 19.2.0
- **TypeScript**: Version 5 with strict mode enabled
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **UI Components**: shadcn/ui (New York style variant)
- **State Management**: Zustand with persist middleware (localStorage-backed)
- **AI**: Vercel AI SDK with OpenAI GPT-4o-mini for PDF parsing and resume improvements
- **PDF Processing**: pdf-parse-fork
- **Forms**: react-hook-form with zod validation (@hookform/resolvers)
- **Syntax Highlighting**: react-syntax-highlighter
- **Icons**: lucide-react
- **Animations**: tw-animate-css, motion (Framer Motion)
- **Themes**: next-themes for dark mode support
- **Notifications**: sonner for toast notifications
- **Layout**: react-resizable-panels for split-view editor

## Project Structure

```
/app
  /api               # API routes for AI features
    /parse-resume    # PDF to JSON parsing with OpenAI
    /improve-resume  # Resume content improvement with AI
    /generate-pdf    # LaTeX to PDF conversion
  /globals.css       # Global styles and Tailwind theme variables
  /layout.tsx        # Root layout with Geist fonts
  /page.tsx          # Main resume editor page
/components
  /resume
    /sections        # Section-specific editors (lazy-loaded with React.lazy)
      /header-section.tsx
      /education-section.tsx
      /experience-section.tsx
      /projects-section.tsx
      /skills-section.tsx
      /section-container.tsx        # Reusable section wrapper
      /section-item-container.tsx   # Reusable item wrapper
      /education-item-editor.tsx
      /experience-item-editor.tsx
      /project-item-editor.tsx
      /skill-category-editor.tsx
    /action-bar.tsx         # Top nav with upload/download
    /resume-editor.tsx      # Main editor with code splitting
    /split-view.tsx         # Desktop split-view layout
    /file-uploader.tsx      # PDF upload component
    /bullet-list-editor.tsx # Dynamic bullet point editor
    /latex-code-dialog.tsx  # LaTeX code view dialog
  /ui                       # shadcn/ui components
/hooks
  /use-resume.ts     # Zustand store for resume state (persisted to localStorage)
  /use-file-handler.ts  # File upload/download logic
  /use-mobile.ts     # Mobile detection hook
/lib
  /types
    /resume.ts       # Core Resume, EducationItem, ExperienceItem, etc.
    /improvements.ts # Types for AI-powered resume improvements
  /parser
    /latex-parser.ts # LaTeX string to Resume object parser (regex-based)
  /generator
    /latex-generator.ts  # Resume object to LaTeX string generator
  /utils.ts          # Utility functions (cn helper)
/public              # Static assets
```

## Key Architecture Details

### State Management Architecture

The app uses Zustand for global state with localStorage persistence:
- **Store**: `/hooks/use-resume.ts` exports `useResumeStore`
- **Persistence**: Automatically syncs to localStorage as `resume-storage` key
- **Actions**: `setResume`, `updateHeader`, `updateEducation`, `updateExperience`, `updateProjects`, `updateSkills`, `applyImprovements`, `reset`
- All section components use this store via `useResumeStore()` hook
- State persists across page refreshes

### LaTeX Parser/Generator Architecture

**Parser** (`/lib/parser/latex-parser.ts`):
- Converts LaTeX string → Resume JSON object
- Uses regex patterns to extract structured data
- Handles standard LaTeX resume format with `\resumeSubheading` commands
- Parses: header (name, contacts), education (with coursework), experience (with bullets), projects (with links), skills (categories)

**Generator** (`/lib/generator/latex-generator.ts`):
- Converts Resume JSON object → LaTeX string
- Outputs compilable `.lex` file with standard document class and packages
- Preserves formatting and structure for LaTeX compilation
- Bi-directional workflow: can parse uploaded LaTeX, edit in UI, regenerate LaTeX

### AI-Powered Features

**PDF Parsing** (`/app/api/parse-resume/route.ts`):
- Uses `pdf-parse-fork` to extract text from PDF
- OpenAI `generateObject` with zod schema to structure resume data
- Returns Resume JSON matching TypeScript types

**Resume Improvements** (`/app/api/improve-resume/route.ts`):
- Analyzes experience/project bullets and skills
- Provides improved versions with professional language, quantification, action verbs
- Supports both standard and streaming responses
- Results applied via `applyImprovements` action in store

### Code Splitting & Performance

- Section components lazy-loaded with `React.lazy` and `Suspense`
- All section components wrapped in `React.memo` to prevent re-renders
- Resizable panels optimize layout without full re-renders
- localStorage persistence reduces initial API calls

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

### Supported LaTeX Resume Format

The parser/generator expect this LaTeX structure:
- Document class: `\documentclass[letterpaper,11pt]{article}`
- Custom commands: `\resumeSubheading`, `\resumeItem`, `\resumeItemListStart/End`, `\resumeSubHeadingListStart/End`
- Sections: Education, Experience, Projects, Skills (in any order)
- Header: Contact info with `\href` links for email, website, LinkedIn, GitHub

When extending the parser, update both:
1. `/lib/parser/latex-parser.ts` - add regex patterns
2. `/lib/generator/latex-generator.ts` - add generation logic
3. `/lib/types/resume.ts` - add TypeScript types
4. Zustand store actions in `/hooks/use-resume.ts`

## Adding New Resume Sections

To add a new section (e.g., "Certifications"):

1. **Add TypeScript type** in `/lib/types/resume.ts`:
   ```typescript
   export interface CertificationItem {
     id: string;
     name: string;
     issuer: string;
     date: string;
   }

   // Add to Resume interface
   export interface Resume {
     // ... existing fields
     certifications: CertificationItem[];
   }
   ```

2. **Update parser** in `/lib/parser/latex-parser.ts`:
   - Add `parseCertifications()` method with regex patterns
   - Add to `parse()` return object

3. **Update generator** in `/lib/generator/latex-generator.ts`:
   - Add `generateCertifications()` method
   - Add to main `generate()` output

4. **Update Zustand store** in `/hooks/use-resume.ts`:
   - Add `updateCertifications` action
   - Update `reset` to include certifications

5. **Create section component** in `/components/resume/sections/certifications-section.tsx`:
   - Use `React.memo` for performance
   - Follow patterns from existing sections

6. **Lazy load in editor** in `/components/resume/resume-editor.tsx`:
   - Add `React.lazy` import
   - Add to rendered sections with `Suspense`

## Development Notes

- **React 19**: Uses new features like enhanced hooks. Ensure dependency compatibility when adding packages
- **Tailwind CSS 4**: Syntax differs from v3 - uses `@import` and `@theme` inline in CSS instead of `tailwind.config.js`
- **TypeScript**: Strict mode enabled. All types defined in `/lib/types/`
- **Client Components**: Most components are client-side (`"use client"`) due to interactivity and Zustand
- **Build target**: ES2017 for browser compatibility
- **ID Generation**: Uses `crypto.randomUUID()` for unique IDs in resume items

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
