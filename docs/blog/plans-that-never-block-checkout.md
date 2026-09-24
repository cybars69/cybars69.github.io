# Plans that never block checkout

Designing subscription tiers for a multi-tenant commerce platform so that billing state can never take a store's checkout offline.

Source: https://cybars69.github.io/blog/plans-that-never-block-checkout/


Published: 2026-09-24
Tags: Architecture, SaaS, Billing, Cloudflare

If you run a platform where merchants pay a subscription and shoppers pay the merchants, there's a nasty failure hiding in the seam between the two: a billing problem on your side can break a shopper's checkout on theirs. A merchant's card fails, a webhook is late, a lookup returns nothing, and a store stops taking orders.

I designed the entitlement system for a white-label commerce platform around one rule: **the platform knows what it is allowed to do and what it did. It does not know what a plan is called, what it costs, or whether a bill is overdue.**

## Entitlements flow down, usage flows up

Each store runs as its own Worker. A separate control plane owns tenants and billing, and it signs a document of entitlements (booleans like "may use customer segments" and numbers like "staff seats") into the store's key-value storage. The store enforces the document and reports usage back. The document has no plan names and no prices. Nothing else crosses.

That split makes a set of invariants possible, because the store simply has no idea whether a bill is overdue:

1. Checkout and storefront serving are never blocked by plan state, usage, billing status or demo expiry.
2. Order management (view, fulfil, refund, note, label) is never restricted.
3. The merchant's own analytics and diagnostics are never gated.
4. Baseline login security is available at every tier.
5. There are no count caps on products, pages or coupons.
6. Live shopper pricing never changes because of a billing event.

## The rules that fall out of it

**Gate authoring, never evaluation.** Segment-targeted discounts can be created only on higher plans, but existing ones keep being applied at checkout even if the entitlement is switched off. Turning off a feature must not change what a shopper pays.

**Warn, don't block.** An order allowance warns at 80 and 100 percent and shows overage, but never stops orders.

**Suspend, don't delete.** If a store is over its staff-seat limit after a downgrade, the extra accounts are suspended (they can't log in) and never deleted, and the owner decides which to keep.

**Grandfather what exists.** A downgraded store keeps running the custom scripts it already has. It can disable or delete them, but can't create or re-enable them.

**Remove, don't reject.** For AI agents connected over MCP, tools the plan doesn't include are removed from the session's tool registry rather than returning a permission error. An agent that can't see a tool doesn't keep trying it.

## Defaults are a security decision

A missing entitlement resolves to the *restrictive* value, with exceptions where restriction would itself be harmful. An unresolved plan falls back to the lowest tier's capabilities plus a visible "plan not resolved" banner. Forwarding purchase events to a merchant's ad account is off unless explicitly granted, because it writes into their real ad spend and can't be retracted.

And one bug earned a warning in the docs in bold: **never send `null` as a filler for a quota.** In this system `null` means unmetered. A lookup failure once turned into unlimited admin builds. The fix is a rule, not a patch: "unknown" and "unlimited" must never share a representation.

## What I'd carry to any billing system

Separate what a customer is *allowed* to do from *why*. Make failure modes degrade toward "the shop keeps selling", not toward "the shop goes dark". Write the invariants down as a list of things that must stay true, and treat any change that breaks one as a bug.
