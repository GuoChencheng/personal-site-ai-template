import type { PersonaContent } from "@/lib/content/schema";

export const developerPersona = {
  id: "developer",
  label: "Software developer",
  profile: {
    name: "Jordan Vale",
    title: "Product-minded software engineer",
    tagline: "Building calm, durable tools for teams that need reliable software.",
    bio: "Jordan Vale is a demo developer persona for this template. The profile highlights product engineering, frontend systems, and pragmatic AI integrations.",
    location: "San Francisco, CA",
    affiliation: "Independent",
    interests: ["product engineering", "frontend architecture", "developer tools", "AI workflows"],
    links: [
      { label: "GitHub", href: "https://github.com", kind: "github" },
      { label: "LinkedIn", href: "https://linkedin.com", kind: "linkedin" }
    ],
    contact: [{ label: "Email", value: "jordan@example.com", href: "mailto:jordan@example.com", preferred: true }]
  },
  homepage: {
    sections: [
      { id: "hero", type: "hero", enabled: true },
      { id: "projects", type: "featured-projects", enabled: true, variant: "grid" },
      { id: "about", type: "about-summary", enabled: true },
      { id: "stats", type: "stats", enabled: true },
      { id: "interests", type: "skills-interests", enabled: true, title: "Focus areas" },
      { id: "timeline", type: "experience-timeline", enabled: true },
      { id: "notes", type: "latest-notes", enabled: true },
      { id: "contact", type: "contact-cta", enabled: true }
    ],
    stats: [
      { label: "Featured builds", value: "3" },
      { label: "Core focus areas", value: "4" },
      { label: "Template routes", value: "9" }
    ],
    timeline: [
      {
        title: "Principal Engineer",
        organization: "Example Product Studio",
        period: "2023-present",
        summary: "Owns frontend architecture and AI-assisted workflows for internal tools."
      },
      {
        title: "Senior Software Engineer",
        organization: "Demo Cloud",
        period: "2019-2023",
        summary: "Built web platforms, design systems, and deployment workflows for product teams."
      }
    ]
  },
  projects: [
    {
      slug: "portfolio-template",
      title: "Modular Portfolio Template",
      subtitle: "A reusable personal site architecture",
      summary: "A typed, content-driven website template with modular homepage sections and future AI hooks.",
      description: "This project is the live template baseline: content lives in files, presentation is componentized, and routes are ready for deeper content in later batches.",
      role: "Template architect and full-stack implementer",
      period: "2026",
      problem: "Personal sites often mix biography, portfolio content, and assistant behavior into one-off page code that is hard to reuse or verify.",
      approach: [
        "Separated persona content, rendering components, and assistant orchestration into typed modules.",
        "Kept the first implementation static-friendly while leaving clean hooks for provider-backed AI features.",
        "Designed homepage sections and detail pages to degrade gracefully when content is missing."
      ],
      outcomes: [
        "A buildable Next.js template with reusable routes and typed local content.",
        "A grounded assistant surface that can cite profile, project, note, publication, and contact sources.",
        "A content model that can be adapted to academic, developer, and creator profiles."
      ],
      highlights: ["Config-driven homepage", "Typed persona content", "OpenAI-compatible assistant hooks"],
      tags: ["Next.js", "TypeScript", "Tailwind"],
      links: [{ label: "Project page", href: "/projects/portfolio-template" }],
      featured: true,
      date: "2026-05-01",
      status: "active"
    },
    {
      slug: "team-ops-dashboard",
      title: "Team Ops Dashboard",
      summary: "A quiet dashboard concept for tracking product work without excess ceremony.",
      description: "A demo project used to show portfolio cards, tags, statuses, and detail-page routing.",
      role: "Product engineer",
      period: "2025",
      problem: "Teams need fast operational visibility, but dashboards often become noisy status walls.",
      approach: [
        "Prioritized scan-friendly states, restrained visual hierarchy, and direct navigation to follow-up actions.",
        "Modeled the page around repeated operational review rather than one-time presentation."
      ],
      outcomes: [
        "A concise example of how this template can present product engineering work.",
        "Reusable project metadata for retrieval, cards, and detail pages."
      ],
      highlights: ["Operational UX", "Dashboard patterns", "Reusable project cards"],
      tags: ["dashboards", "product engineering"],
      links: [{ label: "Project page", href: "/projects/team-ops-dashboard" }],
      featured: true,
      date: "2025-11-15",
      status: "complete"
    }
  ],
  publications: [
    {
      title: "Designing Durable Interfaces for AI-Assisted Work",
      authors: ["Jordan Vale"],
      venue: "Demo Product Engineering Notes",
      year: 2026,
      abstract: "A sample public writing entry about building AI-enabled product surfaces that remain inspectable, reversible, and useful without requiring users to trust hidden state.",
      links: [{ label: "Related note", href: "/notes/template-architecture-notes" }],
      tags: ["AI workflows", "product engineering", "interfaces"]
    }
  ],
  notes: [
    {
      slug: "template-architecture-notes",
      title: "Notes on reusable personal site architecture",
      date: "2026-04-20",
      summary: "A brief explanation of separating content, rendering, and future assistant orchestration.",
      body: "Reusable templates work best when content, routing, and presentation are loosely coupled.",
      sections: [
        {
          heading: "Content should be portable",
          body: "A personal site template should not require rewriting page components every time the owner changes roles, projects, or publications. Typed content gives the renderer and assistant one shared source of truth."
        },
        {
          heading: "Assistant behavior needs source boundaries",
          body: [
            "The assistant should retrieve from public content before composing an answer.",
            "When a fact is absent, the right answer is uncertainty plus a useful route, not improvisation."
          ]
        },
        {
          heading: "Presentation stays modular",
          body: "The same project and note records should support cards, detail pages, CV summaries, and retrieval snippets without duplicating copy."
        }
      ],
      tags: ["architecture", "templates"],
      readingLevel: "intermediate",
      audience: "Developers adapting the template"
    }
  ],
  faq: [
    {
      question: "What kind of work does Jordan do?",
      answer: "Jordan focuses on product engineering, frontend architecture, developer tools, and AI workflows.",
      category: "background"
    }
  ],
  ai: {
    tone: "Direct, practical, and source-grounded.",
    style: "Use concise answers, cite public source labels, and route visitors to projects or contact when useful.",
    allowedBehavior: ["Summarize public projects", "Explain technical focus areas", "Suggest site links"],
    forbiddenBehavior: ["Invent client details", "Make hiring or contract commitments"],
    routingGuidance: ["Send portfolio questions to /projects", "Send availability questions to /contact"],
    uncertaintyPolicy: "If the content does not include a detail, state that the public site does not specify it."
  }
} satisfies PersonaContent;
