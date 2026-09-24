---
title: "Demo mode as signed config, not a fork"
description: "Ephemeral public demo stores that can't send email, take payments or be crawled, driven by one flag in the same signed document as everything else."
date: 2026-09-24
tags: [Architecture, SaaS, Testing, Cloudflare Workers]
---

A commerce platform without a free tier still needs a way for a prospect to try it. The lazy route is a separate demo deployment or a long-lived branch, both of which rot. I built demo mode as **runtime configuration in the signed tenant document**, the same one that carries entitlements. Flipping `demoMode` changes behaviour within the normal propagation window (about two minutes), with no platform deploy.

## Safe by default

The flag has to fail in exactly one direction. If the document is missing, unverifiable or malformed, `demoMode` is `false`. A configuration failure must never be able to turn a paying store into a demo, and the reverse is acceptable: a demo that briefly behaves like a real store is far less damaging than a real store that stops taking payments.

The payload carries three related fields:

```json
{ "demoMode": true, "demoExpiresAt": "2026-08-04T00:00:00Z", "demoSignupUrl": "https://example.com/start" }
```

The expiry drives a live countdown in the banner. The signup URL must be HTTPS or it is ignored. Both are also ignored unless `demoMode` is true.

## Suppress at the egress layer

The interesting question is what a demo must **not** be able to do. The answer is a list of side effects that leave the system or abuse it:

| Capability | Behaviour in demo |
|---|---|
| Email, every path | A transport wrapper intercepts each send, logs `demo_email_simulated` and returns success. Nothing reaches the mail provider |
| Payments | Checkout completes in simulated mode. No real card entry. Payment webhooks return 403 |
| Agent access (MCP and OAuth routes) | Return 403, and admin shows the endpoint with a "connection not allowed" explanation |
| Media upload | Rejected. Seed imagery stays |
| Catalogue | Products, variants, types, attributes, categories and collections are view-only. Mutating verbs return 403 |
| Custom script injection | Creation and enabling blocked, even though demo entitlements otherwise match a paid tier |
| Admin-triggered builds | Capped at 2 per demo, on top of the hourly rate limit |
| Server-side ad forwarding | Suppressed |

The email row is the pattern worth copying. Rather than adding `if (demo)` checks at every call site, the *transport* is wrapped, so every current and future code path that sends mail is covered by construction and reports success to its caller. The suppression sits at the boundary where side effects leave the system.

## What demo mode does not do

It does **not** make the admin read-only. Checkout, order management and storefront serving stay available, because the invariants that protect real stores hold here too, and a prospect should be able to place a test order and fulfil it. Only catalogue data is frozen, because catalogue edits are what make a public demo drift into an ugly state. Everything else stays editable until reset.

Demo tenants are given **paid-tier-equivalent entitlements** so gated features are visible, since a demo that hides the product's best parts is not a demo.

## Hygiene for something public

- An opaque generated slug for the hostname. Vanity slugs are never used for demos.
- `noindex, nofollow` on every page, an equivalent `X-Robots-Tag` header, and a `robots.txt` that disallows everyone.
- A persistent banner in both storefront and admin with the countdown and a signup link.
- A staff-authenticated, rate-limited reset endpoint that proxies to the control plane, which re-clones the seed snapshot and clears demo-specific runtime state.

## The seed snapshot has a contract test

The demo data lives in the repository as a manifest plus a snapshot with stable `demo_*` IDs:

```text
demo/
  manifest.json    snapshotVersion, schemaVersion, minimum entity counts
  snapshot.json    canonical commerce and content rows
```

The control plane wipes the tenant's commerce and content tables and re-inserts the snapshot on provisioning and on reset. A CI test validates the manifest's minimum counts against the snapshot, and the manifest records the schema version it was built for. So when a migration changes the schema and nobody updates the demo data, **the build breaks** instead of a prospect finding an empty store. Seed data is code and it needs a compiler.

## Takeaways

- A demo is a **configuration of the real product**, not a copy of it.
- Fail toward the real, paying behaviour.
- Suppress side effects by wrapping the boundary, not by sprinkling conditionals.
- Version and test your seed data against the schema.
