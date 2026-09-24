---
title: "WhatsApp booking agent"
blurb: "A multi-tenant chatbot that answers customers and takes bookings on WhatsApp, rebuilt from a framework-heavy agent into plain Python and raw API calls."
era: recent
order: 4
image: /images/projects/booking-agent.png
alt: "Diagram: WhatsApp to Chatwoot to classifier to handler to tools and database, with human handoff"
tags: [FastAPI, Gemini, Claude, Chatwoot, Twilio]
kind: "Client work · anonymized"
featured: true
---

A conversational agent for businesses that run children's activity clubs. Parents message on WhatsApp; the agent answers questions and creates bookings, and hands over to a human when it should. Many businesses share one deployment, each with its own data, tone and rules.

## The pipeline

```text
WhatsApp → Twilio → Chatwoot (self-hosted) → agent-bot webhook
   → intent classifier (fast model)
   → router (plain Python)
   → handler (conversational model) + tools (database queries)
   → Chatwoot API → Twilio → WhatsApp
```

A small, cheap model classifies intent. A stronger conversational model handles the reply through a tool loop against the database. There are five handlers: greeting, query, booking, FAQ and escalation. Chatwoot gives every business a real inbox, conversation history and human takeover for free.

## The rebuild

The first version ran on an agent framework. It was heavy, had no tests or evals, and had a scraping pipeline nobody wanted to own. The rebuild dropped the framework entirely, and I wrote it up in [dropping the agent framework](/blog/dropping-the-agent-framework/). It was planned in five phases: core agent, Chatwoot integration, onboarding, tests and evals, deployment.

## Onboarding from a URL

A new business shouldn't fill in forms. Three endpoints (website, document, raw text) fetch the content, extract products, locations, FAQs and tone with an LLM, and populate the tenant's tables.

## Composable configuration

Identity, personality, business rules and knowledge are separate concerns that can change independently. Changing a guardrail shouldn't need a deploy, and businesses shouldn't need to touch code to change how their agent sounds. The agent's database and the operational booking backend are separate systems that deliberately do not sync.

## Stack

FastAPI, SQLAlchemy, PostgreSQL, Gemini, Claude, Chatwoot, Twilio, Docker.

## Deep dives

- [Provisioning a WhatsApp number in six steps](/blog/provisioning-a-whatsapp-number-in-six-steps/)
- [The webhook returns 200 first](/blog/the-webhook-returns-200-first/)
- [Dropping the agent framework](/blog/dropping-the-agent-framework/)
