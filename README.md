# waltercrdz.dev

Personal portfolio + blog of **Walter Cardozo** — Software Engineer based in Barcelona.
Built with [Astro](https://astro.build), themed after [opencode](https://opencode.ai)'s
default terminal/agent aesthetic.

The signature element is an **interactive agent session** in the hero: a checkbox
topic selector on the left feeds a live, token-streaming opencode-style terminal on
the right — complete with a `Thinking…` spinner phase and a `Todowrite` checklist
that checks off as the answer streams in.

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # outputs to dist/
pnpm preview      # preview the production build
pnpm check        # typecheck (.astro + .ts)
```

Requires Node 20+ (developed on Node 25) and [pnpm](https://pnpm.io) 11+
(`npm install -g pnpm` if you don't have it).

## Writing a blog post

Posts are Markdown files in `src/content/blog/`. Frontmatter schema is defined in
`src/content.config.ts`:

```markdown
---
title: 'Your post title'
description: 'A one-line summary for lists and SEO.'
pubDate: 2026-06-26
tags: ['ai', 'engineering']
draft: false        # omit from production builds + lists when true
---

Your content here. Code blocks get Shiki syntax highlighting.
```

The file name (minus `.md`) becomes the URL slug: `src/content/blog/my-post.md`
→ `/blog/my-post/`. Tags auto-generate `/blog/tag/<tag>/` pages.

## Deploy

Static output, deployed to **Cloudflare Pages**:

- Build command: `pnpm build`
- Output directory: `dist`
- Custom domain: `waltercrdz.dev` (DNS unchanged)

## Where things live

```
src/
  components/        Nav, Footer, ThemeToggle, PostCard
  components/hero/   agent-terminal.ts (web component) + AgentTerminal.astro
  content/blog/      Markdown posts
  data/profile.ts    single source of truth for all profile/hero content
  layouts/           BaseLayout, BlogLayout
  pages/             index, blog/, rss.xml
  styles/theme.css   opencode theme tokens (CSS custom properties)
docs/
  architecture.md    how the site is put together
  project-guide.md   commands + conventions for working in this repo
  plans/             design documents
```

See [`docs/architecture.md`](docs/architecture.md) for the full architecture and
[`docs/project-guide.md`](docs/project-guide.md) for commands and conventions.
