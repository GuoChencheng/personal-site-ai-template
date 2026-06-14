export type PersonaId = "academic" | "developer";

export type Link = {
  label: string;
  href: string;
  kind?: "website" | "email" | "github" | "linkedin" | "scholar" | "download" | "external";
};

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
  preferred?: boolean;
};

export type ContentSection = {
  heading: string;
  body: string | string[];
};

export type PortraitAsset = {
  src: string;
  alt: string;
  caption?: string;
  coverSrc?: string;
  coverAlt?: string;
  coverCaption?: string;
  placeholder?: boolean;
  replacePath?: string;
  note?: string;
};

export type PersonalNote = {
  enabled: boolean;
  title: string;
  body: string | string[];
};

export type Profile = {
  name: string;
  title: string;
  tagline: string;
  avatar?: string;
  portrait?: PortraitAsset;
  bio: string;
  personalNote?: PersonalNote;
  aboutSections?: ContentSection[];
  location?: string;
  affiliation?: string;
  interests: string[];
  links: Link[];
  contact: ContactChannel[];
};

export type Project = {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  description: string;
  role?: string;
  period?: string;
  problem?: string;
  approach?: string[];
  outcomes?: string[];
  highlights?: string[];
  tags: string[];
  links: Link[];
  images?: string[];
  featured?: boolean;
  date: string;
  status: "planned" | "active" | "paused" | "complete";
};

export type Publication = {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  links: Link[];
  tags: string[];
};

export type Note = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string;
  sections?: ContentSection[];
  tags: string[];
  readingLevel: "introductory" | "intermediate" | "advanced";
  audience?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
  category: "background" | "projects" | "publications" | "contact" | "other";
};

export type Visibility = "public" | "hidden";

export type GalleryCategory = "academic" | "campus" | "travel" | "daily-life" | "events" | "workspace";

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  alt: string;
  date?: string;
  year?: string;
  location?: string;
  category: GalleryCategory;
  tags: string[];
  featured?: boolean;
  caption?: string;
  visibility?: Visibility;
  placeholder?: boolean;
};

export type PeopleCategory = "mentor" | "collaborator" | "lab" | "peer" | "advisor" | "other";

export type PersonConnection = {
  id: string;
  name: string;
  role: string;
  relationship: string;
  affiliation?: string;
  description: string;
  image?: string;
  link?: string;
  tags: string[];
  category: PeopleCategory;
  visibility?: Visibility;
};

export type AiInstructions = {
  tone: string;
  style: string;
  allowedBehavior: string[];
  forbiddenBehavior: string[];
  routingGuidance: string[];
  uncertaintyPolicy: string;
};

export type SectionType =
  | "hero"
  | "about-summary"
  | "stats"
  | "skills-interests"
  | "gallery-preview"
  | "people-preview"
  | "featured-projects"
  | "experience-timeline"
  | "publications-preview"
  | "latest-notes"
  | "contact-cta";

export type HomeSection = {
  id: string;
  type: SectionType;
  enabled: boolean;
  variant?: "default" | "compact" | "editorial" | "grid";
  title?: string;
};

export type Stat = {
  label: string;
  value: string;
};

export type TimelineItem = {
  title: string;
  organization: string;
  period: string;
  summary: string;
};

export type PersonaContent = {
  id: PersonaId;
  label: string;
  profile: Profile;
  homepage: {
    sections: HomeSection[];
    stats: Stat[];
    timeline: TimelineItem[];
  };
  projects: Project[];
  publications: Publication[];
  notes: Note[];
  gallery?: GalleryItem[];
  people?: PersonConnection[];
  faq: FaqItem[];
  ai: AiInstructions;
};
