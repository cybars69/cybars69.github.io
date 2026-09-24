---
title: "White-label LMS"
blurb: "A learning platform with courses, pathways and quizzes, deployed once per customer on Cloudflare Workers with its own database."
era: recent
order: 6
image: /images/projects/lms-platform.png
alt: "Diagram: learner, portal, Worker plus D1, quiz engine, with single session, pathways and certificates"
tags: [Cloudflare Workers, D1, Better Auth]
kind: "Client work · anonymized"
featured: false
---

A learning platform for organisations that want their own branded course and test-series product. The catalogue covers courses, bundled pathways, quizzes, enrolments, certificates, orders and announcements.

## One deployment per customer

Every customer gets their own Worker, D1 database, KV namespace and R2 bucket. Configuration lives in code and deploy variables, not in a shared multi-tenant database. It costs a checklist per customer, and in return one customer's data, load and mistakes can't touch another's.

## Deciding what to build

Before any code, I catalogued the features of an existing LMS product as a functionality and UX reference only, with nothing ported. Every row got a decision: **V1**, **fast-follow**, **defer** or **cut**. The V1 rows became an ordered, dependency-sorted task plan, and every architectural choice got a short ADR. That made scope arguments a matter of editing a table rather than re-litigating in chat.

## Details worth mentioning

- **Single-session enforcement** for learners: a new login revokes the previous session, and the old one lands on a login page with an explanation. Admins keep multi-device access.
- **Password strength meter** using zxcvbn with only the small translations module, avoiding roughly 800 KB gzipped of dictionaries for little practical gain.
- **Polymorphic pathways** that bundle courses and test series, modelled early so the schema didn't need to change later.

## Stack

Cloudflare Workers, D1, KV, R2, React, Better Auth, SQL migrations.

## Deep dives

- [Modelling quizzes: question types, manual grading and the attempt state you didn't know you needed](/blog/modelling-quizzes-question-types-and-attempt-states/)
