---
title: 'Why I treat my coding agent like a junior, not a magic wand'
description: 'A pragmatic stance on AI coding agents — harness quality, senior judgement, and where the real leverage is.'
pubDate: 2026-06-26
tags: ['ai', 'agents', 'engineering']
---

A decent AI model with a great harness will always beat a great model with a bad
harness. When your coding agent fails, it's usually the harness, not the model.

That single sentence reshaped how I work. Here's the stance I've landed on after
a year of daily agent usage.

## The harness is everything

The "harness" is everything wrapped around the model: the rules, the skills, the
tool boundaries, the way context gets fed in. A junior engineer with a clear
spec, a sharp linter, and tight code review ships better code than a senior
working alone with no guardrails. Same with agents.

Concretely, I keep:

- A short, opinionated `AGENTS.md` so the agent knows the project's ground truth.
- Skill files for repetitive workflows (so I'm not re-explaining each session).
- Tool permissions locked down — `bash` and `edit` on ask, never auto-approve.
- The smallest context that solves the task. Pruning isn't penny-pinching; it's
  signal preservation.

## Keep the senior judgement

Agents are a multiplier, not a replacement. They crush boilerplate, scaffold
tests, and hold the boring shape of a feature while I focus on the parts that
actually need taste — the API boundary, the data model, the failure modes.

> Use AI to cut the boilerplate, keep the senior judgement.

The moment you stop reviewing the diff is the moment it stops being a tool and
starts being a liability.

## Where the leverage actually is

The biggest win isn't typing faster. It's **iteration speed on ideas**. I can
explore three architectural approaches in an afternoon now — scaffold each,
stress-test the edges, throw two away — for the cost of what one used to take.

That changes the economics of good engineering. The boring, proven tech stays
boring and proven. The exploration around it gets radically cheaper.

---

More on this soon — I'll write up my concrete Claude Code + opencode setup and
the skills I've found worth keeping.
