# Design: waltercrdz.dev v2 — Astro + opencode-styled agent hero

- **Date:** 2026-06-26
- **Status:** Approved
- **Owner:** Walter Cardozo

## Goal

Rebuild the personal profile site at waltercrdz.dev as a sober, detail-geek
landing page themed after opencode's default terminal/agent aesthetic, add a
blog so Walter can start writing, and keep it cheap to host on Cloudflare Pages.

## Source material

- **Current site** (waltercrdz.dev): minimal — name, tagline "Coding and Software
  Architecture for real-world", short prose intro, socials (LinkedIn
  `waltercrdz`, GitHub `waltercrdz`, X `@walteriodev`), Cloudflare email
  protection.
- **LinkedIn** (`waltercrdz`): Barcelona, Spain · 14+ yrs · Software Engineer at
  eDreams ODIGEO · UTN (Universidad Tecnológica Nacional) · backend (Java,
  Python) + architecture. Certifications: Claude Code in Action (Anthropic),
  LangChain for LLM Apps, Prompt Engineering (DeepLearning.AI), MongoDB
  Indexing/Query Optimization/Sharding, DDD (LinkedIn), SOLID, Scrum. Strong
  AI/coding-agent signal in activity.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Hero concept | Interactive agent session: checkbox selector (left) + token-streaming opencode terminal (right), with a `Thinking…` spinner phase before each stream |
| Tech stack | Astro (latest), static output, **vanilla TS web-component island** for the hero (no framework runtime), scoped Astro CSS + CSS custom properties |
| Blog | Astro Content Collections (Markdown/MDX), typed frontmatter, Shiki syntax highlighting |
| Sections scope | Medium: Hero + About + Skills + Certifications + Experience + Blog + Contact |
| Deploy | Cloudflare Pages |
| Theme | Dark default + manual toggle, persist localStorage, fall back to `prefers-color-scheme` |
| Palette | opencode default theme, mirrored role-by-role (see below) |

## 1. Stack & build

- **Astro** latest, `output: 'static'`.
- Hydrate only the hero as a single `client:visible` island (vanilla TS web
  component). Everything else is plain HTML + CSS → near-zero JS shipped.
- Styling: scoped Astro CSS + global CSS custom properties that mirror
  opencode's theme *roles* 1:1. No Tailwind.
- Fonts: monospace for the terminal/code/labels; a clean sans for body prose.
  `font-display: swap`.
- Deploy: Cloudflare Pages, keep waltercrdz.dev DNS; preserve Cloudflare email
  protection for the contact address.

## 2. The hero — interactive agent session (signature element)

Two-pane layout on desktop; stacked on mobile.

**Left pane — "query" selector** (styled like the opencode todo/checkbox list):

- Prompt line at top: `> introduce walter —select a topic`
- Selectable options, each with a checkbox glyph (multiple allowed):
  - `□ About`
  - `□ Skills`
  - `□ Experience`
  - `□ Certifications`
  - `□ AI/agents`
  - `□ Contact`

**Right pane — agent terminal** (opencode-styled panel: `#141414` panel bg,
`#484848` border, title bar with traffic dots + `waltercrdz ~ opencode`):

1. On selection → **`Thinking…` spinner phase**: braille/dot spinner in
   `--oc-accent` purple + the word "Thinking" in muted text (~700–1200ms).
2. Then **token streaming**: the answer types out char-by-char (simulated
   real-time token response), with opencode-style scaffolding — a `Todowrite`
   checklist block that checks off as content renders, plus the prose answer.
   Markdown rendered live (headings `--oc-accent`, code `--oc-success` green,
   links `--oc-info` cyan).
3. Blinking block cursor while streaming; stops when done.
4. Selecting more topics *appends* to the transcript (auto-scrolls), like a
   continuing agent session.

Content per option is drawn from `src/data/profile.ts` (real LinkedIn/profile
data): 14+ yrs, eDreams ODIGEO, Java/Python, UTN, Claude Code / LangChain /
MongoDB certs, DDD/SOLID, Barcelona.

## 3. Pages & sections (Medium scope)

- **`/`** — Hero (agent session) + About strip + Skills + Certifications +
  Experience highlights + latest blog posts + Contact footer.
- **`/blog`** — post list (title, date, reading time, excerpt, tag).
- **`/blog/[slug]`** — full post, Shiki code blocks, prev/next, back link.
- **`/blog/tag/[tag]`** — tag filter.
- Reusable `BaseLayout`, `Nav` (logo + Blog link + theme toggle + GitHub/
  LinkedIn/X), `Footer` (© 2026, socials, Cloudflare-protected email).
- `robots.txt`, `sitemap.xml` (Astro `@astrojs/sitemap`), RSS (`@astrojs/rss`).

## 4. Theme system

Dark default; nav toggle persists to `localStorage` and falls back to
`prefers-color-scheme`. Toggle swaps `data-theme="light|dark"` on `<html>`. CSS
vars resolve per theme, including the signature **peach→blue primary flip**.
An inline preload script (like opencode's `oc-theme-preload.js`) sets the theme
before paint to avoid FOUC.

### opencode default palette (resolved)

| Role | Dark | Light |
|---|---|---|
| background | `#0a0a0a` | `#ffffff` |
| backgroundPanel | `#141414` | `#fafafa` |
| backgroundElement | `#1e1e1e` | `#f5f5f5` |
| text | `#eeeeee` | `#1a1a1a` |
| textMuted | `#808080` | `#8a8a8a` |
| border | `#484848` | `#b8b8b8` |
| borderActive | `#606060` | `#a0a0a0` |
| **primary** | `#fab283` (peach) | `#3b7dd8` (blue) |
| secondary | `#5c9cf5` | `#7b5bb6` |
| accent | `#9d7cd8` (purple) | `#d68c27` |
| success | `#7fd88f` | `#3d9a57` |
| warning | `#f5a742` | `#d68c27` |
| info | `#56b6c2` | `#318795` |
| error | `#e06c75` | `#d1383d` |

## 5. Data model

- `src/content.config.ts` → `blog` collection schema:
  `title`, `description`, `pubDate`, `updatedDate?`, `tags[]`, `draft`,
  `heroImage?`.
- `src/data/profile.ts` → single source of truth for everything the hero streams
  + the static sections (bio, skills, certs, experience, socials). The hero web
  component reads a JSON rendition so content lives in one place.

## 6. SEO & perf

Per-page `<title>`/`<meta>` via `BaseLayout`, OpenGraph tags, JSON-LD `Person`
schema (name, jobLocation Barcelona, alumni UTN, sameAs socials). ~0 JS except
the hero island.

## 7. Repo layout

```
src/
  components/        Nav.astro Footer.astro ThemeToggle.astro PostCard.astro
  components/hero/   agent-terminal.ts (web component) + AgentTerminal.astro wrapper
  content/blog/      *.md  (+ one sample post)
  data/profile.ts
  layouts/BaseLayout.astro  BlogLayout.astro
  pages/index.astro blog/index.astro blog/[slug].astro blog/tag/[tag].astro
  styles/theme.css   (opencode role tokens)
public/  robots.txt favicon
docs/
  plans/2026-06-26-portfolio-redesign-design.md
  architecture.md        (architecture details)
  project-guide.md       (commands + how to work with this project)
README.md
AGENTS.md
astro.config.mjs  (sitemap + rss integrations)
```

## Out of scope (YAGNI)

- No headless CMS now (architecture leaves room to add later).
- No full CV timeline — only experience highlights.
- No search, no comments, no analytics on first pass.
- No light-mode-only or auto-only theme; the toggle is the single control.
