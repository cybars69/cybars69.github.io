---
title: "Work-order board"
blurb: "A deliberately minimal order system for a print shop. One work order, shared tasks, and workers who pick things up themselves."
era: recent
order: 9
image: /images/projects/work-order-board.png
alt: "Diagram: sales, work order, design and print tasks, delivery, with self pickup, activity feed and uploads"
tags: [React, Hono, Cloudflare Workers, PostgreSQL]
kind: "Client work · anonymized"
featured: false
---

Most order-management software adds stages, managers and assignment rules. This one removes them.

**The whole model:** Sales creates one work order. Design and the selected print departments each receive a shared task. Workers pick tasks up themselves. Delivery appears once every selected print task is complete. There is no stage workflow, no manager tier, no auto-assignment and no assigning to a named person.

That restraint is the product. The print shop already knows who does what, and software that second-guesses them gets ignored.

## Under the hood

- **Frontend:** React 19, TypeScript, Vite, Ant Design, TanStack Query and React Router.
- **Backend:** Hono on Cloudflare Workers, PostgreSQL through a connection pool, files on R2 via presigned URLs.
- **Access:** JWT auth with a central permissions hook; default system roles resolve to permissions in one place so the UI and API agree.
- **Around each order:** comments, an activity trail, file uploads and a feedback loop.

I kept a small folder of short architecture, data-model and UI-pattern notes next to the code so a fresh session, human or agent, could pick the project up quickly.

## Stack

React, TypeScript, Ant Design, Hono, Cloudflare Workers, PostgreSQL, R2.

## Deep dives

- [One state machine for work orders](/blog/one-state-machine-for-work-orders/)
- [Direct-to-R2 uploads with presigned PUTs](/blog/presigned-uploads-to-r2/)
