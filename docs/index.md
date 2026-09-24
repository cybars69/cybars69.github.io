# Arsalan Sheikh (cybars69)

Arsalan Sheikh (cybars69) is a full-stack engineer from Kashmir. Platforms, AI agents, integrations and automation, plus open-source agent skills and the odd generative-art experiment.

Source: https://cybars69.github.io/


## About

Location: Kashmir

I’m a full-stack engineer from Kashmir who likes owning the whole thing: the API, the integrations, the deployment, and the interface people actually touch.

Most recently I was lead engineer and architect at a small studio, where I built a stays marketplace for a remote valley, a white-label commerce platform that AI agents can operate over MCP, and conversational booking agents on WhatsApp. Before that: distributed data pipelines on AWS Lambda, and real-time transcription and contact-centre integrations at Kore.ai.

I studied Electrical Engineering at IIT Hyderabad. On the side I write open-source agent skills, scrape things, and make generative art.

Résumé: https://cybars69.github.io/resumes/Arsalan_Sheikh-Resume.pdf

## Experience

### Qudelta Studios, Lead Engineer & Software Architect (part-time) (May 2025 – Sep 2026)

- Built a stays marketplace for a remote valley end to end: customer Next.js app, merchant PWA and admin, on a FastAPI and PostgreSQL backend. Booking state transitions, webhook-driven payments, iCal sync and swappable payment, payout, SMS and search providers. Launched in 2026 with live traffic.
- Built a multi-agent booking and discovery assistant with Gemini and Google ADK and 15+ database-backed tools, and a separate framework-free WhatsApp booking agent.
- Architected a multi-tenant, white-label commerce platform with per-store Workers, signed entitlements, MCP and OAuth for AI agents, and a zero-touch provisioning engine.
- Automated Twilio sub-account, WhatsApp Business and Chatwoot setup, turning a manual checklist into a workflow.

### Airnguru, Backend Developer (contract) (Apr 2024 – Jun 2025)

- Replaced a monolithic batch job with distributed AWS Lambda workers: 170 s down to 40 s, with SQS dead-letter retries and 99.9 percent pipeline success.
- Ingestion of 500K+ rows a day with validation and backpressure; Aurora queries 45 percent faster; a BigQuery process cut from 10 GB to 800 MB of memory.
- Won the Passion for Excellence award (Feb 2025).

### Kore.ai, Associate Software Engineer (Jun 2023 – Apr 2024)

- Part of a production streaming transcription pipeline that cut end-to-end latency from about 10 seconds to under 1 second.
- FastAPI and Express middleware for Salesforce, Genesys, Talkdesk and NICE CXone, with retries and circuit breakers. Shining Start and Spotlight awards.

### IIT Hyderabad, Office of Career Services, Backend Developer → Technology Team Lead (part-time) (May 2021 – Mar 2023)

- Built and maintained the placement platform, later leading technical work and releases, mentoring junior developers and reviewing code.

### Mable.ai, SuperPe & Samsung R&D, Software engineering internships (May 2022 – May 2023)

- REST APIs, Django and MongoDB services, automation, data-integrity checks, metrics pipelines and CI-integrated developer tooling.

### IIT Hyderabad (Aug 2019 – Apr 2023)

B.Tech, Electrical Engineering and Engineering Science

## Skills

- **Product engineering:** Python, FastAPI, Node.js, TypeScript, React, Next.js, Hono, Astro, PostgreSQL, MySQL, MongoDB, WebSockets
- **AI & agents:** Gemini, Claude, Google ADK, Tool calling, MCP, RAG, Structured outputs, Evals, Agent Skills
- **Platforms & integrations:** Twilio, WhatsApp Business, Chatwoot, Stripe, Razorpay, Webhooks, OAuth, iCal, Google Sheets API
- **Distributed systems:** RabbitMQ, SQS, Redis, Event-driven design, Retries & DLQs, Circuit breakers
- **Cloud & infra:** AWS, GCP, Cloudflare Workers, D1, KV, R2, Docker, Nginx, GitHub Actions, Linux
- **Observability:** Grafana, Loki, Prometheus
- **Search & discoverability:** SEO, GEO / AEO, Search Console, JSON-LD, llms.txt
- **Leadership:** Architecture, Scoping, ADRs, Code review, Mentoring

## Selected work

- [aeo-skills](https://cybars69.github.io/projects/aeo-skills/): Open-source agent skills that audit, rewrite and monitor whether answer engines can extract a clean answer from your pages.
- [Nonslop Sidebar](https://cybars69.github.io/projects/nonslop-sidebar/): A UX-first sidebar navigation skill for AI coding agents. Accessible, responsive, and actually usable.
- [White-label commerce platform](https://cybars69.github.io/projects/commerce-platform/): A multi-tenant storefront platform where every store gets its own Worker, plans are signed entitlements, and AI agents can run the shop over MCP.
- [WhatsApp booking agent](https://cybars69.github.io/projects/booking-agent/): A multi-tenant chatbot that answers customers and takes bookings on WhatsApp, rebuilt from a framework-heavy agent into plain Python and raw API calls.

## Latest posts

- [A GEO audit is a checklist, not a ranking model](https://cybars69.github.io/blog/geo-audit-checklist-not-ranking-model/): What an audit of a young marketing site found, and why fixing every point on the checklist still wouldn't have moved it off page six.
- [A shop on a key-value store: index arrays, immutable Stripe prices and what you give up](https://cybars69.github.io/blog/a-shop-on-a-key-value-store/): Modelling products and collections in Workers KV, syncing them to Stripe without breaking history, and the reliability limits of a store with no queries.
- [Demo mode as signed config, not a fork](https://cybars69.github.io/blog/demo-mode-as-signed-config/): Ephemeral public demo stores that can't send email, take payments or be crawled, driven by one flag in the same signed document as everything else.
- [Direct-to-R2 uploads with presigned PUTs: presign, PUT, confirm](https://cybars69.github.io/blog/presigned-uploads-to-r2/): Files go from the browser straight to object storage. The server issues a URL, then trusts nothing until the client confirms.
- [Dropping the agent framework](https://cybars69.github.io/blog/dropping-the-agent-framework/): Rebuilding a multi-tenant WhatsApp chatbot with a cheap classifier, a plain router and raw API calls instead of an agent framework.

## Elsewhere

- [Linkedin](https://www.linkedin.com/in/arsalan-a-sheikh/)
- [Github](https://github.com/cybars69/)
- [Email](mailto:sheikharsalan7222+cybars69gh@gmail.com)
