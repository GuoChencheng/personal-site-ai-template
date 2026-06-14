import type { PersonaContent } from "@/lib/content/schema";
import type { QueryClass, SourceReference, SuggestedLink } from "@/lib/ai/types";
import type { Locale } from "@/lib/i18n/types";

export type RetrievalChunk = SourceReference & {
  id: string;
  type: "profile" | "contact" | "project" | "publication" | "note" | "gallery" | "person" | "faq" | "assistant-instructions";
  text: string;
  keywords: string[];
  baseScore?: number;
};

export type RetrievalResult = {
  queryClass: QueryClass;
  sources: RetrievalChunk[];
  suggestedLinks: SuggestedLink[];
};

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "what",
  "which",
  "with"
]);

function tokenize(input: string) {
  const normalized = input.toLowerCase();
  const latinTokens = normalized
    .replace(/[^\p{Script=Han}a-z0-9\s-]/gu, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !stopWords.has(token));
  const chineseTokens = normalized.match(/\p{Script=Han}{2,}/gu) ?? [];
  return [...latinTokens, ...chineseTokens];
}

function source(id: string, type: RetrievalChunk["type"], label: string, text: string, href?: string, keywords: string[] = [], baseScore = 0): RetrievalChunk {
  return {
    id,
    type,
    label,
    href,
    text,
    excerpt: truncateExcerpt(text),
    keywords: [...keywords, ...tokenize(`${label} ${text}`)],
    baseScore
  };
}

function truncateExcerpt(text: string, maxLength = 220) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength).trim()}...` : normalized;
}

export function buildRetrievalIndex(persona: PersonaContent, locale: Locale = "en"): RetrievalChunk[] {
  const profile = persona.profile;
  const labels = locale === "zh"
    ? {
        profile: "个人资料",
        instructions: "助手规则",
        contact: "联系渠道",
        project: "项目",
        publication: "发表",
        note: "笔记",
        gallery: "相册",
        person: "相关人物",
        faq: "常见问题"
      }
    : {
        profile: "Profile",
        instructions: "Assistant instructions",
        contact: "Contact channels",
        project: "Project",
        publication: "Publication",
        note: "Note",
        gallery: "Gallery",
        person: "Related person",
        faq: "FAQ"
      };
  const chunks: RetrievalChunk[] = [
    source(
      "profile",
      "profile",
      labels.profile,
      [
        `${profile.name} is ${profile.title}.`,
        profile.tagline,
        profile.bio,
        profile.personalNote?.enabled
          ? `${profile.personalNote.title}: ${Array.isArray(profile.personalNote.body) ? profile.personalNote.body.join(" ") : profile.personalNote.body}`
          : "",
        profile.affiliation ? `Affiliation: ${profile.affiliation}.` : "",
        profile.location ? `Location: ${profile.location}.` : "",
        `Interests: ${profile.interests.join(", ")}.`
      ]
        .filter(Boolean)
        .join(" "),
      "/about",
      ["profile", "background", "about", "bio", "interests"],
      2
    ),
    source(
      "assistant-instructions",
      "assistant-instructions",
      labels.instructions,
      [
        `Tone: ${persona.ai.tone}`,
        `Style: ${persona.ai.style}`,
        `Allowed behavior: ${persona.ai.allowedBehavior.join("; ")}`,
        `Forbidden behavior: ${persona.ai.forbiddenBehavior.join("; ")}`,
        `Routing guidance: ${persona.ai.routingGuidance.join("; ")}`,
        `Uncertainty policy: ${persona.ai.uncertaintyPolicy}`
      ].join(" "),
      undefined,
      ["assistant", "instructions", "uncertainty", "routing"],
      1
    ),
    source(
      "contact",
      "contact",
      labels.contact,
      profile.contact.length > 0
        ? profile.contact
            .map((channel) => `${channel.label}: ${channel.value}. Route: ${channel.href}.${channel.preferred ? " Preferred contact channel." : ""}`)
            .join(" ")
        : "No public contact channels are configured.",
      "/contact",
      ["contact", "email", "collaboration", "availability", "formal", "outreach"],
      2
    )
  ];

  for (const project of persona.projects) {
    chunks.push(
      source(
        `project:${project.slug}`,
        "project",
        `${labels.project}: ${project.title}`,
        [
          project.subtitle,
          project.summary,
          project.description,
          project.role ? `Role: ${project.role}.` : "",
          project.period ? `Period: ${project.period}.` : "",
          project.problem ? `Problem: ${project.problem}.` : "",
          project.approach?.length ? `Approach: ${project.approach.join(" ")}` : "",
          project.outcomes?.length ? `Outcomes: ${project.outcomes.join(" ")}` : "",
          project.highlights?.length ? `Highlights: ${project.highlights.join(", ")}.` : "",
          `Status: ${project.status}.`,
          `Date: ${project.date}.`,
          `Tags: ${project.tags.join(", ")}.`
        ]
          .filter(Boolean)
          .join(" "),
        `/projects/${project.slug}`,
        ["project", "portfolio", ...project.tags],
        project.featured ? 2 : 1
      )
    );
  }

  for (const publication of persona.publications) {
    chunks.push(
      source(
        `publication:${publication.title}`,
        "publication",
        `${labels.publication}: ${publication.title}`,
        [
          `Authors: ${publication.authors.join(", ")}.`,
          `Venue: ${publication.venue}.`,
          `Year: ${publication.year}.`,
          publication.abstract,
          `Tags: ${publication.tags.join(", ")}.`
        ].join(" "),
        "/publications",
        ["publication", "paper", "research", "writing", ...publication.tags],
        1
      )
    );
  }

  for (const note of persona.notes) {
    chunks.push(
      source(
        `note:${note.slug}`,
        "note",
        `${labels.note}: ${note.title}`,
        [
          note.summary,
          note.body,
          note.sections
            ?.map((section) => `${section.heading}: ${Array.isArray(section.body) ? section.body.join(" ") : section.body}`)
            .join(" "),
          note.audience ? `Audience: ${note.audience}.` : "",
          `Reading level: ${note.readingLevel}.`,
          `Tags: ${note.tags.join(", ")}.`
        ]
          .filter(Boolean)
          .join(" "),
        `/notes/${note.slug}`,
        ["note", "writing", "article", ...note.tags],
        1
      )
    );
  }

  for (const item of persona.gallery ?? []) {
    if (item.visibility === "hidden") continue;
    chunks.push(
      source(
        `gallery:${item.id}`,
        "gallery",
        `${labels.gallery}: ${item.title}`,
        [
          item.description,
          item.caption,
          item.location ? `Location: ${item.location}.` : "",
          item.year ? `Year: ${item.year}.` : item.date ? `Date: ${item.date}.` : "",
          `Category: ${item.category}.`,
          item.placeholder ? "This is a placeholder, not a real photograph." : "",
          `Tags: ${item.tags.join(", ")}.`
        ]
          .filter(Boolean)
          .join(" "),
        "/gallery",
        ["gallery", "photo", "album", item.category, ...item.tags],
        item.featured ? 2 : 1
      )
    );
  }

  for (const person of persona.people ?? []) {
    if (person.visibility === "hidden") continue;
    chunks.push(
      source(
        `person:${person.id}`,
        "person",
        `${labels.person}: ${person.name}`,
        [
          `Role: ${person.role}.`,
          `Relationship: ${person.relationship}.`,
          person.affiliation ? `Affiliation: ${person.affiliation}.` : "",
          person.description,
          `Category: ${person.category}.`,
          `Tags: ${person.tags.join(", ")}.`
        ]
          .filter(Boolean)
          .join(" "),
        "/people",
        ["people", "mentor", "advisor", "collaborator", "lab", "peer", person.category, ...person.tags],
        2
      )
    );
  }

  for (const [index, item] of persona.faq.entries()) {
    chunks.push(
      source(
        `faq:${index}`,
        "faq",
        `${labels.faq}: ${item.question}`,
        `Question: ${item.question} Answer: ${item.answer}`,
        "/ask",
        ["faq", item.category],
        2
      )
    );
  }

  return chunks;
}

function classBoost(queryClass: QueryClass, chunk: RetrievalChunk) {
  if (queryClass === "projects" && chunk.type === "project") return 4;
  if (queryClass === "publications-writings" && (chunk.type === "publication" || chunk.type === "note")) return 4;
  if (queryClass === "collaboration-contact" && chunk.type === "contact") return 5;
  if (queryClass === "collaboration-contact" && (chunk.type === "profile" || chunk.type === "assistant-instructions")) return 3;
  if (queryClass === "site-navigation" && chunk.href) return 2;
  if (queryClass === "profile-background" && chunk.type === "profile") return 4;
  if (queryClass === "profile-background" && chunk.type === "person") return 3;
  if (queryClass === "site-navigation" && (chunk.type === "gallery" || chunk.type === "person")) return 3;
  if (queryClass === "out-of-scope" && chunk.type === "assistant-instructions") return 4;
  return 0;
}

export function retrieveSources(persona: PersonaContent, query: string, queryClass: QueryClass, limit = 6, locale: Locale = "en"): RetrievalResult {
  if (queryClass === "out-of-scope") {
    return {
      queryClass,
      sources: [],
      suggestedLinks: [{ label: "Contact", href: "/contact", reason: "Use public contact channels for formal or private requests" }]
    };
  }

  const tokens = tokenize(query);
  const index = buildRetrievalIndex(persona, locale);
  const scored = index
    .map((chunk) => {
      const tokenScore = tokens.reduce((total, token) => total + (chunk.keywords.includes(token) || chunk.text.toLowerCase().includes(token) ? 1 : 0), 0);
      return {
        chunk,
        score: tokenScore + classBoost(queryClass, chunk) + (chunk.baseScore ?? 0)
      };
    })
    .filter((item) => item.score > 0 || queryClass === "site-navigation" || queryClass === "collaboration-contact")
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.chunk);

  return {
    queryClass,
    sources: scored,
    suggestedLinks: buildSuggestedLinks(persona, queryClass, scored)
  };
}

function buildSuggestedLinks(persona: PersonaContent, queryClass: QueryClass, sources: RetrievalChunk[]): SuggestedLink[] {
  const links: SuggestedLink[] = [];
  const add = (link: SuggestedLink) => {
    if (!links.some((existing) => existing.href === link.href)) links.push(link);
  };

  for (const sourceItem of sources) {
    if (sourceItem.href) add({ label: sourceItem.label.replace(/^(Project|Note|FAQ|项目|笔记|常见问题): /, ""), href: sourceItem.href, reason: "Referenced source" });
  }

  if (queryClass === "projects") add({ label: "Projects", href: "/projects", reason: "Browse all configured projects" });
  if (queryClass === "publications-writings") {
    add({ label: "Publications", href: "/publications", reason: "Review public publications" });
    add({ label: "Notes", href: "/notes", reason: "Read available notes" });
  }
  if (queryClass === "collaboration-contact") add({ label: "Contact", href: "/contact", reason: "Use the configured public contact channels" });
  if (queryClass === "site-navigation") {
    add({ label: "About", href: "/about", reason: "Profile overview" });
    add({ label: "Gallery", href: "/gallery", reason: "Public visual album" });
    add({ label: "People", href: "/people", reason: "Verified related people" });
    add({ label: "CV", href: "/cv", reason: "Experience snapshot" });
  }

  const primaryContact = persona.profile.contact.find((channel) => channel.preferred) ?? persona.profile.contact[0];
  if (queryClass === "collaboration-contact" && primaryContact) {
    add({ label: primaryContact.label, href: primaryContact.href, reason: "Preferred contact channel" });
  }

  return links.slice(0, 5);
}
