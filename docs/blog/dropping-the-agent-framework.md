# Dropping the agent framework

Rebuilding a multi-tenant WhatsApp chatbot with a cheap classifier, a plain router and raw API calls instead of an agent framework.

Source: https://cybars69.github.io/blog/dropping-the-agent-framework/


Published: 2026-09-24
Tags: AI agents, Python, LLMs, Architecture

The first version of a WhatsApp booking assistant I worked on ran on an agent framework. It worked, and it was also framework-heavy, had no tests, had no evals, had no Chatwoot integration wired up, and came with a scraping pipeline complicated enough that nobody wanted to touch it.

The rebuild started from a one-page plan whose key decision was blunt: **no framework**. No ADK, no CrewAI, no LangGraph.

## The shape of the replacement

```text
WhatsApp → Twilio → Chatwoot (self-hosted) → agent-bot webhook
  → intent classifier (fast, cheap model)
  → router (plain Python)
  → handler (conversational model) + tools (database queries)
  → reply through Chatwoot
```

- A **small fast model classifies intent**. It costs a fraction of a cent per message, and answers in about 200 ms.
- A **plain Python router** picks one of five handlers: greeting, query, booking, FAQ and escalation.
- The **handler** calls a conversational model with a system prompt, the history and tools. The tools are ordinary functions that query the database.
- **Chatwoot** handles the inbox, conversation history and human takeover, none of which I wanted to build.

Nothing in that diagram needs a framework. Each box is a function I can put a test around.

## What "no framework" bought

- **Testability.** A handler is a function of a message, a history and a set of tools. An eval is a dataset and a runner.
- **Readable failures.** When a booking goes wrong the trace is a Python stack, not a framework's internal state machine.
- **Onboarding that fits in three endpoints.** New businesses give a website URL, a document or raw text, and a plain HTTP fetch plus an HTML parser plus an LLM extraction populates their products, locations, FAQs and tone. No message queue, no headless browser.

## Multi-tenant from day one

Each business gets its own Chatwoot account, and a table maps that account to the tenant. The webhook resolves the tenant before anything else runs. Retrofitting tenancy into a single-tenant agent is the kind of change that touches everything.

## Composable configuration

The other lesson was about *where the agent's behaviour lives*. Business info, tone and FAQs could be edited through an API, but the agent's identity and its guardrails were baked into Python strings, so changing a rule meant a deploy. I split behaviour into independent pieces (identity, personality, rules, knowledge) so each can change without touching the others.

The operational booking backend and the agent's database also stay separate systems with no sync. Each is populated on its own, and the dashboard resolves a user to their business with a single lookup, which avoided a synchronisation problem I did not want to own.

## Planning it

The plan had five phases, each with a milestone I could check from a terminal: a `curl` returns a formatted reply; a WhatsApp message round-trips through Chatwoot; a website URL populates every tenant table; `pytest` and the eval runner pass; `docker compose up` brings up a first business end to end. Milestones you can *run* keep a rebuild honest.

## When I'd still reach for a framework

I wouldn't say never. If the workflow is genuinely long-running, needs durable pause and resume, or has many cooperating agents, a framework earns its weight. A chatbot that classifies, replies and calls a few tools isn't that.
