---
title: "Observability that lives outside the app stack"
description: "Grafana, Loki, Promtail, Prometheus, cAdvisor and node_exporter as their own compose stack, joined to the app only by a shared network."
date: 2026-09-24
tags: [Observability, Docker, Grafana, Prometheus, Loki]
---

When an application is unhealthy, the tools you use to look at it should not share its fate. So the observability stack for a production platform lives in **its own compose file**, deployed and restarted independently of the app.

## Two stacks, one network

The application compose file runs the backend API, a migration container, an inventory worker, Redis and RabbitMQ. A second compose file runs everything for observability:

```text
docker-compose.yaml                 backend, migrations, worker, Redis, RabbitMQ
docker-compose.observability.yaml   Grafana, Loki, Promtail, Prometheus, cAdvisor, node_exporter
```

They are joined by a single **external Docker network**. The app stack creates it, so the order matters: bring the app up first.

```bash
docker compose --env-file .env.production up -d --build

cp .env.observability.example .env.observability
# set at minimum GRAFANA_ADMIN_USER and GRAFANA_ADMIN_PASSWORD

docker compose -f docker-compose.observability.yaml --env-file .env.observability up -d
```

## Who does what

```text
Docker containers      -> Promtail  -> Loki        -> Grafana
Host + containers      -> node_exporter / cAdvisor -> Prometheus -> Grafana
```

- **Promtail** discovers containers through the Docker socket, attaches metadata as labels (`container`, `container_id`, `compose_service`, `compose_project`) and pushes to Loki.
- **Loki** stores logs and is Grafana's log datasource. Because the labels come from Compose metadata, you can filter by service without any application changes.
- **cAdvisor** exposes per-container CPU, memory and filesystem metrics.
- **node_exporter** exposes host CPU, memory, disk, network and, when the host publishes them, temperature sensors.
- **Prometheus** scrapes those two exporters and is available directly for PromQL debugging.
- **Grafana** is the only UI. Datasources and a `Server Overview` dashboard are **provisioned from files**, so a fresh server comes up with the same views as the last one.

## Default to closed

Every observability service binds to `127.0.0.1` by default: Grafana on one port, Prometheus and Loki on others. Only **Grafana** is meant to be reverse-proxied through Nginx. The browser talks to Grafana, Grafana talks to Prometheus and Loki over the internal network, and neither of those two is on a public route unless someone deliberately exposes it later. It is the kind of default that costs nothing and prevents an embarrassing incident.

## Being honest about coverage

The most useful section of the runbook is the list of things the stack does **not** do yet:

- the backend doesn't expose a real Prometheus `/metrics` endpoint,
- nothing scrapes the backend's health route,
- there's no synthetic uptime probe,
- there are no request-latency histograms, business metrics or alert routing.

So the coverage today is host metrics, container metrics and centralised Docker logs. That is a deliberately narrow first slice, and writing the gaps down does two jobs: it stops anyone assuming a dashboard means the app is being watched, and it becomes the backlog.

One operational gotcha is documented too: cAdvisor depends on the host's Docker storage layout. On a host that doesn't use the default data directory you must set it explicitly, and on newer containerd snapshotter layouts cAdvisor can be noisier or less complete than node_exporter. A tool that is right about hosts but only *mostly* right about containers is worth knowing about before an incident, not during one.

## Takeaways

- Separate the watchers from the watched, and connect them with a network, not a compose file.
- Provision dashboards and datasources from files.
- Bind to localhost, expose one UI.
- Write down what your monitoring **can't** see.
