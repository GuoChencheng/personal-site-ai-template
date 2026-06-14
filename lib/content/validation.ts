import type { PersonaContent } from "@/lib/content/schema";

export function assertPersonaContent(value: unknown): asserts value is PersonaContent {
  if (!isRecord(value)) throw new Error("Payload must contain a persona object.");
  if (!isString(value.id) || !isString(value.label)) throw new Error("Persona must include id and label.");
  if (!isRecord(value.profile) || !isString(value.profile.name) || !isString(value.profile.title) || !isString(value.profile.tagline)) {
    throw new Error("Profile is missing required name, title, or tagline fields.");
  }
  if (!isString(value.profile.bio) || !Array.isArray(value.profile.interests) || !Array.isArray(value.profile.links) || !Array.isArray(value.profile.contact)) {
    throw new Error("Profile is missing required bio, interests, links, or contact fields.");
  }
  if (!isRecord(value.homepage) || !Array.isArray(value.homepage.sections) || !Array.isArray(value.homepage.stats) || !Array.isArray(value.homepage.timeline)) {
    throw new Error("Homepage must include sections, stats, and timeline arrays.");
  }
  if (!Array.isArray(value.projects) || !Array.isArray(value.publications) || !Array.isArray(value.notes) || !Array.isArray(value.faq)) {
    throw new Error("Persona must include projects, publications, notes, and faq arrays.");
  }
  if (value.gallery !== undefined && !Array.isArray(value.gallery)) throw new Error("Gallery must be an array when provided.");
  if (value.people !== undefined && !Array.isArray(value.people)) throw new Error("People must be an array when provided.");
  if (!isRecord(value.ai) || !isString(value.ai.tone) || !isString(value.ai.style) || !isString(value.ai.uncertaintyPolicy)) {
    throw new Error("Assistant configuration is missing required tone, style, or uncertainty policy fields.");
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}
