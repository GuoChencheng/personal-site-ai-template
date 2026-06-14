import type { PersonaContent } from "@/lib/content/schema";

export const academicPersona = {
  id: "academic",
  label: "Academic researcher",
  profile: {
    name: "Mira Chen",
    title: "Theoretical physics student",
    tagline: "Working at the meeting point of theoretical physics, mathematical structure, and careful explanation.",
    portrait: {
      src: "/images/profile/portrait-placeholder.svg",
      alt: "Reserved space for a future portrait or study photograph of Mira Chen.",
      caption: "Portrait placeholder. Replace with a public-safe portrait or study photograph.",
      placeholder: true,
      replacePath: "/public/images/profile/portrait.jpg",
      note: "Replace the placeholder with a calm portrait or study photograph when a public-safe image is available."
    },
    bio: "I study theoretical physics with a strong interest in the way abstract ideas become intelligible through slow reading, precise notation, and patient explanation. My public work is grounded in mathematical structure, but I care just as much about clarity: the point of difficult ideas is not only to admire them, but to make them shareable.",
    personalNote: {
      enabled: true,
      title: "A more personal note",
      body: [
        "Most of my study practice is built around patience: reading slowly, redrawing diagrams, writing down the missing steps, and checking whether an explanation still works when it is made explicit.",
        "I like the moment when a mathematical structure stops feeling decorative and starts behaving like a tool for thought. That is often where my notes, small code experiments, and research questions begin."
      ]
    },
    aboutSections: [
      {
        heading: "How I learn",
        body: "A large part of my work happens quietly: reading line by line, rewriting arguments in my own notation, and testing whether an elegant statement still makes sense once every step is made explicit."
      },
      {
        heading: "What draws me to theory",
        body: [
          "I am especially drawn to problems where physical intuition and formal structure sharpen one another.",
          "I enjoy the discipline of staying with a difficult idea long enough for its internal logic to become clear."
        ]
      },
      {
        heading: "Life around the work",
        body: "Outside formal coursework, I keep long-form notes, return to foundational texts, and use small computational experiments when they help turn abstraction into something easier to inspect and explain."
      }
    ],
    interests: ["theoretical physics", "mathematical physics", "symmetry and geometry", "scientific computing"],
    links: [
      { label: "Notes", href: "/notes", kind: "website" },
      { label: "Contact", href: "/contact", kind: "website" }
    ],
    contact: [{ label: "Contact page", value: "/contact", href: "/contact", preferred: true }]
  },
  homepage: {
    sections: [
      { id: "hero", type: "hero", enabled: true, variant: "editorial" },
      { id: "about", type: "about-summary", enabled: true },
      { id: "gallery", type: "gallery-preview", enabled: true, title: "Photo notes" },
      { id: "interests", type: "skills-interests", enabled: true, title: "Research themes" },
      { id: "notes", type: "latest-notes", enabled: true },
      { id: "people", type: "people-preview", enabled: false, title: "Related people" },
      { id: "contact", type: "contact-cta", enabled: true }
    ],
    stats: [
      { label: "Research themes", value: "4" },
      { label: "Current notes", value: "1" },
      { label: "Public contact route", value: "1" }
    ],
    timeline: [
      {
        title: "Current focus",
        organization: "Independent study and research preparation",
        period: "Present",
        summary: "Working through advanced material with attention to mathematical detail, conceptual coherence, and explanatory clarity."
      }
    ]
  },
  projects: [],
  publications: [],
  notes: [
    {
      slug: "reading-physics-slowly",
      title: "Reading physics slowly",
      date: "2026-05-12",
      summary: "A short note on why difficult material becomes more useful when it is rewritten, checked, and explained carefully.",
      body: "Some of the most valuable study happens when a compact derivation is expanded into a notebook full of intermediate steps.",
      sections: [
        {
          heading: "Reconstruction is part of understanding",
          body: "When a text moves too quickly, I usually learn more by reconstructing the omitted steps than by simply reading faster."
        },
        {
          heading: "Notes are a form of thinking",
          body: "Writing long-form notes is not separate from research preparation; it is often the clearest way to discover what I do and do not yet understand."
        }
      ],
      tags: ["study practice", "physics notes"],
      readingLevel: "introductory",
      audience: "Readers interested in how I approach theoretical work"
    }
  ],
  gallery: [
    {
      id: "portrait-placeholder",
      title: "Future portrait",
      description: "A reserved place for a public-safe portrait or study photograph. This is not a real personal photo yet.",
      alt: "Placeholder card for a future public portrait.",
      category: "academic",
      tags: ["placeholder", "portrait"],
      featured: true,
      caption: "TODO: Replace with a real portrait after confirming it is intended for public use.",
      visibility: "public",
      placeholder: true
    },
    {
      id: "workspace-placeholder",
      title: "Future workspace note",
      description: "A reserved card for a desk, notebook, blackboard, or other public-safe study image.",
      alt: "Placeholder card for a future study or workspace photograph.",
      category: "workspace",
      tags: ["placeholder", "study"],
      featured: true,
      caption: "TODO: Add a real workspace image only when it is safe and useful to publish.",
      visibility: "public",
      placeholder: true
    },
    {
      id: "campus-placeholder",
      title: "Future campus or event photo",
      description: "A reserved card for a campus, seminar, or event image with permission-safe context.",
      alt: "Placeholder card for a future campus or academic event photograph.",
      category: "campus",
      tags: ["placeholder", "campus"],
      featured: false,
      caption: "TODO: Do not add group photos or identifiable people without clear public permission.",
      visibility: "public",
      placeholder: true
    }
  ],
  people: [],
  faq: [
    {
      question: "What does Mira work on?",
      answer: "Mira works in theoretical physics, with a particular interest in mathematical structure, careful reading, and clear explanation.",
      category: "background"
    }
  ],
  ai: {
    tone: "Calm, precise, and careful.",
    style: "Answer from public materials, keep claims modest, and direct readers to notes or contact when that is more useful than overexplaining.",
    allowedBehavior: ["Summarize public profile content", "Recommend relevant pages", "Cite source labels"],
    forbiddenBehavior: ["Invent private commitments", "Claim access to unpublished information"],
    routingGuidance: ["Send writing questions to /notes", "Send contact or formal requests to /contact"],
    uncertaintyPolicy: "If a fact is not present in the content files, say that the public materials do not specify it."
  }
} satisfies PersonaContent;
