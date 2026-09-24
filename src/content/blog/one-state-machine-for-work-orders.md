---
title: "One state machine for work orders: deleting the workflow"
description: "A print shop's order system with a single three-state task machine, an atomic pickup, a delivery gate and a signed customer ledger."
date: 2026-09-24
tags: [Data modelling, PostgreSQL, Architecture, RBAC]
---

The first version of a work-order system for a print shop modelled the full production workflow: stages, assignments, quality control, finishing, dispatch, installation. The rewrite removed almost all of it. What replaced it is small enough to describe completely.

## The whole model

A **work order** is one job: order number, customer, a details block, the departments Sales selected, and flags for installation, transport and repair. Its overall status is `active`, `completed` or `cancelled`.

Each selected department produces a **department task**, and `department_tasks` is the *only* operational state machine:

```text
Pending  --Start (by a worker)-->  Started  --Finish (same worker)-->  Completed
```

A pending task has no owner. There are no assignee fields, suggestions, transfers, load-balancing, auto-assignment or manager approvals, and that absence is the feature: workers pick up work themselves.

## The one write that matters

`picked_up_by` is written only by the atomic **Start** action. Two workers tapping Start at the same moment is the one real concurrency problem in the system, and the correct answer is a conditional update:

```sql
UPDATE department_tasks
   SET status = 'started', picked_up_by = $1
 WHERE id = $2 AND status = 'pending'
RETURNING *;
```

That is a sketch of the idea, not a copy of the code. If it returns no row, someone else got there first and the second worker's UI refreshes. No locks, no queue, no optimistic-version column: the `WHERE status = 'pending'` clause *is* the lock.

Admins can release a started task back to pending, complete one as an override, or reopen a completed one. Every transition is audited.

## The delivery gate

Delivery is just another task with one special rule. It exists from the start, but it has no `available_at` until every production task Sales selected is complete. **Design does not gate delivery.** The work order is done when every task, including delivery, is done.

Modelling a gate as "this task's availability timestamp is null until X" keeps it in data, so it shows up in the same queue queries as everything else, rather than needing a special code path.

## People without a role zoo

Access follows the same minimalism:

- `admin` is a separate security privilege.
- Every other database role is normalised to `worker`.
- Sales access, accounts access and queue access all come from **department membership**, a many-to-many `user_departments` table.

```text
users 1 --- many user_departments many --- 1 departments
```

One person can be in Sales, Accounts and two production queues at the same time. An old text column for department remains only so a migration can read legacy data.

There is a bug worth recording here because it is so easy to write. A boot-time migration used the legacy roles table to decide who to demote to `worker`. Admin had a legacy `kind` of `manager`, so **admins were demoted on every boot**. The fix was to exclude admin explicitly. The lesson is that migrations that run on every boot must be idempotent *and* must be tested against the roles you already have.

## A ledger of signed entries

Money is a `customer_ledger_entries` table of signed amounts:

| Entry | Sign |
|---|---|
| opening balance | signed debit or credit |
| invoice | positive (debit), synchronised with the work order's invoice |
| payment | negative (credit) |
| adjustment | signed |

A customer's balance is simply **the sum of their entries across all their work orders**. Quote changes never post to the ledger, because a quote is a promise, not a debt. There is no stored balance to drift out of sync.

## Legacy data, handled honestly

Old orders, line items and workflow records became migration sources only. Active records that were *ambiguous* were excluded rather than guessed at: a generic "production" step can't safely identify which print department owns it. Completed and cancelled records stayed as immutable history. Refusing to migrate what you can't interpret is more responsible than migrating it wrongly.

## Takeaways

- The best simplification is deleting a state machine.
- Concurrency control can be a `WHERE` clause.
- Represent gates as data (`available_at`), not code.
- Ledgers are sums, not balances.
