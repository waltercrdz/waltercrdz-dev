export const profile = {
  name: 'Walter Cardozo',
  role: 'Software Engineer',
  tagline: 'Coding and Software Architecture for the real world',
  location: 'Barcelona, Catalonia, Spain',
  yearsExperience: '14+ years',
  company: 'eDreams ODIGEO',
  school: 'Universidad Tecnológica Nacional',
  bio: [
    "I'm a Software Engineer with a strong focus on backend development and software architecture. I'm passionate about coding, especially in Java and Python, and I enjoy collaborating to solve complex problems and build scalable systems.",
    "Lately I've been deep in the AI coding-agent wave — using tools like Claude Code and opencode to ship faster without losing engineering rigor. Let's connect, share knowledge, and maybe even create something amazing together.",
  ],
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/waltercrdz', icon: 'in' },
    { label: 'GitHub', url: 'https://github.com/waltercrdz', icon: 'gh' },
    { label: 'X', url: 'https://x.com/walteriodev', icon: 'x' },
  ],
  email: '/cdn-cgi/l/email-protection#a6d1c7cad2c3d4c5d4c2dce6c1cbc7cfca88c5c9cb',
  emailDisplay: 'hello@waltercrdz.dev',
  skills: [
    { group: 'Languages', items: ['Java', 'Python', 'TypeScript', 'SQL'] },
    { group: 'Backend', items: ['Spring Boot', 'FastAPI', 'REST', 'gRPC', 'Kafka'] },
    { group: 'Architecture', items: ['DDD', 'Hexagonal', 'Microservices', 'Event-driven', 'SOLID'] },
    { group: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Kafka'] },
    { group: 'AI / Agents', items: ['LangChain', 'Claude Code', 'opencode', 'Prompt Engineering', 'Ollama'] },
    { group: 'Cloud & Ops', items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Observability'] },
  ],
  certifications: [
    { title: 'Claude Code in Action', issuer: 'Anthropic', date: 'Mar 2026' },
    { title: 'MongoDB Indexing Design Fundamentals', issuer: 'MongoDB', date: 'Jan 2026' },
    { title: 'MongoDB Query Optimization Techniques', issuer: 'MongoDB', date: 'Jan 2026' },
    { title: 'MongoDB Sharding Strategies', issuer: 'MongoDB', date: 'Jan 2026' },
    { title: 'LangChain for LLM Application Development', issuer: 'DeepLearning.AI', date: 'Dec 2024' },
    { title: 'ChatGPT Prompt Engineering for Developers', issuer: 'DeepLearning.AI', date: 'Oct 2024' },
    { title: 'AI con buenas prácticas (OpenAI, Ollama, LangChain)', issuer: 'CodelyTV', date: 'Oct 2024' },
    { title: 'Software Architecture: Domain-Driven Design', issuer: 'LinkedIn', date: 'Aug 2020' },
  ],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'eDreams ODIGEO',
      period: 'Current · Barcelona',
      summary:
        'Building and scaling high-traffic backend systems for one of the largest travel platforms in Europe. Architecture, performance, and shipping resilient services.',
    },
    {
      role: 'Software Engineer',
      company: 'Consulting & Product Companies',
      period: '14+ years · Argentina → Spain',
      summary:
        'Backend engineering across fintech, travel, and B2B SaaS. Specialised in Java and Python, domain-driven design, and leading teams to deliver complex systems.',
    },
  ],
  education: {
    school: 'Universidad Tecnológica Nacional',
    note: 'Software Engineering',
  },
  languages: [
    { name: 'Spanish', level: 'Native / bilingual' },
    { name: 'English', level: 'Professional working proficiency' },
  ],
};

export type Profile = typeof profile;

export interface TopicAnswer {
  id: string;
  label: string;
  heading: string;
  todo: string[];
  body: string;
}

export const heroTopics: TopicAnswer[] = [
  {
    id: 'about',
    label: 'About',
    heading: '## About',
    todo: [
      'Locate Walter Cardozo',
      'Read bio',
      'Summarize',
    ],
    body: `I'm **Walter Cardozo** — a Software Engineer based in **Barcelona** with **14+ years** of experience, currently at **eDreams ODIGEO**.

I focus on backend development and software architecture, mostly in **Java** and **Python**, and I care about building systems that hold up in the real world: scalable, observable, and honestly maintainable.

Lately I've gone deep on **AI coding agents** — using tools like Claude Code and opencode to move faster without throwing away engineering rigor.`,
  },
  {
    id: 'skills',
    label: 'Skills',
    heading: '## Skills',
    todo: [
      'Load skill matrix',
      'Group by domain',
      'Render',
    ],
    body: `My toolkit, grouped by where I use it:

- **Languages:** Java, Python, TypeScript, SQL
- **Backend:** Spring Boot, FastAPI, REST, gRPC, Kafka
- **Architecture:** DDD, Hexagonal, Microservices, Event-driven, SOLID
- **Data:** PostgreSQL, MongoDB, Redis, Kafka
- **AI / Agents:** LangChain, Claude Code, opencode, Prompt Engineering, Ollama
- **Cloud & Ops:** Docker, Kubernetes, AWS, CI/CD, Observability

I pick boring, proven tech when I can — and reach for the sharp tools when the problem actually demands it.`,
  },
  {
    id: 'experience',
    label: 'Experience',
    heading: '## Experience',
    todo: [
      'Fetch work history',
      'Extract highlights',
      'Present',
    ],
    body: `**Senior Software Engineer — eDreams ODIGEO** · Barcelona (current)
Building and scaling high-traffic backend systems for one of Europe's largest travel platforms. Architecture, performance, and shipping resilient services.

**Software Engineer — Consulting & Product Companies** · 14+ yrs (Argentina → Spain)
Backend engineering across fintech, travel, and B2B SaaS. Specialised in Java and Python, domain-driven design, and leading teams to deliver complex systems.

Studied Software Engineering at **Universidad Tecnológica Nacional**.`,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    heading: '## Certifications',
    todo: [
      'List credentials',
      'Sort by recency',
      'Render',
    ],
    body: `A few I've earned along the way:

- **Claude Code in Action** — Anthropic (Mar 2026)
- **MongoDB** Indexing · Query Optimization · Sharding (Jan 2026)
- **LangChain for LLM Application Development** — DeepLearning.AI (Dec 2024)
- **Prompt Engineering for Developers** — DeepLearning.AI (Oct 2024)
- **AI con buenas prácticas** — CodelyTV (Oct 2024)
- **Software Architecture: Domain-Driven Design** — LinkedIn (Aug 2020)

Plus SOLID Principles and Scrum/Kleer agile training.`,
  },
  {
    id: 'ai',
    label: 'AI/agents',
    heading: '## AI & agents',
    todo: [
      'Scan AI activity',
      'Identify tools',
      'Summarize stance',
    ],
    body: `I spend a lot of time with **coding agents** — not as a gimmick, but as a daily engineering multiplier.

- **Claude Code** and **opencode** are my primary agent harnesses.
- I hold Anthropic's *Claude Code in Action* credential and DeepLearning.AI's *LangChain* / *Prompt Engineering* certs.
- I care about the *harness*: a decent model with a great harness beats a great model with a bad one. Skills, rules, and tight tool boundaries matter.
- Pragmatic stance: use AI to cut the boilerplate, keep the senior judgement.`,
  },
  {
    id: 'contact',
    label: 'Contact',
    heading: '## Contact',
    todo: [
      'Resolve channels',
      'Verify reachable',
      'Present',
    ],
    body: `Let's connect, share knowledge, and maybe build something.

- **LinkedIn:** [linkedin.com/in/waltercrdz](https://www.linkedin.com/in/waltercrdz)
- **GitHub:** [github.com/waltercrdz](https://github.com/waltercrdz)
- **X:** [@walteriodev](https://x.com/walteriodev)

Or reach me directly at **hello@waltercrdz.dev**.`,
  },
];
