import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { academicPersona } from "@/content/personas/academic";
import { developerPersona } from "@/content/personas/developer";
import type { PersonaContent, PersonaId } from "@/lib/content/schema";
import { assertPersonaContent } from "@/lib/content/validation";

const basePersonas = {
  academic: academicPersona,
  developer: developerPersona
} satisfies Record<PersonaId, PersonaContent>;

const generatedPersona = loadGeneratedPersona();

export const personas = generatedPersona && generatedPersona.id in basePersonas
  ? ({ ...basePersonas, [generatedPersona.id]: generatedPersona } as Record<PersonaId, PersonaContent>)
  : basePersonas;

export const defaultPersonaId: PersonaId = "academic";

export function getPersona(id: PersonaId = defaultPersonaId): PersonaContent {
  return personas[id];
}

export function getProjectBySlug(slug: string, persona = getPersona()) {
  return persona.projects.find((project) => project.slug === slug);
}

export function getNoteBySlug(slug: string, persona = getPersona()) {
  return persona.notes.find((note) => note.slug === slug);
}

function loadGeneratedPersona() {
  const generatedPath = path.join(process.cwd(), "content", "generated", "site-content.json");
  if (!existsSync(generatedPath)) return null;

  try {
    const parsed = JSON.parse(readFileSync(generatedPath, "utf8")) as unknown;
    const persona = isRecord(parsed) && isRecord(parsed.persona) ? parsed.persona : parsed;
    assertPersonaContent(persona);
    return persona;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
