# iCal is not a channel manager: what ARI restrictions are and why a booking engine needs them

An audit of a stays marketplace against what a real online travel agency needs, and the availability, rates and inventory model behind it.

Source: https://cybars69.github.io/blog/ical-is-not-a-channel-manager/


Published: 2026-09-24
Tags: Marketplaces, Data modelling, Booking systems, Audits

When I built a stays marketplace for a remote valley in Kashmir, hosts needed a way to keep availability in sync with the calendars they already used. iCal feeds were the quick answer and they do work. But an audit I ran against "what a proper online travel agency (OTA) needs" made the limits very clear, and the gap list is a useful map of the domain.

## What the platform did well

Around 150 endpoints across six domains: auth, customer, merchant, admin, one webhook and one iCal feed. Supply was strong (properties, room types, rate plans, availability, cancellation policy). Demand was strong (search, quotes, bookings, payments). Operations were strong (approvals, refunds, payouts, disputes, audit logs). Availability was **block-based**, at property, room-type and room-number scope.

## What iCal actually carries

An iCal feed is a list of busy time ranges. It tells another system *when a room is taken*. It does not carry:

- **prices** or rate plans,
- **restrictions** of any kind,
- **modifications** to an existing reservation, or
- a way to **reconcile** what each side thinks happened.

That makes it fine for "don't double-book this room across two calendars" and useless for distribution, where a partner needs to know prices and rules per night, and needs to be told when they change.

## ARI: availability, rates, inventory

Channel managers exchange **ARI** (availability, rates and inventory) with per-night data. The audit's biggest finding was that the restriction layer was missing entirely. The terms are worth knowing:

| Restriction | Meaning |
|---|---|
| **CTA** (closed to arrival) | Guests can stay *through* this night but cannot *arrive* on it |
| **CTD** (closed to departure) | The mirror image, for the last night |
| **Stop-sell** | Not bookable at all, without changing the underlying availability count |
| **Min / max length of stay** | Bounds on the number of nights, per arrival date |
| **Release period** | A cut-off: no bookings within N days of arrival |
| **Per-channel overrides** | Different rules and prices for different distribution partners |
| **Derived rates** | A rate defined as an adjustment on another (for example breakfast-included is base plus a fixed amount) |

A sketch of where they live in a data model, keyed by room type and date rather than stored on the booking:

```sql
CREATE TABLE ari_restrictions (
  room_type_id  uuid NOT NULL,
  night         date NOT NULL,
  channel_id    uuid,            -- NULL = applies to all channels
  stop_sell     boolean NOT NULL DEFAULT false,
  closed_to_arrival    boolean NOT NULL DEFAULT false,
  closed_to_departure  boolean NOT NULL DEFAULT false,
  min_los       smallint,
  max_los       smallint,
  release_days  smallint,
  PRIMARY KEY (room_type_id, night, channel_id)
);
```

The important design choice is that restrictions are **per night and per channel**, and the booking engine evaluates them at quote time, not just at confirmation. Bulk *delta* pushes (only what changed) then keep partners current without resending the calendar.

## The booking lifecycle had holes too

The core flow was quote, payment, confirmation. A real OTA also needs:

- **amendments** (change dates or guests),
- **partial cancellation**,
- **no-show** and **early departure or extension** handling,
- **invoices and receipts** (there was no endpoint to download one),
- and **reconciliation artefacts** for merchants.

None of those are exotic. They are what happens on day three of a real guest's stay.

## Other gaps the audit named

Dynamic or demand-based pricing (rules were static), no overbooking protection documented, no consistent error-code taxonomy or rate limiting on the API, no customer-side review creation (only merchant moderation), single-currency assumptions, and a reports page that was a stub. Writing them next to the strengths kept the conversation about launch scope honest.

## What I took from it

- Treat **iCal as a safety net for double-booking**, not as distribution.
- Model restrictions as **per-night, per-channel data**.
- Audit against the domain's actual lifecycle, not against your own feature list.
- Say what the platform is *not* yet: the audit's most valuable line was a percentage, and it was not flattering.
