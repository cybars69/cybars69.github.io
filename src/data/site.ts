export const site = {
  name: 'Arsalan Sheikh',
  fullName: 'Arsalan Ahmad Sheikh',
  handle: 'cybars69',
  email: 'sheikharsalan7222+cybars69gh@gmail.com',
  location: 'Kashmir',
  url: 'https://cybars69.github.io',
  image: '/images/arse.jpg',
  resume: '/resumes/Arsalan_Sheikh-Resume.pdf',
  description:
    'Arsalan Sheikh (cybars69) is a full-stack engineer from Kashmir. Platforms, AI agents, integrations and automation, plus open-source agent skills and the odd generative-art experiment.',
};

export type LinkItem = { label: string; href: string; icon: string };
export type LinkGroup = { title: string; items: LinkItem[] };

// Everything on the Links page. Order matters.
export const linkGroups: LinkGroup[] = [
  {
    title: 'Find me',
    items: [
      { label: 'Linkedin', href: 'https://www.linkedin.com/in/arsalan-a-sheikh/', icon: 'fab fa-linkedin-in' },
      { label: 'Github', href: 'https://github.com/cybars69/', icon: 'fab fa-github' },
      { label: 'Email', href: `mailto:${site.email}`, icon: 'far fa-envelope' },
    ],
  },
  {
    title: 'Résumé',
    items: [{ label: 'Latest résumé (PDF)', href: site.resume, icon: 'far fa-file-pdf' }],
  },
  {
    title: 'Open source',
    items: [
      { label: 'aeo-skills', href: '/projects/aeo-skills/', icon: 'fas fa-bullseye' },
      { label: 'Nonslop Sidebar', href: '/projects/nonslop-sidebar/', icon: 'fas fa-columns' },
      { label: 'All repositories', href: 'https://github.com/cybars69?tab=repositories', icon: 'fab fa-github' },
    ],
  },
  {
    title: 'Things I made',
    items: [
      { label: 'Generative Art', href: 'https://cybars69.github.io/creative-art', icon: 'fas fa-palette' },
      { label: 'Valor Tutors', href: 'https://valortutors.com/', icon: 'fas fa-globe' },
      { label: 'Kashmir Clock', href: '/miscellaneous_stuff/kashmir_clock.html', icon: 'far fa-clock' },
      { label: 'Power Schedule', href: '/miscellaneous_stuff/power_schedule.html', icon: 'fas fa-bolt' },
    ],
  },
];

// Off-site profiles only, for schema.org `sameAs`.
export const socials = linkGroups[0].items.filter((l) => l.href.startsWith('http'));

export const about = [
  'I’m a full-stack engineer from Kashmir who likes owning the whole thing: the API, the integrations, the deployment, and the interface people actually touch.',
  'Most recently I was lead engineer and architect at a small studio, where I built a stays marketplace for a remote valley, a white-label commerce platform that AI agents can operate over MCP, and conversational booking agents on WhatsApp. Before that: distributed data pipelines on AWS Lambda, and real-time transcription and contact-centre integrations at Kore.ai.',
  'I studied Electrical Engineering at IIT Hyderabad. On the side I write open-source agent skills, scrape things, and make generative art.',
];

export const experience = [
  {
    org: 'Qudelta Studios',
    role: 'Lead Engineer & Software Architect (part-time)',
    where: 'Remote',
    when: 'May 2025 – Sep 2026',
    points: [
      'Built a stays marketplace for a remote valley end to end: customer Next.js app, merchant PWA and admin, on a FastAPI and PostgreSQL backend. Booking state transitions, webhook-driven payments, iCal sync and swappable payment, payout, SMS and search providers. Launched in 2026 with live traffic.',
      'Built a multi-agent booking and discovery assistant with Gemini and Google ADK and 15+ database-backed tools, and a separate framework-free WhatsApp booking agent.',
      'Architected a multi-tenant, white-label commerce platform with per-store Workers, signed entitlements, MCP and OAuth for AI agents, and a zero-touch provisioning engine.',
      'Automated Twilio sub-account, WhatsApp Business and Chatwoot setup, turning a manual checklist into a workflow.',
    ],
  },
  {
    org: 'Airnguru',
    role: 'Backend Developer (contract)',
    where: 'Remote',
    when: 'Apr 2024 – Jun 2025',
    points: [
      'Replaced a monolithic batch job with distributed AWS Lambda workers: 170 s down to 40 s, with SQS dead-letter retries and 99.9 percent pipeline success.',
      'Ingestion of 500K+ rows a day with validation and backpressure; Aurora queries 45 percent faster; a BigQuery process cut from 10 GB to 800 MB of memory.',
      'Won the Passion for Excellence award (Feb 2025).',
    ],
  },
  {
    org: 'Kore.ai',
    role: 'Associate Software Engineer',
    where: 'Hyderabad',
    when: 'Jun 2023 – Apr 2024',
    points: [
      'Part of a production streaming transcription pipeline that cut end-to-end latency from about 10 seconds to under 1 second.',
      'FastAPI and Express middleware for Salesforce, Genesys, Talkdesk and NICE CXone, with retries and circuit breakers. Shining Start and Spotlight awards.',
    ],
  },
  {
    org: 'IIT Hyderabad, Office of Career Services',
    role: 'Backend Developer → Technology Team Lead (part-time)',
    where: 'Hyderabad',
    when: 'May 2021 – Mar 2023',
    points: ['Built and maintained the placement platform, later leading technical work and releases, mentoring junior developers and reviewing code.'],
  },
  {
    org: 'Mable.ai, SuperPe & Samsung R&D',
    role: 'Software engineering internships',
    where: 'Remote / Bengaluru',
    when: 'May 2022 – May 2023',
    points: ['REST APIs, Django and MongoDB services, automation, data-integrity checks, metrics pipelines and CI-integrated developer tooling.'],
  },
];

export const education = {
  school: 'IIT Hyderabad',
  degree: 'B.Tech, Electrical Engineering and Engineering Science',
  when: 'Aug 2019 – Apr 2023',
};

export const skills: { title: string; items: string[] }[] = [
  { title: 'Product engineering', items: ['Python', 'FastAPI', 'Node.js', 'TypeScript', 'React', 'Next.js', 'Hono', 'Astro', 'PostgreSQL', 'MySQL', 'MongoDB', 'WebSockets'] },
  { title: 'AI & agents', items: ['Gemini', 'Claude', 'Google ADK', 'Tool calling', 'MCP', 'RAG', 'Structured outputs', 'Evals', 'Agent Skills'] },
  { title: 'Platforms & integrations', items: ['Twilio', 'WhatsApp Business', 'Chatwoot', 'Stripe', 'Razorpay', 'Webhooks', 'OAuth', 'iCal', 'Google Sheets API'] },
  { title: 'Distributed systems', items: ['RabbitMQ', 'SQS', 'Redis', 'Event-driven design', 'Retries & DLQs', 'Circuit breakers'] },
  { title: 'Cloud & infra', items: ['AWS', 'GCP', 'Cloudflare Workers, D1, KV, R2', 'Docker', 'Nginx', 'GitHub Actions', 'Linux'] },
  { title: 'Observability', items: ['Grafana', 'Loki', 'Prometheus'] },
  { title: 'Search & discoverability', items: ['SEO', 'GEO / AEO', 'Search Console', 'JSON-LD', 'llms.txt'] },
  { title: 'Leadership', items: ['Architecture', 'Scoping', 'ADRs', 'Code review', 'Mentoring'] },
];
