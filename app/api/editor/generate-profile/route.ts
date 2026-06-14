import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { getProviderConfig } from "@/lib/ai/config";
import { createOpenAiCompatibleProvider, ProviderConfigurationError } from "@/lib/ai/openai-compatible";
import type { ChatMessage } from "@/lib/ai/provider";
import type { GalleryCategory, PersonaContent } from "@/lib/content/schema";
import { isRecord } from "@/lib/content/validation";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/types";

export const runtime = "nodejs";

type ProfileBuilderInput = {
  name?: unknown;
  chineseName?: unknown;
  title?: unknown;
  shortBio?: unknown;
  researchInterests?: unknown;
  education?: unknown;
  projects?: unknown;
  notesInterests?: unknown;
  contactPreferences?: unknown;
  preferredTone?: unknown;
  languages?: unknown;
  galleryDescription?: unknown;
  relatedPeople?: unknown;
  publicPrivateBoundaries?: unknown;
};

type GenerateProfileBody = {
  input?: ProfileBuilderInput;
  currentPersona?: unknown;
  locale?: unknown;
};

const validGalleryCategories = new Set<GalleryCategory>(["academic", "campus", "travel", "daily-life", "events", "workspace"]);

export async function POST(request: Request) {
  const admin = requireAdminRequest(request, { allowDevWithoutToken: true });
  if (!admin.ok) return admin.response;

  let body: GenerateProfileBody;
  try {
    body = (await request.json()) as GenerateProfileBody;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const input = normalizeInput(body.input);
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : defaultLocale;
  const currentPersona = isRecord(body.currentPersona) ? (body.currentPersona as Partial<PersonaContent>) : undefined;
  const fallback = buildLocalProfileDraft(input, currentPersona, locale);
  const providerConfig = getProviderConfig();
  const provider = createOpenAiCompatibleProvider(providerConfig);

  try {
    const completion = await provider.complete({
      messages: buildProfileBuilderMessages(input, currentPersona, locale),
      model: providerConfig.model,
      temperature: 0.15,
      maxTokens: 1200
    });
    const parsed = parseJsonObject(completion.content);
    const sanitized = sanitizeGeneratedResponse(parsed);
    return NextResponse.json({
      ...sanitized,
      meta: { provider: providerConfig.name, model: providerConfig.model, usedFallback: false }
    });
  } catch (error) {
    if (error instanceof ProviderConfigurationError) {
      return NextResponse.json({
        ...fallback,
        warnings: [...(fallback.warnings ?? []), `AI provider is not configured. Set ${providerConfig.apiKeyEnv} to enable model-generated drafts.`],
        meta: { provider: providerConfig.name, model: providerConfig.model, usedFallback: true }
      });
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Profile generation failed."
      },
      { status: 502 }
    );
  }
}

function buildProfileBuilderMessages(input: Record<string, string>, currentPersona: Partial<PersonaContent> | undefined, locale: Locale): ChatMessage[] {
  const system = [
    "You are an owner-side content drafting assistant for a public academic personal website.",
    "Return only JSON. Do not include Markdown fences.",
    "Do not invent facts, photos, collaborators, mentors, publications, degrees, affiliations, or links.",
    "If a fact is absent or marked private, omit it or create an explicit placeholder.",
    "Generate a conservative PersonaContent-compatible patch, not a full site rewrite.",
    "Keep the voice calm, academic, warm, and suitable for a public homepage.",
    `Preferred response language: ${locale === "zh" ? "Simplified Chinese and English where useful" : "English with bilingual-friendly structure"}.`,
    "Required JSON shape: {\"summary\":\"...\",\"personaPatch\":{...},\"warnings\":[\"...\"]}."
  ].join("\n");

  const user = JSON.stringify(
    {
      ownerInput: input,
      currentPersona: currentPersona
        ? {
            id: currentPersona.id,
            label: currentPersona.label,
            profile: currentPersona.profile,
            homepage: currentPersona.homepage
          }
        : undefined,
      allowedPatchAreas: ["profile", "homepage", "projects", "notes", "gallery", "people", "faq", "ai"],
      safetyRules: [
        "Use placeholder gallery items when no real image path is supplied.",
        "Only include related people named by the owner input.",
        "Do not include private boundary notes in public copy.",
        "Do not add NEXT_PUBLIC secrets or deployment configuration."
      ]
    },
    null,
    2
  );

  return [
    { role: "system", content: system },
    { role: "user", content: user }
  ];
}

function normalizeInput(input: ProfileBuilderInput | undefined) {
  const read = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  return {
    name: read(input?.name),
    chineseName: read(input?.chineseName),
    title: read(input?.title),
    shortBio: read(input?.shortBio),
    researchInterests: read(input?.researchInterests),
    education: read(input?.education),
    projects: read(input?.projects),
    notesInterests: read(input?.notesInterests),
    contactPreferences: read(input?.contactPreferences),
    preferredTone: read(input?.preferredTone),
    languages: read(input?.languages),
    galleryDescription: read(input?.galleryDescription),
    relatedPeople: read(input?.relatedPeople),
    publicPrivateBoundaries: read(input?.publicPrivateBoundaries)
  };
}

function buildLocalProfileDraft(input: Record<string, string>, currentPersona: Partial<PersonaContent> | undefined, locale: Locale) {
  const interests = toList(input.researchInterests);
  const name = input.name || currentPersona?.profile?.name || "Site owner";
  const title = input.title || currentPersona?.profile?.title || "Public profile owner";
  const warnings = ["Local deterministic draft used. Review all generated copy before applying."];

  return {
    summary: "Generated a conservative local draft from the provided public fields. No model was called.",
    personaPatch: {
      profile: {
        name,
        title,
        tagline: input.shortBio ? firstSentence(input.shortBio) : currentPersona?.profile?.tagline ?? title,
        bio: input.shortBio || currentPersona?.profile?.bio || "",
        interests: interests.length > 0 ? interests : currentPersona?.profile?.interests ?? [],
        personalNote: {
          enabled: Boolean(input.notesInterests || input.preferredTone),
          title: locale === "zh" ? "更个人的一点说明" : "A more personal note",
          body: [input.notesInterests, input.preferredTone].filter(Boolean)
        }
      },
      gallery: buildPlaceholderGallery(input.galleryDescription),
      people: buildPeopleFromInput(input.relatedPeople),
      ai: {
        tone: input.preferredTone || currentPersona?.ai?.tone || "Calm, precise, and source-grounded.",
        style: currentPersona?.ai?.style || "Answer from public materials and do not invent missing facts.",
        uncertaintyPolicy: currentPersona?.ai?.uncertaintyPolicy || "If a fact is not present in the public content, say the site does not specify it."
      }
    },
    warnings
  };
}

function buildPlaceholderGallery(description: string) {
  if (!description) return undefined;
  return toList(description).slice(0, 4).map((item, index) => ({
    id: `generated-gallery-${index + 1}`,
    title: item.length > 42 ? `${item.slice(0, 42).trim()}...` : item,
    description: `Placeholder for future public-safe image: ${item}`,
    alt: `Placeholder for future gallery image about ${item}.`,
    category: inferGalleryCategory(item),
    tags: ["placeholder"],
    featured: index < 2,
    visibility: "public",
    placeholder: true
  }));
}

function buildPeopleFromInput(input: string) {
  return toList(input)
    .filter((line) => !/only include|verified public/i.test(line))
    .slice(0, 8)
    .map((line, index) => {
      const [namePart, detailPart] = line.split(/[-:：]/, 2);
      return {
        id: `generated-person-${index + 1}`,
        name: namePart.trim(),
        role: detailPart?.trim() || "Public role to verify",
        relationship: "Verify before publishing",
        description: "Generated from owner-provided input. Review and replace with a conservative, verified public description before publishing.",
        tags: ["needs-review"],
        category: "other",
        visibility: "hidden"
      };
    })
    .filter((person) => person.name.length > 0);
}

function sanitizeGeneratedResponse(value: unknown) {
  if (!isRecord(value)) throw new Error("AI response was not a JSON object.");
  if (typeof value.summary !== "string") throw new Error("AI response is missing a summary string.");
  if (!isRecord(value.personaPatch)) throw new Error("AI response is missing a personaPatch object.");

  return {
    summary: value.summary,
    personaPatch: value.personaPatch,
    warnings: Array.isArray(value.warnings) ? value.warnings.filter((item): item is string => typeof item === "string") : []
  };
}

function parseJsonObject(content: string) {
  const trimmed = content.trim();
  const unfenced = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(unfenced) as unknown;
}

function toList(value: string) {
  return value
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstSentence(value: string) {
  const match = value.match(/^(.{24,180}?[.!?。！？])/);
  return match?.[1] ?? value.slice(0, 180);
}

function inferGalleryCategory(value: string): GalleryCategory {
  const normalized = value.toLowerCase();
  if (normalized.includes("campus") || normalized.includes("校园")) return "campus";
  if (normalized.includes("travel") || normalized.includes("旅行")) return "travel";
  if (normalized.includes("event") || normalized.includes("seminar") || normalized.includes("活动")) return "events";
  if (normalized.includes("desk") || normalized.includes("workspace") || normalized.includes("note") || normalized.includes("书桌") || normalized.includes("笔记")) return "workspace";
  if (validGalleryCategories.has(normalized as GalleryCategory)) return normalized as GalleryCategory;
  return "academic";
}
