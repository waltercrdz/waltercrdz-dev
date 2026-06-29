# Design: waltercrdz.dev v3 — OpenCode "Query" agent hero

- **Date:** 2026-06-26
- **Status:** Approved
- **Owner:** Walter Cardozo
- **Supersedes (hero + sections only):** `2026-06-26-portfolio-redesign-design.md` §2–§3

## Goal

Reframe the hero as a faithful **OpenCode IDE "Query" agent session**: the topic
selector moves *inside* the terminal chat as a Claude-Code-style lettered prompt
(Option A), the layout becomes an 80% workspace / 20% sidebar split, and the
landing page stops oversharing — removing the static About, Skills, and
Certifications sections so the hero query is the single funnel for that info.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Topic selector | **Option A** — lettered `A)…E)` list rendered as the first turn *inside* the terminal chat (`? What would you like to know?`) |
| Hero layout | 80% main workspace (terminal + bottom input bar) / 20% right sidebar |
| Sidebar content | Decorative agent-session list: `session`, live `status`, `agent: query`, `topics: n/5`, plus social links as quick exits |
| Bottom input bar | OpenCode-style `>` prompt + always-visible **`[ Query ▾ ]`** agent selector in blue (`--oc-secondary`), default agent **Query** (not Build). Decorative (single agent). |
| Agent identity | "Query" — an agent to query info about Walter |
| Palette | Keep existing `--oc-*` opencode tokens; **no `theme.css` color overrides** |
| Typography | Hybrid: monospace across all landing UI (hero, sidebar, Experience table, Contact, labels); sans-serif kept only for blog post body text |
| Hero proportion | Terminal panel fills the 80% column, `min-height ~520px` — the page centerpiece |
| Removed sections | Static **About**, **Skills**, **Certifications** (hero query covers them) |
| Kept sections | Experience (restyled as terminal table) · Latest writing · Contact |
| Hero topics | Trim to **5**: About, Skills, Experience, AI & agents, Contact (Certifications folded into the AI topic as a one-liner) |
| Voice | Sell the image without oversharing; point to socials for more |

## 1. Hero — Query agent session

### Layout (desktop ≥ 760px)

```
┌──────────────────────────────────────────┬──────────────┐
│ 80% workspace                            │ 20% sidebar  │
│ ┌─ waltercrdz ~ opencode ──────────────┐ │ session      │
│ │ ● ● ●                                │ │ waltercrdz   │
│ │ ? What would you like to know?       │ │ status  idle │
│ │   A) About   B) Skills  C) Experience│ │ agent   query│
│ │   D) AI & agents  E) Contact         │ │ topics  0/5  │
│ │ › type A–E or click to run a query   │ │ ───────────  │
│ │ (turn transcript streams below)      │ │ links        │
│ ├──────────────────────────────────────┤ │ github       │
│ │ > _                        [ Query ▾]│ │ linkedin     │
│ └──────────────────────────────────────┘ │ x            │
└──────────────────────────────────────────┴──────────────┘
```

Stacks to a single column under 760px (sidebar moves below the terminal).

### Interaction

1. On load, the chat body shows the **prompt turn**: `? What would you like to
   know?` + a lettered menu `A)…E)` + a hint `› type A–E or click to run a query`.
2. The user **clicks a letter** or **types A–E** in the always-visible bottom
   input bar. Each pick runs a turn (Thinking → Todowrite checklist → token
   stream) appended below the prompt turn, like a continuing agent session.
3. The bottom input bar (the `>` field) is focusable and auto-focused on load, so
   typing works regardless of scroll. Clicking the terminal refocuses it.
4. Picked letters gain a `✓` mark and dim slightly; the sidebar `topics: n/5`
   counts distinct topics queried. Re-picking appends another turn.
5. Picking during an active stream aborts the current turn and runs the new one
   (preserves the existing `abort` / `waitForIdle` contract).

### Sidebar status sync

The `status` line mirrors the web component's `phase`:
- `idle` → muted (`--oc-text-muted`)
- `thinking` → purple (`--oc-accent`)
- `streaming` → green (`--oc-success`)

`topics: n/5` updates as distinct topics are queried. Social links render from
`profile.socials` (single source of content) passed via a `data-socials`
attribute.

## 2. Experience — terminal summary table

Replaces the current left-border timeline with a dense, crisp grid emulating the
OpenCode summary table:

- **Borders:** `1px` solid `--oc-border-subtle`, **no border-radius**.
- **Header row:** `What` | `Status` in purple (`--oc-accent`).
- **Left column (What):** role + company in bright green (`--oc-success`).
- **Right column (Status):** period + short summary in off-white (`--oc-text`),
  with the tech stack rendered as green inline tags (`--oc-success`) for the
  "green emphasis on technologies/metrics" effect.
- **Padding:** compact, data-rich.

Each `experience` entry gains a `tech: string[]` field (e.g.
`['Java','Spring Boot','Kafka','Kubernetes']`) to drive the green tags.

## 3. Hero topics (refined, 5)

| Key | Topic | Streams (tightened teaser) |
|---|---|---|
| A | About | One-line intro: role, Barcelona, 14+ yrs, eDreams ODIGEO, backend + AI agents |
| B | Skills | Grouped toolkit, compact |
| C | Experience | Two highlight stints; points to the table below |
| D | AI & agents | Coding-agent stance + cert signal (Claude Code / LangChain / Prompt Eng) one-liner |
| E | Contact | Socials + email; notes socials are in the sidebar too |

Removed: standalone `Certifications` topic. Bodies trimmed to "sell, don't
overshare"; each ends nudging the visitor to socials for more.

## 4. Files affected

- `src/data/profile.ts` — trim `heroTopics` to 5 (drop `certifications`), tighten
  bodies, add `tech: string[]` to each `experience` entry.
- `src/components/hero/agent-terminal.ts` — rewrite render: prompt turn with
  lettered menu inside chat, bottom input bar + `Query` selector, 20% sidebar
  with live status sync, keyboard A–E, socials from `data-socials`.
- `src/components/hero/AgentTerminal.astro` — 80/20 grid wrapper; serialize
  `profile.socials` to `data-socials`.
- `src/pages/index.astro` — remove About / Skills / Certifications sections;
  restyle Experience as the terminal table; keep Latest writing + Contact;
  monospace for landing UI text.
- `src/styles/theme.css` — **no color value changes** (palette kept).

## 5. Constraints

- No `theme.css` color overrides (`AGENTS.md` rule).
- No framework runtimes; hero stays a vanilla TS web component.
- `pnpm check` + `pnpm build` must pass with zero errors.
- No comments in code unless explaining a non-obvious decision.

## Out of scope

- No multi-agent switching (the `Query ▾` pill is decorative; single agent).
- No real input parsing in the bottom bar (typing only maps A–E to topics).
- No light-theme color changes.
