---
title: "Billing tracker"
blurb: "An internal tool for clients, projects, invoices and a small ledger, with dashboards and branded exports for accountants."
era: recent
order: 12
image: /images/projects/billing-tracker.png
alt: "Diagram: clients, projects, invoices, ledger, reports, exported as PDF, DOCX, XLSX and CSV"
tags: [FastAPI, React, Reporting]
kind: "Internal tool · anonymized"
featured: false
---

A small internal system for running a studio's billing: who we work for, what we're billing them for, what's been paid, and what needs to go to the accountant.

## Scope

- **Clients and projects**, linked, with rate metadata for billing context.
- **Invoices** with auto-generated numbers, tax computation and a status flow: draft, sent, partially paid, paid, overdue. Marking one paid creates the ledger entries.
- **A ledger** of accounts and debit and credit movements tied to billing events.
- **A dashboard:** outstanding total, overdue total, billed and collected this month, top unpaid clients, and invoices due in the next seven days.

## Exports

The most useful feature was the accountant pack: one export that produces branded PDF, DOCX, XLSX and CSV (with structured metadata and totals) so month-end is a download instead of an afternoon. Invoice reports export the same four ways.

## Stack

Python, FastAPI, SQL migrations, React.
