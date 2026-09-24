// What I actually use, grouped by area. `use` says what for; `where` says in which context.
// Studio and client work is deliberately generic: see the anonymized project pages.

export type ToolItem = { name: string; use: string; where: string[]; href?: string };
export type ToolGroup = { id: string; title: string; intro: string; items: ToolItem[] };

const STUDIO = 'Studio work';

export const toolGroups: ToolGroup[] = [
  {
    id: 'backend',
    title: 'Backend & data',
    intro: 'Where most of my time goes: services, pipelines and the databases behind them.',
    items: [
      { name: 'Python', use: 'Services, pipelines, provisioning engines and scrapers. My default for anything server-side.', where: ['Kore.ai', STUDIO, 'Open source'] },
      { name: 'FastAPI', use: 'Marketplace, commerce, healthcare and booking-agent backends; OpenAPI-documented endpoints; enterprise middleware.', where: ['Kore.ai', STUDIO] },
      { name: 'Node.js & Express', use: 'Middleware connecting contact-centre platforms, with retries and circuit breakers.', where: ['Kore.ai'] },
      { name: 'TypeScript', use: 'Worker APIs, React apps and a storefront SDK and CLI.', where: [STUDIO] },
      { name: 'Hono', use: 'APIs on Cloudflare Workers: a free-tier storefront and a work-order board.', where: [STUDIO] },
      { name: 'Django', use: 'REST and MongoDB-backed services.', where: ['Internships'] },
      { name: 'PostgreSQL', use: 'Primary database for the marketplace, commerce platform, booking agent and work-order board.', where: [STUDIO] },
      { name: 'MySQL', use: 'Interview practice tool and my earliest projects.', where: ['Internal tool', 'Early projects'] },
      { name: 'MongoDB', use: 'Document store for internship services and early projects.', where: ['Internships', 'Early projects'] },
      { name: 'Redis', use: 'OTP challenges with atomic rate limits and lockouts, plus caching.', where: [STUDIO, 'Airnguru'] },
      { name: 'SQLAlchemy', use: 'ORM for the booking agent and the interview tool.', where: [STUDIO, 'Internal tool'] },
      { name: 'WebSockets & Socket.IO', use: 'A streaming transcription pipeline, and real-time voice in the interview tool.', where: ['Kore.ai', 'Internal tool'] },
    ],
  },
  {
    id: 'ai',
    title: 'AI & agents',
    intro: 'Building things that call models, and things that models call.',
    items: [
      { name: 'Gemini', use: 'Intent classification, structured extraction from websites, and multi-agent flows.', where: [STUDIO] },
      { name: 'Claude', use: 'Conversational handlers with tool loops, and day-to-day agentic coding.', where: [STUDIO] },
      { name: 'Google ADK', use: 'A multi-agent booking and discovery assistant with 15+ database-backed tools.', where: [STUDIO] },
      { name: 'MCP', use: 'Exposing commerce operations and clinic information to agents, with OAuth and plan-aware tool gating.', where: [STUDIO] },
      { name: 'Agent Skills', use: 'Authoring installable skills for coding agents.', where: ['Open source'], href: '/projects/aeo-skills/' },
      { name: 'Tool calling & evals', use: 'Tenant-scoped tool loops, and an eval runner as part of a rebuild plan.', where: [STUDIO] },
      { name: 'Speech pipelines', use: 'Speech-to-text and text-to-speech for real-time voice interviews.', where: ['Internal tool'] },
    ],
  },
  {
    id: 'integrations',
    title: 'Messaging, payments & integrations',
    intro: 'The glue between platforms, which is most of what makes software useful.',
    items: [
      { name: 'Twilio', use: 'A sub-account per business, WhatsApp senders and an automated account lifecycle.', where: [STUDIO] },
      { name: 'WhatsApp Business', use: 'Embedded signup, business account connection and sender setup.', where: [STUDIO] },
      { name: 'Chatwoot', use: 'Inboxes, agent bots, human handoff, SSO login links and automated provisioning.', where: [STUDIO] },
      { name: 'Stripe', use: 'Checkout sessions, product and price sync, and signed webhooks.', where: [STUDIO] },
      { name: 'Razorpay', use: 'Order creation, payment verification and webhooks for a stays marketplace.', where: [STUDIO] },
      { name: 'Contact-centre APIs', use: 'Salesforce, Genesys, Talkdesk and NICE CXone integrations.', where: ['Kore.ai'] },
      { name: 'Webhooks & OAuth', use: 'HMAC-signed commands with replay guards, and OAuth for agent access.', where: [STUDIO] },
      { name: 'iCal', use: 'Availability feeds for calendar sync between a marketplace and its hosts.', where: [STUDIO] },
      { name: 'Google Sheets API', use: 'A lead pipeline through a service account, keeping attribution columns.', where: [STUDIO] },
      { name: 'Server-side conversions', use: 'Meta and GA4 server-side events, sent when a lead becomes revenue.', where: [STUDIO] },
    ],
  },
  {
    id: 'infra',
    title: 'Cloud & infrastructure',
    intro: 'From Lambda fleets to one Worker per tenant.',
    items: [
      { name: 'AWS', use: 'Lambda, SQS, DynamoDB, Aurora, Cognito, CloudFormation, WAF, CloudWatch, EC2 and S3. A batch job went from 170 s to 40 s on distributed Lambda workers.', where: ['Airnguru'] },
      { name: 'Google Cloud & BigQuery', use: 'Redesigned a BigQuery process from 10 GB to 800 MB of memory.', where: ['Airnguru'] },
      { name: 'Cloudflare Workers, KV, D1, R2', use: 'A Worker per store, signed config in KV, tenant databases in D1, uploads in R2.', where: [STUDIO] },
      { name: 'Docker & Compose', use: 'Application stacks, migration containers and workers.', where: [STUDIO, 'Internal tool'] },
      { name: 'Nginx & Certbot', use: 'Reverse proxying and certificates inside a zero-touch provisioning engine.', where: [STUDIO] },
      { name: 'RabbitMQ & SQS', use: 'Queues, asynchronous routing and dead-letter retries.', where: ['Airnguru', STUDIO] },
      { name: 'GitHub Actions', use: 'CI that validates docs structure, architecture layers and tests.', where: ['Open source', STUDIO] },
      { name: 'Linux', use: 'Servers, shells and everything in between.', where: ['Everywhere'] },
    ],
  },
  {
    id: 'observability',
    title: 'Observability',
    intro: 'Kept separate from the application on purpose.',
    items: [
      { name: 'Grafana', use: 'The single UI, with datasources and dashboards provisioned from files.', where: [STUDIO] },
      { name: 'Loki & Promtail', use: 'Centralised container logs, labelled from Compose metadata.', where: [STUDIO] },
      { name: 'Prometheus', use: 'Metrics from host and container exporters.', where: [STUDIO] },
      { name: 'cAdvisor & node_exporter', use: 'Container and host metrics: CPU, memory, disk, network and temperature.', where: [STUDIO] },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    intro: 'Enough to ship the whole product, not to win design awards.',
    items: [
      { name: 'React', use: 'Admin dashboards, merchant portals and the interview tool.', where: [STUDIO, 'Internal tool'] },
      { name: 'Next.js', use: 'A customer-facing marketplace and storefronts.', where: [STUDIO] },
      { name: 'React Native', use: 'A patient mobile app for ordering medicines and booking appointments.', where: [STUDIO] },
      { name: 'Astro', use: 'This site, storefront themes and an agency marketing site.', where: ['This site', STUDIO] },
      { name: 'Vite', use: 'Build tooling for most React apps.', where: [STUDIO] },
      { name: 'Tailwind CSS', use: 'Styling a storefront on Workers.', where: [STUDIO] },
      { name: 'Ant Design', use: 'The work-order board UI.', where: [STUDIO] },
      { name: 'Mantine & Zustand', use: 'UI and state for the interview tool.', where: ['Internal tool'] },
      { name: 'TanStack Query', use: 'Data fetching and caching in the work-order board.', where: [STUDIO] },
      { name: 'PWA', use: 'An installable merchant app for hosts.', where: [STUDIO] },
      { name: 'Bootstrap', use: 'The layout of this site, unchanged since the first version.', where: ['This site'] },
    ],
  },
  {
    id: 'search',
    title: 'Search & discoverability',
    intro: 'Making pages findable by people and by answer engines.',
    items: [
      { name: 'Search Console', use: 'Measuring what actually earns clicks, and where pages compete with each other.', where: [STUDIO] },
      { name: 'GEO & AEO audits', use: 'Auditing pages for citation and answer extraction, and writing the tools to do it.', where: ['Open source', STUDIO], href: '/projects/aeo-skills/' },
      { name: 'JSON-LD', use: 'Structured data that matches the visible content.', where: ['This site', STUDIO] },
      { name: 'llms.txt', use: 'A markdown index of a site for AI crawlers.', where: ['Open source', STUDIO] },
    ],
  },
  {
    id: 'practice',
    title: 'Engineering practice',
    intro: 'The habits around the tools.',
    items: [
      { name: 'ADRs', use: 'A short decision record for each architectural choice, so scope arguments become edits.', where: [STUDIO] },
      { name: 'Contract tests', use: 'Shared fixtures asserted from both sides of a service boundary.', where: [STUDIO] },
      { name: 'Docs as the system of record', use: 'Short agent-readable maps, checked structure and graded quality per domain.', where: ['Open source', STUDIO] },
      { name: 'Claude Code & Cursor', use: 'Agentic coding, audits and repo-level workflows.', where: ['Daily'] },
    ],
  },
];

// The logo grid from the first version of this site, kept as the original toolbox.
export type LogoTool = { name: string; href: string; img?: string; icon?: string; inline?: 'mysql' | 'git' | 'linux'; imgAttr?: 'height' | 'width' };

export const originalToolbox: LogoTool[] = [

  { name: 'HTML5', href: 'https://en.wikipedia.org/wiki/HTML5', img: '/images/logos/html5.png' },
  { name: 'CSS3', href: 'https://en.wikipedia.org/wiki/CSS', img: '/images/logos/css3.png' },
  { name: 'jQuery', href: 'https://jquery.com/', img: '/images/logos/jquery.png', imgAttr: 'width' },
  { name: 'ReactJS', href: 'https://reactjs.org/', img: '/images/logos/react.png' },
  { name: 'NodeJS', href: 'https://nodejs.org/', img: '/images/logos/nodejs.png' },
  { name: 'Flask', href: 'https://en.wikipedia.org/wiki/Flask_(web_framework)/', img: '/images/logos/flask.png' },
  { name: 'PHP', href: 'https://www.php.net/', img: '/images/logos/php.png' },
  { name: 'MySql', href: 'https://www.mysql.com/', inline: 'mysql' },
  { name: 'MongoDB', href: 'https://www.mongodb.com/', img: '/images/logos/mongodb.png' },
  { name: 'Git', href: 'https://git-scm.com/', inline: 'git' },
  { name: 'Github', href: 'https://github.com/', icon: 'fab fa-6x fa-github' },
  { name: 'Linux', href: 'https://www.linux.org/', inline: 'linux' },
  { name: 'C', href: 'https://en.wikipedia.org/wiki/C_(programming_language)', img: '/images/logos/C.svg' },
  { name: 'C++', href: 'https://isocpp.org/', img: '/images/logos/C++.svg' },
  { name: 'Java', href: 'https://www.java.com/', img: '/images/logos/java.png' },
  { name: 'Python', href: 'https://www.python.org/', img: '/images/logos/python.png' },
  { name: 'Processing', href: 'https://processing.org/', img: '/images/logos/processing.png' },
];
