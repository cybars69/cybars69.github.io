---
title: "aeo-skills"
blurb: "Open-source agent skills that audit, rewrite and monitor whether answer engines can extract a clean answer from your pages."
era: recent
order: 1
image: /images/projects/aeo-skills.jpg
alt: "The AEO score card, showing four weighted dimensions that add up to a 0 to 100 score"
tags: [Agent Skills, AEO, Schema, Claude Code]
github: https://github.com/cybars69/aeo-skills
kind: "Open source"
featured: true
readme: true
---

<!-- Synced verbatim from cybars69/aeo-skills/README.md by scripts/sync-skill-readmes.mjs. Edit the README, then run `npm run sync:skills`. -->

# aeo-skills — Make Your Pages the Answer

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Agent Skills](https://img.shields.io/badge/AgentSkills-compatible-blueviolet)](https://agentskills.io)

**People are not clicking ten blue links. They are asking ChatGPT, Gemini, Perplexity, Claude, and Google AI Overviews a question and taking the first clean answer.**

aeo-skills is an open-source Agent Skill suite that audits, rewrites, and monitors whether answer engines can extract a complete, trusted answer from your pages. It tells you what blocks featured snippets, AI Overviews, People Also Ask, and assistant replies — then generates the fixes.

Compatible with [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenCode, OpenClaw, Codex CLI, Cursor, GitHub Copilot, and any [AgentSkills](https://agentskills.io)-compatible agent.

**You do not need your own website to publish or install this.** Agents install from GitHub. Google and AI crawlers get a free homepage at [cybars69.github.io/aeo-skills](https://cybars69.github.io/aeo-skills/) after GitHub Pages is enabled.

---

## AEO is not GEO

| | **AEO** (this repo) | **GEO** |
|---|---|---|
| Question | Can an engine *extract and serve* this page as the answer? | Will a generative engine *cite* this site as a source? |
| Unit of work | Passage, FAQ, how-to, snippet format | Domain, entity, crawler access, brand graph |
| Failure mode | Buried answers, hedge language, mismatched schema, stale claims | Blocked crawlers, weak entity, no `llms.txt` |
| Win condition | Direct-answer ownership | Citation share |

Use both. They measure different things.

---

## Why it matters

Traditional SEO tools measure rankings and backlinks. Answer engines select **passages**: a 40–60 word definition, a numbered procedure, a comparison table, a dated statistic with a source.

Published research and platform docs that this scoring model uses:

| Signal | Why it is in the model | Source class |
|--------|------------------------|--------------|
| Content optimization (citations, stats, quotations) | **115–415%** visibility lift in generative engines for some treatments | Aggarwal et al., 2023 (Princeton / Georgia Tech) |
| Statistics in content | **~30%** higher citation probability in that study | Aggarwal et al., 2023 |
| Expert quotations | **~41%** more citations in that study | Aggarwal et al., 2023 |
| `nosnippet` / `max-snippet:0` | Blocks snippet and many answer-card uses | [Google robots meta tags](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) |
| FAQ rich results | Restricted to a small set of site types in Google Search; FAQ **content + JSON-LD** still matters for other answer surfaces | [Google Search Central FAQ change](https://developers.google.com/search/blog/2023/08/howto-faq-changes) |

Practitioner heuristics (18-token extractable claims, 30–50 word FAQ answers) are labeled as heuristics in the scoring guide. Do not treat them as peer-reviewed constants.

---

## Quick start

```bash
# Install all skills
npx skills add cybars69/aeo-skills

# Run a full AEO audit
/aeo-audit https://your-website.com
```

---

## Available skills

| Skill | What it does |
|-------|----------------|
| [aeo-audit](https://github.com/cybars69/aeo-skills/tree/main/skills/aeo-audit) | Score extractability, question coverage, answer schema, evidence, and companion Agent Readiness (robots, Content Signals, markdown for agents, well-known discovery). |
| [aeo-fix-answers](https://github.com/cybars69/aeo-skills/tree/main/skills/aeo-fix-answers) | Rewrite passages into snippet-ready, self-contained answers. Never invents data. |
| [aeo-fix-questions](https://github.com/cybars69/aeo-skills/tree/main/skills/aeo-fix-questions) | Map real questions to pages; draft FAQ answers and fragment IDs without stuffing. |
| [aeo-fix-schema](https://github.com/cybars69/aeo-skills/tree/main/skills/aeo-fix-schema) | Generate FAQPage, HowTo, QAPage, DefinedTerm, and `mainEntity` JSON-LD that matches visible content. |
| [aeo-compare](https://github.com/cybars69/aeo-skills/tree/main/skills/aeo-compare) | Side-by-side AEO scores against 2–3 competitors. |
| [aeo-monitor](https://github.com/cybars69/aeo-skills/tree/main/skills/aeo-monitor) | Re-audit against a baseline and track regressions. |

---

## How scoring works

aeo-audit returns a **composite AEO Score (0–100)** from four dimensions:

| Dimension | Weight | What it measures |
|-----------|--------|------------------|
| Answer Extractability | 35% | Direct-answer lead, extractable claims, snippet formats, passage integrity |
| Question Coverage | 25% | Primary question ownership, related questions, intent mix, follow-ups |
| Answer Schema | 20% | FAQ/HowTo/QAPage/`mainEntity` markup, visible-content parity, JSON-LD quality |
| Evidence & Freshness | 20% | Sources, methodology, dates, authorship |

```
AEO = Extractability×0.35 + Question Coverage×0.25 + Answer Schema×0.20 + Evidence×0.20
```

A **Snippet Eligibility Gate** sits outside the formula. If Googlebot is blocked, the page is `noindex`, or `nosnippet` / `max-snippet:0` is set, other scores have limited practical value until that gate is fixed.

Every audit also returns **Agent Readiness (0–100)** — crawl policy, `Accept: text/markdown`, API catalog, A2A, MCP, OAuth, `auth.md`. It is **not** averaged into AEO. A brochure site can be strong AEO and weak Agent Readiness.

Full rubric: [`skills/aeo-audit/references/scoring-guide.md`](https://github.com/cybars69/aeo-skills/blob/main/skills/aeo-audit/references/scoring-guide.md) · Agent checks: [`skills/aeo-audit/references/agent-readiness.md`](https://github.com/cybars69/aeo-skills/blob/main/skills/aeo-audit/references/agent-readiness.md)

---

## Installation

### Recommended

```bash
npx skills add cybars69/aeo-skills
```

### Manual

```bash
# Claude Code
git clone https://github.com/cybars69/aeo-skills.git ~/.claude/skills/aeo-skills

# OpenCode
git clone https://github.com/cybars69/aeo-skills.git ~/.config/opencode/skills/aeo-skills

# OpenClaw
git clone https://github.com/cybars69/aeo-skills.git ~/.openclaw/skills/aeo-skills
```

### Single skill

```bash
npx skills add cybars69/aeo-skills --skill aeo-audit
```

### Usage

```bash
/aeo-audit https://example.com
/aeo-fix-answers https://example.com/blog/post
/aeo-fix-questions https://example.com
/aeo-fix-schema https://example.com
/aeo-compare https://mysite.com https://competitor-a.com https://competitor-b.com
/aeo-monitor https://mysite.com
```

In other agents, describe the task naturally: "Run an AEO audit on https://example.com".

---

## Publish and discovery (no custom domain)

This suite is distributed as a **public GitHub repository**. That is what `npx skills add` and `gh skill install` read. A custom domain is optional.

| Surface | What to do | URL after publish |
|---------|------------|-------------------|
| **AI coding agents** | Public repo + `skills/*/SKILL.md` | `npx skills add cybars69/aeo-skills` |
| **skills.sh** | Same public repo (listed after GitHub is live) | [skills.sh/cybars69/aeo-skills](https://skills.sh/cybars69/aeo-skills) |
| **Google / Bing / AI crawlers** | Enable GitHub Pages from `/docs` | [cybars69.github.io/aeo-skills](https://cybars69.github.io/aeo-skills/) |
| **llms.txt** | Already in the repo and on Pages | [llms.txt](https://cybars69.github.io/aeo-skills/llms.txt) |
| **Agent Skills index** | Served from Pages | [.well-known/agent-skills/index.json](https://cybars69.github.io/aeo-skills/.well-known/agent-skills/index.json) |

RFC 8615 `/.well-known/` is defined at the **origin root**. Project Pages live at `https://cybars69.github.io/aeo-skills/`, so the index is at that path, not at `https://cybars69.github.io/.well-known/`. Agents that only probe the github.io origin root will miss it unless you later add a user site repo named `cybars69.github.io`. GitHub itself remains the install source either way.

### First-time publish

1. `gh auth login` (this machine’s GitHub token is currently invalid).
2. Commit and `git push -u origin main`.
3. GitHub → repo → **Settings → Pages** → Deploy from branch `main`, folder `/docs`.
4. **About** → Topics: `agent-skills`, `aeo`, `answer-engine-optimization`, `ai-overviews`, `schema-markup`, `llms-txt`.
5. About → Website: `https://cybars69.github.io/aeo-skills/`.
6. After Pages is live, submit that URL in [Google Search Console](https://search.google.com/search-console) (URL prefix `https://cybars69.github.io/aeo-skills/`). Bing Webmaster Tools the same.

Do not expect day-one rankings. Public GitHub + Pages + a factual README is the discoverability stack you can run without buying a domain.

---

## What is AEO?

**Answer Engine Optimization** is the practice of structuring pages so answer engines can select a passage as the answer: featured snippets, AI Overviews, People Also Ask, and voice/assistant responses.

It is not keyword density. It is passage quality, question ownership, structured answers, and evidence.

---

## FAQ

**Do I need an API key?**
No. Skills fetch public pages and produce reports locally.

**Which engines does this cover?**
The audit is engine-agnostic. Recommendations call out differences between Google AI Overviews / featured snippets, ChatGPT, Perplexity, Gemini, and Claude when the evidence supports it.

**Will FAQ schema get me a Google FAQ rich result?**
Usually not. Google limited FAQ rich results to a small set of site types. FAQ content and JSON-LD still help answer extraction on other surfaces. The skill will not promise rich results the site is not eligible for.

**How is this different from Ahrefs or Semrush?**
Those tools measure rankings, links, and (sometimes) snippet ownership historically. aeo-skills scores whether a page is *extractable and answerable* from the live HTML.

**Can I use this with geoskills?**
Yes. Run `aeo-audit` for answer extraction and a GEO audit for crawler/entity/citation share. Do not mix composite scores; the models are not interchangeable.

---

## Changelog

### v1.1.0 (2026-09-16)

- Companion **Agent Readiness** score in `aeo-audit` / `aeo-compare` / `aeo-monitor` (not mixed into AEO)
- Checks from Cloudflare / Is It Agent Ready prompts: RFC 9309 robots, sitemap, explicit AI User-agents, Content Signals, markdown negotiation, RFC 9727 API catalog, Link headers, OAuth/OIDC + RFC 9728, `/auth.md`, A2A agent card, Agent Skills index, MCP server card, WebMCP, DNS-AID, Web Bot Auth
- SSOT: `skills/aeo-audit/references/agent-readiness.md`
- `AEO-AUDIT-META` now `scoring_model: v1.1` with `agent_readiness` fields (v1 AEO dimensions stay comparable)

### v1.0.0 (2026-09-16)

Initial public release.

- **aeo-audit** — Scoring Model v1: Extractability 35%, Question Coverage 25%, Answer Schema 20%, Evidence 20%, plus a snippet eligibility gate (`noindex` / `nosnippet` / CSR-only answers)
- Business-type adjustments for SaaS, E-commerce, Publisher, Local, and Agency
- `AEO-AUDIT-META` machine-readable footer for monitor chaining
- **aeo-fix-answers** / **aeo-fix-questions** / **aeo-fix-schema** aligned to the same rubric
- **aeo-compare** and **aeo-monitor** consume the same SSOT (`scoring-guide.md`)
- Research notes separate peer-reviewed GEO findings from AEO practitioner heuristics

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/skill-improvement`)
3. Keep `scoring-guide.md` as the AEO scoring SSOT and `agent-readiness.md` as the Agent Readiness SSOT
4. Open a pull request

Useful contributions: non-English hedge dictionaries, additional business-type profiles, snippet-format heuristics, schema templates, eval cases.

---

## License

Apache-2.0 — see [LICENSE](https://github.com/cybars69/aeo-skills/tree/main/LICENSE).

Packaging is inspired by other Agent Skills monorepos such as [geoskills](https://github.com/Cognitic-Labs/geoskills). This is an independent AEO project, not a fork and not affiliated with Cognitic Labs or AIvsRank.
