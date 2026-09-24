# Signed entitlements over KV: Ed25519, a five-step fallback chain, and a document that can only narrow

How a store Worker learns what it may do without ever learning what a plan is called, and why every failure path resolves to the shop still selling.

Source: https://cybars69.github.io/blog/signed-entitlements-over-kv/


Published: 2026-09-24
Tags: Cloudflare Workers, Cryptography, Multi-tenant, Architecture

In [plans that never block checkout](https://cybars69.github.io/blog/plans-that-never-block-checkout/) I described the principle. This post is the mechanism: what the signed document looks like, how a store verifies it, and what happens at every step when something goes wrong.

The setup: one Worker per store, plus a separate control plane that owns tenants and billing. The control plane needs to tell each store what it is allowed to do. The store must never need to know why.

## The envelope

The control plane writes one key per tenant into the store's KV namespace. The value is a small envelope:

```json
{ "payload": "<base64url(JSON bytes)>", "signature": "<base64url(Ed25519 signature)>" }
```

The signature covers the **exact payload bytes**, not a re-serialised object. Signing a base64url string of the JSON bytes sidesteps the classic canonicalisation bug, where the signer and verifier disagree about key order or whitespace. The decoded payload:

```json
{
  "tenantId": "<must equal the store's own tenant id>",
  "version": 42,
  "issuedAt": "2026-07-28T00:00:00Z",
  "entitlements": { "segments": true, "staffSeatLimit": 8 },
  "demoMode": false
}
```

## Verifying at the edge

Workers ship WebCrypto with Ed25519, so verification needs no dependency. The store holds only the **raw 32-byte public key** as an environment value. A sketch of the check:

```ts
const key = await crypto.subtle.importKey('raw', publicKeyBytes, { name: 'Ed25519' }, false, ['verify']);
const ok = await crypto.subtle.verify('Ed25519', key, signatureBytes, payloadBytes);
if (!ok) return null;                      // ignored, never thrown
const doc = JSON.parse(new TextDecoder().decode(payloadBytes));
if (doc.tenantId !== TENANT_ID) return null; // a valid document for another store is still wrong
```

Two consequences matter. First, **write access to KV alone cannot grant anything**: without the private key, an attacker who can write the namespace can only produce documents that fail verification. Second, the `tenantId` check stops a valid document for store A being copied into store B.

A document that fails to parse, fails verification or names the wrong tenant is *ignored*. Nothing throws, and resolution simply falls through to the next step.

## Versions only move forward

`version` is monotonically increasing per tenant. A verified document is persisted into the tenant's own database as the last-known-good copy only when its version is newer than what is already stored. That blocks replay of an old signed document, for example to undo a downgrade.

## A document that can only narrow

Before use, the payload is sanitised against the known keys:

- unknown keys are dropped,
- values of the wrong type are dropped,
- numeric limits must be non-negative **integers**.

Anything dropped falls back to the restrictive default. So a malformed or partial document can only ever *narrow* entitlements, never widen them.

The default itself has a precise definition. It used to be "no wider than the cheapest plan", which held only while that plan was the narrowest one. The test that replaced it is better: **would I grant this to a store I cannot identify?** The default row is reached exactly when the plan is missing, inactive or unreadable, which is precisely when you know least.

## The resolution chain

Every step keeps serving:

1. **In-isolate cache**, 45 second TTL.
2. **KV document**, verified, then persisted as last-known-good.
3. **Last-known-good** from the tenant's own database, which is strongly consistent and already on the read path.
4. **Bootstrap tier** synced at provisioning time, resolved through a built-in matrix. The unsellable open-source tier is deliberately not resolvable here.
5. **Restrictive default**, plus a flag that renders a visible "plan not resolved, contact support" banner in admin.

Checkout and the storefront never depend on which step won.

## Propagation is slow on purpose

KV is eventually consistent (about 60 seconds globally) and sits behind the 45 second cache, so a plan change shows up within roughly two minutes. That is fine by design. Upgrades that arrive late are harmless, and the downgrade policy is generous. Nothing in the model needs sub-minute propagation, which is exactly why KV is an acceptable transport.

## Adding a key: order of deployment matters

This one bites. Because the store sanitises *upward from the restrictive default*, a document that predates a new key resolves that key to its default. So a new entitlement must ship in the **control plane first**. Deploy the store first and every tenant silently narrows, with no error anywhere.

To keep both sides honest, each repository checks in the same `entitlement-matrix.json` fixture and asserts its own definitions against it, including an allowlist of the keys where the default is deliberately narrower than the cheapest plan. That allowlist is checked in both directions, so a stale exemption can't hide a real widening.

## What I'd reuse

- Sign **bytes**, not objects.
- Make "unknown" resolve to the safest behaviour that still lets the business run.
- Give every failure path a name in the chain, and log which step won.
- Treat deploy order as part of the interface when defaults are restrictive.
