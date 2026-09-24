# Tools

The languages, frameworks, platforms and practices I work with, and what each was used for.

Source: https://cybars69.github.io/tools/


## Backend & data

Where most of my time goes: services, pipelines and the databases behind them.

- **Python**: Services, pipelines, provisioning engines and scrapers. My default for anything server-side. (Kore.ai, Studio work, Open source)
- **FastAPI**: Marketplace, commerce, healthcare and booking-agent backends; OpenAPI-documented endpoints; enterprise middleware. (Kore.ai, Studio work)
- **Node.js & Express**: Middleware connecting contact-centre platforms, with retries and circuit breakers. (Kore.ai)
- **TypeScript**: Worker APIs, React apps and a storefront SDK and CLI. (Studio work)
- **Hono**: APIs on Cloudflare Workers: a free-tier storefront and a work-order board. (Studio work)
- **Django**: REST and MongoDB-backed services. (Internships)
- **PostgreSQL**: Primary database for the marketplace, commerce platform, booking agent and work-order board. (Studio work)
- **MySQL**: Interview practice tool and my earliest projects. (Internal tool, Early projects)
- **MongoDB**: Document store for internship services and early projects. (Internships, Early projects)
- **Redis**: OTP challenges with atomic rate limits and lockouts, plus caching. (Studio work, Airnguru)
- **SQLAlchemy**: ORM for the booking agent and the interview tool. (Studio work, Internal tool)
- **WebSockets & Socket.IO**: A streaming transcription pipeline, and real-time voice in the interview tool. (Kore.ai, Internal tool)

## AI & agents

Building things that call models, and things that models call.

- **Gemini**: Intent classification, structured extraction from websites, and multi-agent flows. (Studio work)
- **Claude**: Conversational handlers with tool loops, and day-to-day agentic coding. (Studio work)
- **Google ADK**: A multi-agent booking and discovery assistant with 15+ database-backed tools. (Studio work)
- **MCP**: Exposing commerce operations and clinic information to agents, with OAuth and plan-aware tool gating. (Studio work)
- **Agent Skills**: Authoring installable skills for coding agents. (Open source)
- **Tool calling & evals**: Tenant-scoped tool loops, and an eval runner as part of a rebuild plan. (Studio work)
- **Speech pipelines**: Speech-to-text and text-to-speech for real-time voice interviews. (Internal tool)

## Messaging, payments & integrations

The glue between platforms, which is most of what makes software useful.

- **Twilio**: A sub-account per business, WhatsApp senders and an automated account lifecycle. (Studio work)
- **WhatsApp Business**: Embedded signup, business account connection and sender setup. (Studio work)
- **Chatwoot**: Inboxes, agent bots, human handoff, SSO login links and automated provisioning. (Studio work)
- **Stripe**: Checkout sessions, product and price sync, and signed webhooks. (Studio work)
- **Razorpay**: Order creation, payment verification and webhooks for a stays marketplace. (Studio work)
- **Contact-centre APIs**: Salesforce, Genesys, Talkdesk and NICE CXone integrations. (Kore.ai)
- **Webhooks & OAuth**: HMAC-signed commands with replay guards, and OAuth for agent access. (Studio work)
- **iCal**: Availability feeds for calendar sync between a marketplace and its hosts. (Studio work)
- **Google Sheets API**: A lead pipeline through a service account, keeping attribution columns. (Studio work)
- **Server-side conversions**: Meta and GA4 server-side events, sent when a lead becomes revenue. (Studio work)

## Cloud & infrastructure

From Lambda fleets to one Worker per tenant.

- **AWS**: Lambda, SQS, DynamoDB, Aurora, Cognito, CloudFormation, WAF, CloudWatch, EC2 and S3. A batch job went from 170 s to 40 s on distributed Lambda workers. (Airnguru)
- **Google Cloud & BigQuery**: Redesigned a BigQuery process from 10 GB to 800 MB of memory. (Airnguru)
- **Cloudflare Workers, KV, D1, R2**: A Worker per store, signed config in KV, tenant databases in D1, uploads in R2. (Studio work)
- **Docker & Compose**: Application stacks, migration containers and workers. (Studio work, Internal tool)
- **Nginx & Certbot**: Reverse proxying and certificates inside a zero-touch provisioning engine. (Studio work)
- **RabbitMQ & SQS**: Queues, asynchronous routing and dead-letter retries. (Airnguru, Studio work)
- **GitHub Actions**: CI that validates docs structure, architecture layers and tests. (Open source, Studio work)
- **Linux**: Servers, shells and everything in between. (Everywhere)

## Observability

Kept separate from the application on purpose.

- **Grafana**: The single UI, with datasources and dashboards provisioned from files. (Studio work)
- **Loki & Promtail**: Centralised container logs, labelled from Compose metadata. (Studio work)
- **Prometheus**: Metrics from host and container exporters. (Studio work)
- **cAdvisor & node_exporter**: Container and host metrics: CPU, memory, disk, network and temperature. (Studio work)

## Frontend

Enough to ship the whole product, not to win design awards.

- **React**: Admin dashboards, merchant portals and the interview tool. (Studio work, Internal tool)
- **Next.js**: A customer-facing marketplace and storefronts. (Studio work)
- **React Native**: A patient mobile app for ordering medicines and booking appointments. (Studio work)
- **Astro**: This site, storefront themes and an agency marketing site. (This site, Studio work)
- **Vite**: Build tooling for most React apps. (Studio work)
- **Tailwind CSS**: Styling a storefront on Workers. (Studio work)
- **Ant Design**: The work-order board UI. (Studio work)
- **Mantine & Zustand**: UI and state for the interview tool. (Internal tool)
- **TanStack Query**: Data fetching and caching in the work-order board. (Studio work)
- **PWA**: An installable merchant app for hosts. (Studio work)
- **Bootstrap**: The layout of this site, unchanged since the first version. (This site)

## Search & discoverability

Making pages findable by people and by answer engines.

- **Search Console**: Measuring what actually earns clicks, and where pages compete with each other. (Studio work)
- **GEO & AEO audits**: Auditing pages for citation and answer extraction, and writing the tools to do it. (Open source, Studio work)
- **JSON-LD**: Structured data that matches the visible content. (This site, Studio work)
- **llms.txt**: A markdown index of a site for AI crawlers. (Open source, Studio work)

## Engineering practice

The habits around the tools.

- **ADRs**: A short decision record for each architectural choice, so scope arguments become edits. (Studio work)
- **Contract tests**: Shared fixtures asserted from both sides of a service boundary. (Studio work)
- **Docs as the system of record**: Short agent-readable maps, checked structure and graded quality per domain. (Open source, Studio work)
- **Claude Code & Cursor**: Agentic coding, audits and repo-level workflows. (Daily)
