---
title: "Two currencies, one invoice: keeping subscription billing and shopper commerce apart"
description: "A multi-tenant platform that bills merchants in one currency while their shoppers pay in another, and the bugs that appear when the two share a field."
date: 2026-09-24
tags: [Billing, Architecture, Payments, SaaS]
---

A platform that hosts stores has two completely separate money flows. The **merchant** pays the platform a subscription. The **shopper** pays the merchant for goods. They involve different people, providers and currencies, and the moment they share a field, a bug appears.

## The bug that named the problem

An audit of the merchant-facing admin found this: the store's usage panel formatted the plan's **overage price** using the store's *shopper settlement currency*. The entitlement contained no billing currency at all, so the admin guessed. A subscription billed in one currency could be labelled with a completely different one, purely because that is what the storefront sold in.

The fix wasn't a formatting tweak. It was to carry the **signed subscription currency** as its own value, and to render platform charges and overage with it, never with the shopper's currency.

## Two currencies, two lifecycles

| | Subscription (merchant to platform) | Settlement (shopper to merchant) |
|---|---|---|
| Set by | Billing country the merchant confirms | The merchant, **before activation** |
| Mutable? | Prices are immutable versions | **Immutable once activated** on a hosted store |
| Lives in | Control-plane price books | Control-plane row, then a deploy variable, then the store's database |
| Used for | Plan charges and overage | Product prices, checkout, refunds, taxes, reports |

The settlement currency is protected by a chain: the control-plane row is protected against later updates, every deployment publishes it as a default-currency variable, and the store **reconciles its database against it at boot** before serving. The admin, the REST API and the agent interface all expose it read-only on hosted stores, so there is no path that changes what a product's number means after orders exist. Self-hosted stores keep local control.

## Regional price books are versions

Prices used to be three independently editable totals with one global currency. The replacement is a set of **immutable, versioned price books** per market:

- each version records the market, the payment provider mapping and FX approval provenance;
- approved monetary versions cannot be edited, only superseded;
- a merchant's subscription **freezes the price version** they accepted, so a later price change can't alter what they were promised;
- publishing goes through draft, approve, schedule, publish and retire, with audited recovery.

Entitlements remain a separate concern, so a price change never silently changes what a plan *does*.

## Which provider, which market

The billing provider is chosen by an **explicitly confirmed billing country**, not by inference. The request's country header from the CDN is treated as a *suggestion only*: it pre-selects, and the merchant confirms. If the provider and country conflict, activation stops and requires reconfirmation. Guessing a person's billing jurisdiction from an IP address is how you charge the wrong entity in the wrong currency.

## The payment-safe boundary

The commercial policy is simple: **no mid-cycle upgrades, downgrades or proration.** A merchant schedules a change for the renewal boundary. The current plan stays active for the paid period, and the replacement starts only after the renewal payment succeeds, at the frozen price. There is no unused-time credit and no cancel-and-repurchase gap.

The interesting engineering is in *when* the new entitlements turn on. After a successful payment webhook, the system **retrieves the provider's subscription** to get the authoritative paid-period boundaries. If that lookup fails, the invoice is still reconciled and audited, but the target entitlement stays **unapplied**. It does not guess from the webhook's timestamp. Entitlements are activated only by evidence of a paid period, never by an event that merely implies one. And operator tools for retrying, reconciling or cancelling a plan change exist, but by design they **cannot activate entitlements**, only the payment evidence can.

## Takeaways

- Give every currency its own field, name and lifecycle.
- Make prices **immutable versions** and freeze the one a customer accepted.
- Treat country and locale hints as suggestions, and require confirmation.
- Activate paid features from *authoritative provider data*, and fail toward "not yet applied".
