# Architecture

## Overview

A static Astro 7 site with one interactive island. Everything is pre-rendered to
HTML + CSS at build time; the only JavaScript shipped to the browser is the hero
web component (a few KB, framework-free).

```
┌─ Astro build (static) ──────────────────────────────────────┐
│  Content Collections ─┐                                     │
│  (src/content/blog)   │── pages/ ──> dist/*.html             │
│  data/profile.ts ─────┘            + sitemap + rss.xml       │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼  (browser)
┌─ Hydrated island ───────────────────────────────────────────┐
│  <agent-terminal> web component (shadow DOM, vanilla TS)    │
│  selector + Thinking spinner + token stream + todo checklist│
└──────────────────────────────────────────────────────────────┘
```

## Layer by layer

### 1. Content & data

- **`src/data/profile.ts`** — the single source of truth for all profile content:
  bio, skills, certifications, experience, socials, education, languages. It also
  exports `heroTopics`, an array of `TopicAnswer` objects that drive the
  interactive hero. **Change profile content here, nowhere else.**
- **`src/content.config.ts`** — defines the `blog` collection with a Zod schema
  (`title`, `description`, `pubDate`, `updatedDate?`, `tags[]`, `draft`,
  `heroImage?`). Posts are loaded via the `glob` loader from
  `src/content/blog/**/*.{md,mdx}`.

### 2. Layouts

- **`BaseLayout.astro`** — the document shell: `<head>` with meta/OG tags, canonical
  URL, RSS link, JSON-LD `Person` schema, the no-FOUC theme preload script, `Nav`,
  `<slot>`, and `Footer`. All pages extend this.
- **`BlogLayout.astro`** — wraps a single post with a back link, title, date, tags,
  and the `<slot>` for rendered Markdown. Extends `BaseLayout`.

### 3. Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `pages/index.astro` | Hero + About + Skills + Experience + Certifications + latest posts + Contact |
| `/blog` | `pages/blog/index.astro` | Post list, sorted newest-first, with tag filter |
| `/blog/[slug]` | `pages/blog/[slug].astro` | Single post, rendered Markdown + prev/next nav |
| `/blog/tag/[tag]` | `pages/blog/tag/[tag].astro` | Posts filtered by tag |
| `/rss.xml` | `pages/rss.xml.ts` | RSS feed of non-draft posts |

`[slug]` and `[tag]` use `getStaticPaths` so every post/tag is pre-rendered.

### 4. Components

- **`Nav.astro`** — sticky, blurred header with logo, `home`/`blog` links, social
  icon links, and the theme toggle. Active-link highlighting by current path.
- **`Footer.astro`** — copyright + socials.
- **`ThemeToggle.astro`** — a button that flips `data-theme` on `<html>` and
  persists to `localStorage`. The matching glyph (sun/moon) is shown per theme.
- **`PostCard.astro`** — a single post preview card (title, date, description, tags).

### 5. The hero (the signature element)

`src/components/hero/`:

- **`agent-terminal.ts`** — a `customElements.define('agent-terminal', ...)` web
  component. It attaches a shadow DOM with encapsulated plain CSS. It reads topic
  data from its `data-topics` attribute (JSON) and renders a two-pane layout:

  - **Left pane — selector:** opencode-style checkbox list (`□ About`, `□ Skills`,
    `□ Experience`, `□ Certifications`, `□ AI/agents`, `□ Contact`). Clicking a
    topic toggles its box and triggers a turn in the terminal.
  - **Right pane — terminal:** an opencode-styled panel (`#141414` panel, traffic
    dots, `waltercrdz ~ opencode` title). Each turn runs:
      1. **`Thinking…` spinner** — a braille-dot spinner in `--oc-accent` for
         ~700–1200ms.
      2. **`Todowrite` checklist** — the topic's `todo[]` rendered as `☐ …` rows
         that flip to `☒` and strike-through as the stream progresses.
      3. **Token streaming** — the `body` markdown types out char-by-char
         (simulated real-time token response) with a blinking block cursor, re-parsed
         to HTML each tick by a minimal inline markdown renderer.
  - Selecting more topics **appends** turns to the transcript (auto-scroll), like a
    continuing agent session. Re-selecting a checked topic unchecks the box only.

  Async methods carry explicit `Promise<void>` return types because `runTurn` and
  `waitForIdle` are mutually recursive — strict mode requires the annotation.

- **`AgentTerminal.astro`** — the wrapper: serializes `heroTopics` to JSON in the
  `data-topics` attribute and imports the web component via a single Astro
  `<script>` (bundled, deferred, framework-free).

### 6. Styling

- **`src/styles/theme.css`** — global CSS custom properties mirroring opencode's
  default theme *roles* 1:1 (`--oc-bg`, `--oc-text`, `--oc-primary`, `--oc-accent`,
  etc.) with dark and light values under `[data-theme='dark']` / `[data-theme='light']`.
  The signature detail: **`--oc-primary` is peach (`#fab283`) in dark and blue
  (`#3b7dd8`) in light** — exactly as opencode's theme flips.
- Component styles are scoped Astro `<style>` blocks; the hero's styles live in
  its shadow DOM as plain CSS (no `:global()` — invalid in shadow DOM).
- No Tailwind. No hardcoded hex in components — all colors go through `--oc-*` vars.
- CSS custom properties pierce shadow DOM, so the hero inherits the theme tokens
  without duplicating them.

### 7. Theme system

Dark by default. An inline preload script in `BaseLayout` reads `localStorage`
(falling back to `prefers-color-scheme`) and sets `data-theme` on `<html>` **before
paint**, preventing FOUC. The `ThemeToggle` button updates both the attribute and
storage. This mirrors opencode's own `oc-theme-preload` approach.

### 8. SEO & feeds

- Per-page `<title>`/`<meta>`/OpenGraph via `BaseLayout` props.
- JSON-LD `Person` schema (name, jobLocation Barcelona, alumni UTN, `sameAs`
  socials) in `BaseLayout`.
- `@astrojs/sitemap` generates `sitemap-index.xml`; `public/robots.txt` references
  it.
- `@astrojs/rss` generates `/rss.xml` from the blog collection.
- Markdown code blocks use Shiki (`github-dark`) via Astro's built-in config.

## Performance

- Near-zero JS: only the hero island ships code. Everything else is static HTML/CSS.
- `prefetch` (viewport strategy) warms links that scroll into view.
- `font-display: swap` on the system font stacks (no web-font download).
- `prefers-reduced-motion` disables animations globally.

## Deploy

Static output to **Cloudflare Pages**. Build command `pnpm build`, output
`dist/`. No server runtime, no edge functions required. The existing
`waltercrdz.dev` DNS and Cloudflare email protection stay intact.
