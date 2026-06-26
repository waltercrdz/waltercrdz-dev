# AGENTS.md

Ground truth for AI coding agents working in this repository. Read this first.

## Project

Astro 7 static site (portfolio + blog) for Walter Cardozo, deployed to Cloudflare
Pages. Single hydrated island: an interactive agent-terminal hero built as a
vanilla TypeScript web component. No React/Vue/Svelte runtime.

## Commands

- `pnpm dev` — dev server on http://localhost:4321
- `pnpm build` — production build to `dist/` (must stay green)
- `pnpm check` — Astro + TypeScript typecheck (run before declaring done)
- `pnpm preview` — serve the built `dist/` locally

Always run `pnpm check` and `pnpm build` after non-trivial changes. Both
must pass with zero errors.

## Package manager

This project uses **pnpm** (not npm/yarn). The lockfile is `pnpm-lock.yaml`;
do not commit `package-lock.json` or `yarn.lock`. Dependency versions are
pinned exactly in `package.json`. The `yaml` security override and approved
build scripts (esbuild, sharp) live in `pnpm-workspace.yaml`.

## Architecture rules

- **No framework runtimes.** The hero is a web component (`customElements.define`)
  loaded via a single Astro `<script>` import. Do not introduce React/Vue/Svelte.
- **Styling is scoped Astro CSS + global CSS custom properties.** No Tailwind.
  The opencode theme tokens live in `src/styles/theme.css` as `--oc-*` variables.
  Use them; do not hardcode hex colors in components.
- **Single source of content: `src/data/profile.ts`.** Bio, skills, certs,
  experience, socials, and the hero topic answers (`heroTopics`) all live there.
  If you need to change profile content, change that file. The hero web component
  consumes `heroTopics` serialized as JSON via the `data-topics` attribute.
- **Blog posts are Markdown in `src/content/blog/`.** Schema in
  `src/content.config.ts`. Do not edit the generated `.astro/types.d.ts`.

## Conventions

- TypeScript strict mode. No `any` without justification; the hero's async
  methods carry explicit `Promise<void>` return types (the recursive
  `runTurn`/`waitForIdle` pair requires it).
- Web component styles live in its shadow DOM `<style>` as plain CSS (no
  `:global()` — that's an Astro-scoped-CSS construct and is invalid in shadow DOM).
- File naming: kebab-case for files, PascalCase for `.astro` components.
- No comments in code unless explaining a non-obvious decision.

## What NOT to do

- Do not add analytics, comments, or a CMS without explicit approval.
- Do not change the opencode color values in `theme.css` — they are mirrored
  1:1 from opencode's default theme on purpose.
- Do not commit `dist/` or `.astro/`.
