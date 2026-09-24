# Storefront on Workers

A small storefront built to live inside Cloudflare's free tier: React, Hono, Workers KV and Stripe, with a repo designed for coding agents.

Source: https://cybars69.github.io/projects/storefront-on-workers/


Kind: Studio work · anonymized
Tags: Cloudflare Workers, Hono, Stripe, React

A minimal online shop that runs entirely on Cloudflare and is designed to stay inside its free tier while still being fast and secure.

| Layer | Technology |
|---|---|
| Frontend | Vite, React, Tailwind CSS |
| Backend | Cloudflare Workers with Hono |
| Data | Workers KV for products, collections and settings |
| Payments | Stripe |
| Admin auth | Token-based |
| Deploy | Wrangler |

It began on Pages Functions and moved to a Worker that serves static assets and the API together, which simplified routing, bindings and deployment.

## A repo built for agents

The more interesting part is the repository itself. It follows a harness-engineering approach: a short `AGENTS.md` that is a table of contents rather than a manual, a structured `docs/` knowledge base, mechanical checks in CI (docs structure and architecture import layers), and a graded quality score per domain so that anyone, human or agent, knows where the weak spots are.

More in [the repo is the system of record](https://cybars69.github.io/blog/repo-as-system-of-record/).

## Stack

Cloudflare Workers, Workers KV, Hono, React, Tailwind, Stripe, Vitest.

## Deep dives

- [A shop on a key-value store](https://cybars69.github.io/blog/a-shop-on-a-key-value-store/)
- [The repo is the system of record](https://cybars69.github.io/blog/repo-as-system-of-record/)
