# Repository Guidelines

## Project Structure & Module Organization
Source lives in the Next.js App Router tree (`/app` for pages, layout, and Tailwind globals). UI primitives and resume editors are in `/components`; dynamic section editors reside under `/components/resume/sections`, while shared shadcn/ui widgets live in `/components/ui`. Client logic and Zustand stores are in `/hooks`, and parsing/generation utilities are in `/lib` (`/lib/parser`, `/lib/generator`, `/lib/types`). Static assets sit in `/public`, and `sample-resume.lex` provides realistic fixture data for manual checks.

## Build, Test, and Development Commands
Run `npm run dev` for the local server at http://localhost:3000 with hot reload. `npm run build` performs the production Next.js compile, and `npm start` serves the optimized build for smoke tests. `npm run lint` executes ESLint (configured via `eslint.config.mjs`) and is the only automated gate today—treat failures as blockers before opening a PR.

## Coding Style & Naming Conventions
Use TypeScript with strict typing; prefer explicit interfaces from `/lib/types/resume.ts` over inline shapes. Components and hooks are `PascalCase` and `useCamelCase` respectively, while Zustand selectors follow `selectSomething`. Keep files focused (UI vs. data parsing) and colocate section-specific assets under their section folder. Tailwind 4 utilities belong in className strings; extract repeated patterns into helper components rather than global CSS. Run the formatter provided by your editor plus `npm run lint` before commits.

## Testing Guidelines
There is no Jest/Vitest suite yet; rely on `npm run lint` plus functional verification. Exercise the sample flow: upload `sample-resume.lex`, confirm each section renders, tweak content, and export LaTeX. Write exploratory cases for new resume sections (e.g., add watchers in `/components/resume/resume-editor.tsx`) and document manual steps in the PR description so reviewers can reproduce.

## Commit & Pull Request Guidelines
Follow the existing `<type>: <action>` style (`feat:`, `fix:`, `chore:`) seen in `git log`. Keep subject lines under ~72 chars and describe scope in body if non-trivial. Every PR should include: summary of changes, testing notes/links, any UI screenshots or GIFs for visible updates, and references to related issues or docs. Request review once CI (lint + build) passes locally, and ensure secrets like `OPENAI_API_KEY` stay in `.env.local`, never in commits.
