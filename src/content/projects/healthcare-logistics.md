---
title: "Healthcare supply platform"
blurb: "Portals for clinics, distributors and riders plus a patient mobile app, on one backend with tenant-scoped access and its own observability stack."
era: recent
order: 8
image: /images/projects/healthcare-logistics.png
alt: "Diagram: clinic, distributor, rider and patient app, with RBAC plus tenant scope and a Grafana, Loki and Prometheus stack"
tags: [FastAPI, React Native, RBAC, Observability]
kind: "Client work · anonymized"
featured: false
---

A platform that moves medicine and appointments through a healthcare supply chain: clinics order, distributors fulfil, riders deliver, and a patient app lets people order medicines and book teleconsultations or in-person visits.

## One identity, many portals

Authentication is shared across every surface. Access tokens are JWTs, refresh tokens live in the database, and every route is checked against **portal access, role-based permissions and tenant scope**. One person can belong to several clinics and several distributors, and use several portals, without duplicate accounts.

## The patient app

A React Native app for signed-in patients to order medicines and book appointments. The operator side is deliberately small: three focused admin consoles for e-commerce operations, prescription review (pharmacists verify or escalate, interns contact patients and adjust or reject orders from a mobile-first workspace), and appointment disputes. Anything lab-shaped stays visible but marked "coming soon", and upsells that would blur the scope were explicitly excluded.

## Observability, kept separate

Logs and metrics run as their own stack: Grafana, Loki, Promtail, Prometheus, cAdvisor and node exporter, in a separate compose file from the application, with a provisioned host dashboard. When the app is on fire, the tooling to look at the fire shouldn't be in the same building.

## Documents with an authority order

The project accumulated dated context notes over months. A README states the order of authority when they conflict, and old notes mark superseded decisions as redacted instead of silently contradicting the new ones.

## Stack

Python, FastAPI, SQL migrations, React Native, Docker, Nginx, Grafana, Loki, Prometheus.

## Deep dives

- [OTP login, refresh-token families and three layers of access](/blog/otp-auth-for-multi-tenant-portals/)
- [Observability that lives outside the app stack](/blog/observability-outside-the-app-stack/)
