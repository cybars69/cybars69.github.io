---
title: "The control-plane seam: idempotent usage snapshots, an event outbox and HMAC commands"
description: "How a per-tenant Worker and a central control plane talk to each other safely over unreliable networks, with no queue infrastructure."
date: 2026-09-24
tags: [Architecture, Cloudflare Workers, Idempotency, Security]
---

A per-store Worker and a central control plane have to exchange three kinds of message: **usage** flowing up, **lifecycle events** flowing up, and **commands** flowing down. Each has a different failure profile, and each got a different design. None of them needs a message broker.

## Usage: send the whole period, every hour

A cron trigger runs hourly in each store. It computes usage for the current billing period and POSTs it to the control plane. The important rule is that **every push is a full snapshot of the period, never an incremental delta**, keyed by a period key:

```json
{
  "tenantId": "<store id>",
  "periodKey": "billing_anchor:2026-07-01T00:00:00.000Z",
  "period": { "startsAt": "2026-07-01T00:00:00.000Z", "endsAt": "2026-08-01T00:00:00.000Z", "cadence": "monthly" },
  "metrics": {
    "ordersCreated": 412,
    "activeStaffSeats": 3,
    "builds": { "admin": 2, "platform": 7, "orchestrator": 1 },
    "activeMcpConnections": 4
  },
  "generatedAt": "2026-07-28T06:00:00.000Z"
}
```

The control plane upserts on `(tenantId, periodKey)`. That makes the semantics simple: ingesting the same report twice, or missing five and receiving the sixth, produces the same stored state. There is **no local retry queue**. A failed push is logged, and the next hourly run recomputes and resends. Idempotency by construction beats retry machinery.

Two details in the metrics are deliberate:

- **Builds are split by trigger source.** Only admin-triggered builds may be metered or billed. Builds caused by the platform's own content cascades, or by the operator's rollouts and migrations, are the operator's cost of doing business.
- **`activeStaffSeats` excludes suspended seats**, so it is the number to validate a downgrade against.

## Events: an outbox in the tenant's own database

Lifecycle milestones (store published, first product, first order, payment provider connected) need at-least-once delivery. The store writes them to a local `lifecycle_events` table first, deduplicated on a `dedupeKey`. The hourly job then delivers up to 50 undelivered rows per run:

```text
write event  ->  outbox (deduped on dedupeKey)  ->  hourly POST  ->  2xx? mark delivered
                                                              \-> otherwise attempts++, retry next hour
```

The receiver treats `id` and `dedupeKey` as idempotency keys. Milestones are detected by scanning current state on the cron rather than by hooks in every code path, so `occurredAt` is accurate to within an hour. That is plenty for activation tracking, and it would be the wrong tool for a real-time trigger. Knowing what a mechanism is *not* for is part of the design.

## Commands: HMAC with a replay guard

Anything the control plane asks a store to do is authenticated with a shared secret and three headers:

```text
x-timestamp:  unix seconds, accepted within +/- 300 s
x-nonce:      16-128 chars, base64url, remembered in KV for 600 s
x-signature:  base64url(HMAC-SHA256(secret, "{timestamp}.{nonce}.{rawBody}"))
```

The signature covers the timestamp, the nonce **and the raw body bytes**. The timestamp window bounds how long a captured request is replayable, and the nonce cache closes the window entirely. The nonce is remembered for 600 seconds, which is exactly the full width of the accepted window (300 seconds either side), so a request can never outlive its own replay guard. A sketch of the verification:

```ts
const skew = Math.abs(Date.now() / 1000 - Number(timestamp));
if (skew > 300) return reject('stale');
if (await KV.get(`nonce:${nonce}`)) return reject('replay');
const expected = await hmacSha256(secret, `${timestamp}.${nonce}.${rawBody}`);
if (!timingSafeEqual(expected, signature)) return reject('bad signature');
await KV.put(`nonce:${nonce}`, '1', { expirationTtl: 600 });
```

The build-status callback is the one command that changes what a storefront serves, and it is built to be safe to repeat: replaying the same status returns `{ ok: true, replay: true }`, transitions are validated, and the `active` status atomically supersedes the previous build and flips the theme pointer. It **swaps, never takes the store down**. The source download for a build uses a one-time token that is stored hashed and expires.

## What the store refuses to decide

A short table on the contract page turned out to be the most useful part:

| Decision | Who makes it |
|---|---|
| Plan definitions and prices | The control plane, as signed entitlements |
| Trial state and expiry | Nobody. There are no trials, only ephemeral demos |
| Billing, dunning, overage invoicing | The control plane, from usage reports. The store shows a *projected* overage figure for display only |
| Custom domains and certificates | The control plane, which passes the active hostname list down |
| Merchant lifecycle email | The control plane. The store only sends shopper-facing mail |

Writing "the platform explicitly does not decide this" as a table is a cheap way to prevent a decade of accidental coupling.

## Takeaways

- Prefer **full-state, keyed upserts** over deltas when the network is unreliable.
- An **outbox in the sender's own database** gives at-least-once delivery without a broker.
- HMAC signs *timestamp, nonce and body*; the nonce store must outlive the timestamp window.
- Make state-changing commands idempotent, and make the important one a **swap**.
