# Project Guide

Commands and conventions for working in this repository.

## Prerequisites

- Node 20+ (developed on Node 25)
- pnpm 11+ (`npm install -g pnpm` if you don't have it)

## Commands

| Command | What it does |
|---|---|
| `pnpm install` | install dependencies |
| `pnpm dev` | dev server at http://localhost:4321 with HMR |
| `pnpm build` | production build to `dist/` |
| `pnpm preview` | serve the built `dist/` locally (port 4321) |
| `pnpm check` | Astro + TypeScript typecheck |
| `pnpm astro` | raw access to the Astro CLI |

### Definition of done

After any non-trivial change, **both must pass with zero errors**:

```bash
pnpm check
pnpm build
```

`pnpm check` may show advisory **hints** (e.g. about the `z` schema alias) —
those are fine. Errors and warnings are not.

## How to work in this repo

### Change profile content (bio, skills, certs, experience, socials)

Edit **`src/data/profile.ts`** only. It is the single source of truth. The hero
terminal streams the `heroTopics` array; the static homepage sections read the
`profile` object. Both are consumed at build time, so changes appear after a
rebuild (or instantly via `pnpm dev` HMR).

### Add a hero topic

Add a new entry to `heroTopics` in `src/data/profile.ts`:

```ts
{
  id: 'now',                       // unique, used as the checkbox key
  label: 'Now',                    // shown in the selector
  heading: '## Now',               // markdown heading streamed first
  todo: ['Load current focus'],    // checklist items that check off
  body: 'What I'm working on now…' // markdown, streamed token-by-token
}
```

The selector renders one checkbox per `heroTopics` entry automatically.

### Write a blog post

1. Create `src/content/blog/<slug>.md` (the file name = the URL slug).
2. Use the frontmatter schema from `src/content.config.ts`:

```markdown
---
title: 'Post title'
description: 'One-line summary for lists + SEO.'
pubDate: 2026-06-26
updatedDate: 2026-07-01      # optional
tags: ['ai', 'agents']       # auto-generates /blog/tag/<tag>/ pages
draft: false                 # true = excluded from builds + lists
heroImage: '/img/x.png'      # optional
---

Body in Markdown. Code fences get Shiki highlighting.
```

3. `draft: true` posts are skipped by `getCollection('blog', ({ data }) => !data.draft)`
   everywhere — safe to commit works-in-progress.

### Change the theme colors

You normally shouldn't — `src/styles/theme.css` mirrors opencode's default theme
1:1 on purpose. If you genuinely must, edit the `--oc-*` values under
`[data-theme='dark']` / `[data-theme='light']` in that one file. **Never hardcode
hex colors inside components** — always use `var(--oc-*)`.

### Edit the hero terminal behavior

All hero logic is in `src/components/hero/agent-terminal.ts` (a vanilla TS web
component with shadow DOM). Styling is the `STYLES` constant in the same file —
plain CSS, no `:global()`. The wrapper is `AgentTerminal.astro`.

### Add a page

Create a `.astro` file in `src/pages/`. Extend `BaseLayout.astro` (or
`BlogLayout.astro` for posts) and pass `title`/`description` props for SEO. Dynamic
routes use `getStaticPaths`.

## File naming

- `.astro` components: **PascalCase** (`PostCard.astro`, `BaseLayout.astro`)
- `.ts` files and everything else: **kebab-case** (`agent-terminal.ts`,
  `profile.ts`)
- Blog posts: **kebab-case** `.md` (`coding-agent-like-a-junior.md`)

## Do not

- Introduce React/Vue/Svelte or any framework runtime.
- Add Tailwind or other CSS frameworks.
- Add analytics, comments, or a CMS without explicit approval.
- Edit `.astro/types.d.ts` (generated).
- Commit `dist/` or `.astro/` (gitignored).

## Design documents

Past and present designs live in `docs/plans/`. The current redesign is documented
in `docs/plans/2026-06-26-portfolio-redesign-design.md`.
