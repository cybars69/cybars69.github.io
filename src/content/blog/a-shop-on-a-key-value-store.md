---
title: "A shop on a key-value store: index arrays, immutable Stripe prices and what you give up"
description: "Modelling products and collections in Workers KV, syncing them to Stripe without breaking history, and the reliability limits of a store with no queries."
date: 2026-09-24
tags: [Cloudflare Workers, KV, Stripe, Data modelling]
---

I built a small storefront to live entirely inside Cloudflare's free tier: React on the front, Hono on a Worker, **KV** as the only database and Stripe for payments. A KV store has no query language, no joins and no transactions, so the data model has to be designed backwards from the reads.

## The key layout

Everything is either an **index** or an **entity**:

| Key | Value |
|---|---|
| `products:all` | JSON array of product IDs |
| `collections:all` | JSON array of collection IDs |
| `media:all` | JSON array of media IDs |
| `product:{id}` | the product document |
| `collection:{id}` | the collection document |
| `collection:products:{collectionId}` | array of product IDs in that collection |
| `media:{id}` | media metadata |
| `storefront:page:{slug}` | a page-builder document for a page such as `home` |

Listing products is two steps: read `products:all`, then fetch each `product:{id}`. Listing a collection's products reads the **denormalised** `collection:products:{id}` array, which trades write cost for a cheap read. The docs keep a "KV data model" page that must be updated whenever a key pattern changes in code, which is the closest thing a schemaless store gets to a migration.

## What you give up

The reliability notes are blunt about the platform's constraints:

- **KV is eventually consistent.** Don't assume read-after-write across keys in separate requests.
- **CPU time per request is small** on the free tier (around 10 ms), so heavy loops are out.
- There are no transactions, so a write that touches two keys can leave them out of step.

My reading of the index design: `products:all` is a read-modify-write on a single value, so two admins creating a product at the same instant can lose one ID. For a single-admin shop that is fine. For anything busier you would move the index to a store with transactions, or make it derivable from entity keys. Knowing which invariant you have quietly stopped guaranteeing is the price of the free tier.

## Stripe: prices are immutable

The store keeps Stripe in sync automatically, and the rules follow Stripe's model, where a price never changes:

- Creating a product creates a **Stripe product and a Stripe price**, and stores both IDs for checkout.
- Editing name, description or images updates the Stripe product. Description is sent only if non-empty. Up to eight images are sent.
- Changing the **base price creates a new Stripe price** and preserves the old ones, so historical orders still reference the price they were bought at.
- Variants with a custom price get their own Stripe prices. Others use the base.
- KV product records are **merged** on update, and image fields are normalised to arrays so the UI and the Stripe sync agree on the shape.

That "new price, never edit" rule mirrors a good general principle: a price attached to a past order is history.

## Checkout and webhooks

Two paths exist: single-item checkout from a product page and cart checkout (a cart lives in the browser's local storage until checkout). Both create a **Stripe Checkout session**, so card details never touch the Worker. The customer is redirected to a success or cancel URL. Webhooks (`checkout.session.completed`, `payment_intent.succeeded`) are optional, and when enabled the handler **verifies Stripe's signature**.

## Security by construction

The trust model fits on one line:

```text
Browser (untrusted)  ->  HTTPS  ->  Worker (trusted)  ->  KV / Stripe
```

- Secrets exist only in Worker bindings, never in the client bundle.
- Admin login issues a random session token stored in KV with a **24 hour TTL**. The client sends it in a header, and invalid or expired tokens get a 401.
- Security headers (CSP, `X-Frame-Options: DENY`, HSTS) are applied in the Worker.
- A store deployment gets its own KV namespace, so tenant isolation is by deployment, not by a tenant column.

There is an explicit checklist for security changes, including "CSP still allows the required Stripe domains if checkout changes", the kind of item that is easy to break and hard to notice.

## Takeaways

- With KV, model **reads first**, and denormalise deliberately.
- Write down the invariants you no longer have.
- Never edit a price. Create a new one.
- Keep the trust boundary as small as one Worker.
