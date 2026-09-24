---
title: "OTP login, refresh-token families and three layers of access for multi-tenant portals"
description: "One identity system for patients, clinic staff, distributors and admins: challenge-based OTP in Redis, rotating refresh tokens, and access that is checked in three separate layers."
date: 2026-09-24
tags: [Auth, FastAPI, Redis, Security, RBAC]
---

A supply-chain platform for healthcare has several kinds of people: patients, clinic staff, distributor staff, and internal admins. Some belong to more than one clinic, some to more than one distributor, and a few hold several roles at once. One login system had to serve all of them, on web portals and a mobile app.

## Identity is the hard part

Before any token exists, the rules about *who a person is* have to be strict:

- Phone numbers are unique. Emails are unique, and normalised before storage.
- Admin provisioning **reuses** an existing user instead of creating a duplicate.
- Create and update flows reject **split-identity conflicts**: a phone number that points at one user and an email that points at another.

Everything downstream, including tenant membership and audit trails, assumes that a human is one row. Google sign-in follows the same rules and, importantly, is a sign-in path for an already-known user, never a signup. It matches on normalised phone or email, and if nothing matches, login is rejected.

## OTP as a challenge, not a code

The main login is a one-time password by SMS. The design point is that the server issues a **challenge**, not just a code:

```text
POST /auth/otp/request   { phone }                       -> { challenge_id }
POST /auth/otp/verify    { challenge_id, otp }           -> { access_token, refresh_token }
POST /auth/refresh       { refresh_token }               -> rotated pair
POST /auth/logout
```

The phone number is normalised to E.164 first. The challenge ID is opaque, and the challenge is:

- **purpose-bound**: usable only for the action it was created for, on the account it was created for;
- **single-use**: a successful resend invalidates the previous challenge;
- backed by Redis with its rate limits and lockouts.

The limits are worth listing, because they are the actual security control:

| Rule | Value |
|---|---|
| Code lifetime | 5 minutes |
| Resend cooldown | 60 seconds |
| Sends per destination | 7 per rolling hour, plus extra hourly network and account limits |
| Wrong attempts | 5, then the challenge is invalidated and the purpose and destination scope is locked for 15 minutes |

These are enforced **atomically in Redis**. Client-side countdowns are informational only. Atomicity matters because a naive read-then-increment lets a parallel burst of guesses slip past the counter.

Two guardrails I liked: staging and production **refuse to start** if development OTP logging is enabled, and the console SMS provider, which writes the full message body to logs, is rejected by default unless an administrator explicitly opts in with two separate flags. Safe misconfiguration should require effort.

## Tokens

The **access token** is a JWT that carries the claims authorisation needs:

```text
sub, role, rbac_roles, typ=access, exp, iat,
clinic_id?, distributor_id?, distributor_role?   <- the active tenant context
```

The **refresh token** is a random opaque value. The raw token goes to the client and only its **SHA-256 hash** is stored, so a database leak doesn't leak usable sessions. Refresh **rotates** the token, and a revoked refresh token invalidates its whole family, which is what stops a stolen token from being quietly reused after the legitimate client has already rotated.

## Three layers of access

Authorisation is deliberately not one field. It is three questions asked in order:

1. **Portal access.** `role` is an additive list of broad surfaces a person may enter, such as `['patient']` or `['admin', 'clinic', 'distributor']`.
2. **Fine-grained roles.** `rbac_roles` carries values like `clinic:receptionist`, `clinic:pharmacist` and `distributor:user`. Some roles are valid domain data without unlocking a portal in the current phase, and admin is global rather than tenant-scoped.
3. **Tenant membership and active context.** Portal access is not enough for a clinic action. The backend also resolves which clinics and distributors the person belongs to, and which one is *active for this request*.

That third layer is what makes "one user, many clinics" safe. Each route is checked with FastAPI dependencies:

```python
get_current_user                    # who is this?
require_role(...)                   # may they enter this portal?
require_rbac_role(...)              # do they hold this fine-grained role?
verify_clinic_assignment(...)       # are they a member of THIS clinic, right now?
```

The older single `preset_role` field survives only as a backward-compatible projection. It is not the source of authorisation truth, and treating it as one is exactly the kind of bug the layered design prevents.

## Takeaways

- Fix identity rules before writing login code.
- Model OTP as a **purpose-bound, single-use challenge** with server-enforced limits.
- Store **hashes** of refresh tokens, rotate them, and revoke by family.
- Keep "which surface", "which role" and "which tenant" as three separate checks.
