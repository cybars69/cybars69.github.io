# White-label commerce platform

A multi-tenant storefront platform where every store gets its own Worker, plans are signed entitlements, and AI agents can run the shop over MCP.

Source: https://cybars69.github.io/projects/commerce-platform/


Kind: Client and studio work · anonymized
Tags: Cloudflare Workers, MCP, Multi-tenant, Astro

A commerce platform for brands that want more built in and fewer plugins to manage. I was the architect and lead engineer: the storefront, the admin, the control plane that provisions stores, and the interfaces that let AI agents operate a shop.

## One Worker per store

Each store runs as its own Cloudflare Worker with its own data. A separate **control plane** owns tenants, billing and provisioning. That split shaped the most interesting part of the design.

## Plans as signed entitlements

The store never learns what a plan is called or what it costs. The control plane signs a document of **entitlements** (booleans and numeric limits such as staff seats, order allowance and admin build quota) into the store's key-value storage. The store enforces the document and reports usage back. Entitlements flow down, usage flows up, nothing else crosses.

Because the store only sees capabilities, a set of invariants can be guaranteed no matter what billing does:

- Checkout and storefront serving are never blocked by plan state, usage or billing status.
- Order management (view, fulfil, refund, label) is never restricted.
- There are no count caps on products, variants, pages or coupons.
- Live shopper pricing never changes because of a billing event.

I wrote more about that in [plans that never block checkout](https://cybars69.github.io/blog/plans-that-never-block-checkout/).

## AI agents as first-class operators

Commerce operations are exposed over **MCP with OAuth**: single-entity operations, customer segmentation, cart-recovery workflows, capability discovery and controlled bulk change-sets with a preview step. Tools a plan doesn't include are removed from the session's registry rather than returned as a permission error, so an agent never sees an action it can't take.

## Zero-touch provisioning

A Python provisioning engine turns "create a store" into containers, reverse-proxy config, certificates, databases and migrations, object storage, DNS and a frontend deployment, with no manual steps.

## Storefront SDK and CLI

Themes are Astro projects. A publishable SDK and CLI replace "download a full storefront ZIP and edit it beside the platform repo" with `connect`, `dev`, `check`, `push` and `deploy --activate`, so a developer can build a theme against real storefront-safe data without cloning the platform.

## Stack

Cloudflare Workers, Workers KV and D1, React, Astro, FastAPI, PostgreSQL, Nginx, MCP, OAuth.

## Deep dives

- [Signed entitlements over KV: Ed25519, a five-step fallback chain, and a document that can only narrow](https://cybars69.github.io/blog/signed-entitlements-over-kv/)
- [The control-plane seam: idempotent usage snapshots, an event outbox and HMAC commands](https://cybars69.github.io/blog/control-plane-seam-usage-events-hmac/)
- [Demo mode as signed config, not a fork](https://cybars69.github.io/blog/demo-mode-as-signed-config/)
- [Two currencies, one invoice](https://cybars69.github.io/blog/two-currencies-one-invoice/)
- [Plans that never block checkout](https://cybars69.github.io/blog/plans-that-never-block-checkout/)
