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
    "Lately I've been deep in the AI coding-agent wave — using tools like Claude Code and OpenCode to ship faster without losing engineering rigor. Let's connect, share knowledge, and maybe even create something amazing together.",
  ],
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/waltercrdz', icon: 'in' },
    { label: 'GitHub', url: 'https://github.com/waltercrdz', icon: 'gh' },
    { label: 'X', url: 'https://x.com/walteriodev', icon: 'x' },
  ],
  email: '/cdn-cgi/l/email-protection#a6d1c7cad2c3d4c5d4c2dce6c1cbc7cfca88c5c9cb',
  emailDisplay: 'hello@waltercrdz.dev',
  skills: [
    { group: 'Languages', items: ['Java', 'Python', 'Go', 'TypeScript'] },
    { group: 'Backend', items: ['Spring Boot', 'Spring Data', 'FastAPI', 'REST', 'gRPC', 'JPA', 'Hibernate', 'Maven', 'UV'] },
    { group: 'Architecture', items: ['SOLID', 'DDD', 'Hexagonal', 'Microservices', 'Event-driven', 'CQRS', 'Event Sourcing'] },
    { group: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'ElasticSearch', 'OpenSearch', 'MySQL', 'Kafka'] },
    { group: 'AI / Agents', items: ['Harness Engineering', 'Claude Code', 'GitHub Copilot', 'LangChain', 'OpenCode'] },
    { group: 'Cloud & Ops', items: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'Serverless', 'AWS Lambda', 'SQS', 'SNS', 'CI/CD', 'Grafana'] },
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
      period: 'Mar 2026 – Current · Remote',
      summary:
        'Data Experience Team (via InnoIT). Oracle-to-PostgreSQL migration, backend architecture, and agentic AI workflows.',
      tech: ['Java', 'PostgreSQL', 'Jenkins', 'JPA', 'Hibernate', 'Microservices'],
    },
    {
      role: 'Senior Software Engineer',
      company: 'Inditex',
      period: 'Feb 2025 – Jan 2026 · Remote',
      summary:
        'Shopping Cart Team (via InnoIT). Core cart service for all Inditex brands; backend architecture, performance tuning, and CI.',
      tech: ['Java', 'Spring Boot', 'Redis', 'Couchbase', 'Kubernetes', 'Grafana'],
    },
    {
      role: 'Senior Software Engineer',
      company: 'Connectist',
      period: 'Aug 2023 – Sep 2024 · Remote',
      summary:
        'Profile Validation Team. Accuracy and reliability of decision-maker contact data for B2B marketing campaigns.',
      tech: ['Python', 'Java', 'AWS', 'Terraform', 'Kubernetes', 'OpenSearch'],
    },
    {
      role: 'Senior Software Engineer',
      company: 'Mulesoft',
      period: 'Sep 2021 – Aug 2023 · Buenos Aires',
      summary:
        'Connectors Team. Built and maintained connectors for MongoDB, Cassandra, Redis, Kafka, Snowflake, LDAP on Anypoint Platform.',
      tech: ['Java', 'MongoDB', 'Redis', 'Kafka', 'Snowflake', 'SOLID'],
    },
    {
      role: 'Senior Software Engineer',
      company: 'Mercado Pago',
      period: 'Jul 2020 – Sep 2021 · Buenos Aires',
      summary:
        'Accounts Team. Core service managing user accounts and secure financial transactions in a fintech platform.',
      tech: ['Golang', 'CQRS', 'Event Sourcing', 'Oracle', 'Hexagonal Architecture'],
    },
    {
      role: 'Software Engineer',
      company: 'Almundo.com',
      period: 'Aug 2016 – Jun 2020 · Buenos Aires',
      summary:
        'Hotels, Notifications, Architecture, and Cross Services teams. API integrations, identity management, and platform services.',
      tech: ['Java', 'Spring Boot', 'DDD', 'MySQL', 'ElasticSearch', 'MongoDB'],
    },
  ],
  education: {
    school: 'Universidad Tecnológica Nacional',
    note: 'Systems Engineering',
  },
  languages: [
    { name: 'Spanish', level: 'Native / bilingual' },
    { name: 'English', level: 'Upper-intermediate' },
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

const skillsBody = `My toolkit, grouped by where I use it:

${profile.skills.map((s) => `- **${s.group}:** ${s.items.join(', ')}`).join('\n')}

Boring, proven tech by default — sharp tools when the problem demands it.`;

const experienceBody = `${profile.experience
  .map((e) => `**${e.role} — ${e.company}** · ${e.period}\n${e.summary}`)
  .join('\n\n')}

→ see the table below for the structured view.`;

const contactBody = `Let's connect — share knowledge or build something.

${profile.socials
  .map((s) => `- **${s.label}:** [${s.url.replace(/^https?:\/\//, '')}](${s.url})`)
  .join('\n')}

Or **${profile.emailDisplay}**. → socials are in the sidebar too.`;

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
    body: `I'm **${profile.name}** — Software Engineer in **${profile.location.split(',')[0]}** with **${profile.yearsExperience}** building backend systems that hold up in production. Currently at **${profile.company}**.

Java & Python, architecture-first, and deep into **AI coding agents** as a daily engineering multiplier.

→ pick another topic, or find me on socials for more.`,
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
    body: skillsBody,
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
    body: experienceBody,
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
    body: `I work with **coding agents** daily, not for hype but because this is an era where software quality is cheaper. I use **Spec-Driven Development** as a way to ensure engineering practices in my day to day.

- **Claude Code** and **OpenCode** are my primary harnesses.
- Credentials: Anthropic **Claude Code in Action**, DeepLearning.AI **LangChain** / **Prompt Engineering**.
- A decent model with a great harness beats a great model with a bad one.
- Pragmatic: AI for the boilerplate, keep the senior judgement.`,
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
    body: contactBody,
  },
];
