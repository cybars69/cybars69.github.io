# Hospitality marketplace

A stays marketplace for a remote valley in Kashmir: search, booking, payments, payouts, and separate customer, merchant and admin apps.

Source: https://cybars69.github.io/projects/hospitality-marketplace/


Kind: Studio work · anonymized
Tags: Next.js, FastAPI, PostgreSQL, PWA

A curated stays marketplace for a remote valley in Kashmir. The goal was that it should not feel like a generic booking site. It should feel like a careful local travel advisor: inspiring enough to browse, practical enough to remove doubt, and structured enough to turn visitors into bookings or planning enquiries.

## Three apps, one backend

- **A customer marketplace** in Next.js: search by village, dates and guests, property detail, checkout.
- **A merchant PWA** for hosts: inventory, rates, availability, cancellation rules, payouts.
- **An admin system** for approvals, refunds, disputes and audit logs.

All three sit on one FastAPI and PostgreSQL backend with around 150 endpoints across six domains.

## The interesting parts

- **Booking state transitions.** A booking moves through explicit states, and payments are confirmed by webhook rather than trusted from the browser.
- **Inventory sync.** iCal feeds keep availability consistent with the channels hosts already use.
- **Configurable cancellation and refund rules**, so a host's policy is data rather than code.
- **Provider abstractions.** Payments, payouts, SMS and search sit behind interfaces, so a provider can change without rewriting business logic.

## Auditing it like a real OTA

Before launch I audited the platform against what an online travel agency needs. It was strong on supply, demand and operations, and weak on distribution: no channel manager mapping, incomplete restriction modelling (closed-to-arrival, min and max stay, stop-sell), no booking amendment flow. Writing that gap list down made the launch plan honest.

It launched in 2026 and receives live traffic.

## Stack

Next.js, React, FastAPI, PostgreSQL, iCal, webhooks, PWA.

## Deep dives

- [iCal is not a channel manager](https://cybars69.github.io/blog/ical-is-not-a-channel-manager/)
