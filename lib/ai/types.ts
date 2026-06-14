export type QueryClass =
  | "profile-background"
  | "projects"
  | "publications-writings"
  | "site-navigation"
  | "collaboration-contact"
  | "out-of-scope";

export type SourceReference = {
  id?: string;
  label: string;
  href?: string;
  excerpt?: string;
};

export type SuggestedLink = {
  label: string;
  href: string;
  reason?: string;
};

export type AssistantRequest = {
  query: string;
  queryClass?: QueryClass;
  personaId?: string;
  locale?: "en" | "zh";
};

export type AssistantResponse = {
  answer: string;
  sources: SourceReference[];
  suggestedLinks: SuggestedLink[];
  queryClass?: QueryClass;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    provider?: string;
    model?: string;
    usedFallback?: boolean;
  };
};
