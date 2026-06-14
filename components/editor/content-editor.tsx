"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode
} from "react";
import { HomepageRenderer } from "@/components/sections/homepage-renderer";
import type {
  AiInstructions,
  ContactChannel,
  FaqItem,
  GalleryCategory,
  GalleryItem,
  HomeSection,
  Link as ContentLink,
  Note,
  PersonaContent,
  PeopleCategory,
  PersonConnection,
  Project,
  Publication,
  SectionType,
  Stat,
  TimelineItem
} from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";

type EditorTab = "builder" | "profile" | "media" | "homepage" | "gallery" | "people" | "projects" | "notes" | "publications" | "assistant" | "publish";

type EditorDraft = {
  schemaVersion: 1;
  updatedAt: string;
  persona: PersonaContent;
  suggestedQuestions: string[];
};

type ImportEnvelope = Partial<EditorDraft> & {
  exportedAt?: string;
};

type ProfileBuilderInput = {
  name: string;
  chineseName: string;
  title: string;
  shortBio: string;
  researchInterests: string;
  education: string;
  projects: string;
  notesInterests: string;
  contactPreferences: string;
  preferredTone: string;
  languages: string;
  galleryDescription: string;
  relatedPeople: string;
  publicPrivateBoundaries: string;
};

type GeneratedProfileResponse = {
  summary: string;
  personaPatch: Partial<PersonaContent>;
  warnings?: string[];
  meta?: {
    provider?: string;
    model?: string;
    usedFallback?: boolean;
  };
  error?: string;
};

const tabs: Array<{ id: EditorTab; label: string; description: string }> = [
  { id: "builder", label: "AI builder", description: "Generate a structured draft from owner-provided public information." },
  { id: "profile", label: "Profile", description: "Identity, links, contact channels, and public focus areas." },
  { id: "media", label: "Media", description: "Portrait, cover, and personal-note fields for warmer public presentation." },
  { id: "homepage", label: "Homepage", description: "Section order, section visibility, stats, and timeline entries." },
  { id: "gallery", label: "Gallery", description: "Public photo album records with safe placeholders and visibility controls." },
  { id: "people", label: "People", description: "Verified mentors, collaborators, labs, advisors, and peers." },
  { id: "projects", label: "Projects", description: "Add, reorder, summarize, and annotate project records." },
  { id: "notes", label: "Notes", description: "Maintain note metadata, summaries, bodies, and tags." },
  { id: "publications", label: "Publications", description: "Maintain publication entries, authors, links, and tags." },
  { id: "assistant", label: "Assistant", description: "Tune public-answer behavior, FAQ seed content, and suggested questions." },
  { id: "publish", label: "Publish", description: "Export JSON or call protected server-side publish/deploy routes when configured." }
];

const storageKey = "personal-site-editor-draft";

const sectionTypeOptions: SectionType[] = [
  "hero",
  "about-summary",
  "stats",
  "skills-interests",
  "gallery-preview",
  "people-preview",
  "featured-projects",
  "experience-timeline",
  "publications-preview",
  "latest-notes",
  "contact-cta"
];

const linkKinds: Array<NonNullable<ContentLink["kind"]>> = ["website", "email", "github", "linkedin", "scholar", "download", "external"];
const faqCategories: FaqItem["category"][] = ["background", "projects", "publications", "contact", "other"];
const galleryCategories: GalleryCategory[] = ["academic", "campus", "travel", "daily-life", "events", "workspace"];
const peopleCategories: PeopleCategory[] = ["mentor", "collaborator", "lab", "peer", "advisor", "other"];
const visibilityOptions = ["public", "hidden"] as const;

export function ContentEditor({
  persona,
  dictionary,
  locale,
  suggestedQuestions,
  requiresAdminGuard = false
}: {
  persona: PersonaContent;
  dictionary: Dictionary;
  locale: Locale;
  suggestedQuestions: string[];
  requiresAdminGuard?: boolean;
}) {
  const initialDraft = useMemo<EditorDraft>(() => createDraft(persona, suggestedQuestions), [persona, suggestedQuestions]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<EditorDraft>(initialDraft);
  const [activeTab, setActiveTab] = useState<EditorTab>("profile");
  const [status, setStatus] = useState("Loaded from file-based content.");
  const [importError, setImportError] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [adminVerified, setAdminVerified] = useState(!requiresAdminGuard);
  const [adminStatus, setAdminStatus] = useState(requiresAdminGuard ? "Enter the owner token to unlock the editor." : "Local development guard is open.");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const imported = parseImportedDraft(JSON.parse(stored), initialDraft);
      setDraft(imported.draft);
      setStatus("Restored local browser draft.");
    } catch {
      window.localStorage.removeItem(storageKey);
      setStatus("Discarded an unreadable local draft.");
    }
  }, [initialDraft]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft]);

  function updateDraft(updater: (current: EditorDraft) => EditorDraft) {
    setDraft((current) => markUpdated(updater(current)));
  }

  function updatePersona(updater: (persona: PersonaContent) => PersonaContent) {
    updateDraft((current) => ({ ...current, persona: updater(current.persona) }));
  }

  function resetDraft() {
    if (!window.confirm("Reset the browser draft to the content currently loaded from source files?")) return;
    window.localStorage.removeItem(storageKey);
    setDraft(initialDraft);
    setImportError(null);
    setStatus("Draft reset to source content.");
  }

  function exportDraft() {
    const content = JSON.stringify({ ...draft, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${draft.persona.id}-content-draft-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Exported the current draft as JSON.");
  }

  async function importDraft(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const raw = await file.text();
      const parsed = parseImportedDraft(JSON.parse(raw), initialDraft);
      const summary = `Import ${parsed.draft.persona.profile.name} with ${parsed.draft.persona.projects.length} projects, ${parsed.draft.persona.notes.length} notes, and ${parsed.draft.persona.publications.length} publications? This replaces the current browser draft only.`;
      if (!window.confirm(summary)) return;

      setDraft(markUpdated(parsed.draft));
      setImportError(null);
      setStatus(`Imported ${file.name}.`);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Could not import this JSON file.");
      setStatus("Import failed.");
    }
  }

  const activeTabInfo = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  if (requiresAdminGuard && !adminVerified) {
    return <AdminGate token={adminToken} setToken={setAdminToken} status={adminStatus} setStatus={setAdminStatus} onVerified={() => setAdminVerified(true)} />;
  }

  return (
    <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,620px)_1fr]">
      <section className="section-card self-start">
        <div className="flex flex-col gap-4 border-b border-ink-200 pb-5 dark:border-white/10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-950 dark:text-white">{draft.persona.label}</p>
            <p className="mt-1 text-sm leading-6 text-ink-600 dark:text-ink-300">
              Edit a local browser draft, preview it, then export JSON for the file-based content model. Imports replace only this browser draft.
            </p>
            <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
              Last changed {formatDateTime(draft.updatedAt, locale)}. {status}
            </p>
            {importError ? <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">{importError}</p> : null}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void importDraft(event)} />
            <button type="button" className="button-secondary px-4 py-2" onClick={() => fileInputRef.current?.click()}>
              Import JSON
            </button>
            <button type="button" className="button-secondary px-4 py-2" onClick={resetDraft}>
              Reset
            </button>
            <button type="button" className="button-primary px-4 py-2" onClick={exportDraft}>
              Export JSON
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Editor sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "shrink-0 rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-ink-950"
                  : "shrink-0 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-600 hover:border-accent-500 hover:text-accent-600 dark:border-white/10 dark:text-ink-300"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-ink-200 bg-ink-50/70 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold text-ink-950 dark:text-white">{activeTabInfo.label}</p>
          <p className="mt-1 text-sm leading-6 text-ink-600 dark:text-ink-300">{activeTabInfo.description}</p>
        </div>

        <div className="mt-6">
          {activeTab === "profile" ? <ProfileEditor draft={draft.persona} updatePersona={updatePersona} /> : null}
          {activeTab === "builder" ? <ProfileBuilderEditor draft={draft} locale={locale} adminToken={adminToken} updateDraft={updateDraft} /> : null}
          {activeTab === "media" ? <MediaEditor draft={draft.persona} updatePersona={updatePersona} /> : null}
          {activeTab === "homepage" ? <HomepageEditor draft={draft.persona} updatePersona={updatePersona} /> : null}
          {activeTab === "gallery" ? <GalleryEditor draft={draft.persona} updatePersona={updatePersona} dictionary={dictionary} /> : null}
          {activeTab === "people" ? <PeopleEditor draft={draft.persona} updatePersona={updatePersona} dictionary={dictionary} /> : null}
          {activeTab === "projects" ? <ProjectsEditor draft={draft.persona} updatePersona={updatePersona} dictionary={dictionary} /> : null}
          {activeTab === "notes" ? <NotesEditor draft={draft.persona} updatePersona={updatePersona} dictionary={dictionary} /> : null}
          {activeTab === "publications" ? <PublicationsEditor draft={draft.persona} updatePersona={updatePersona} /> : null}
          {activeTab === "assistant" ? <AssistantEditor draft={draft} updateDraft={updateDraft} /> : null}
          {activeTab === "publish" ? <PublishEditor draft={draft} adminToken={adminToken} setAdminToken={setAdminToken} exportDraft={exportDraft} /> : null}
        </div>
      </section>

      <aside className="section-card xl:sticky xl:top-24 xl:self-start">
        <div className="flex flex-col gap-2 border-b border-ink-200 pb-4 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="form-label">Live homepage preview</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">{draft.persona.profile.name}</h2>
          </div>
          <p className="text-xs text-ink-500 dark:text-ink-400">{draft.persona.homepage.sections.filter((section) => section.enabled).length} sections enabled</p>
        </div>
        <div className="mt-6 max-h-[760px] overflow-y-auto rounded-lg border border-ink-200 bg-ink-50 px-4 dark:border-white/10 dark:bg-ink-950">
          <HomepageRenderer persona={draft.persona} dictionary={dictionary} />
        </div>
      </aside>
    </div>
  );
}

function AdminGate({
  token,
  setToken,
  status,
  setStatus,
  onVerified
}: {
  token: string;
  setToken: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  onVerified: () => void;
}) {
  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Checking owner token...");
    try {
      const response = await fetch("/api/admin/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({})
      });
      if (!response.ok) {
        setStatus("Token verification failed.");
        return;
      }
      onVerified();
      setStatus("Editor unlocked.");
    } catch {
      setStatus("Could not reach the verification route.");
    }
  }

  return (
    <section className="section-card mt-10 max-w-xl">
      <p className="form-label">Owner guard</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink-950 dark:text-white">Editor is protected</h2>
      <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">
        Production editor access requires the server-side admin token. The token is checked by an API route and is not exposed by the site.
      </p>
      <form className="mt-5 space-y-4" onSubmit={(event) => void verify(event)}>
        <Field label="Admin token" value={token} type="password" onChange={setToken} />
        <button type="submit" className="button-primary px-4 py-2">
          Unlock editor
        </button>
      </form>
      <p className="mt-4 text-xs text-ink-500 dark:text-ink-400">{status}</p>
    </section>
  );
}

function ProfileBuilderEditor({
  draft,
  locale,
  adminToken,
  updateDraft
}: {
  draft: EditorDraft;
  locale: Locale;
  adminToken: string;
  updateDraft: (updater: (current: EditorDraft) => EditorDraft) => void;
}) {
  const [input, setInput] = useState<ProfileBuilderInput>(() => ({
    name: draft.persona.profile.name,
    chineseName: "",
    title: draft.persona.profile.title,
    shortBio: draft.persona.profile.bio,
    researchInterests: draft.persona.profile.interests.join("\n"),
    education: "",
    projects: draft.persona.projects.map((project) => `${project.title}: ${project.summary}`).join("\n"),
    notesInterests: draft.persona.notes.map((note) => `${note.title}: ${note.summary}`).join("\n"),
    contactPreferences: draft.persona.profile.contact.map((channel) => `${channel.label}: ${channel.value}`).join("\n"),
    preferredTone: draft.persona.ai.tone,
    languages: locale === "zh" ? "Chinese and English" : "English and Chinese",
    galleryDescription: "Use placeholders until real public-safe photos are added.",
    relatedPeople: "Only include verified public names and relationships.",
    publicPrivateBoundaries: "Do not include private contact details, private commitments, unverified collaborators, or unpublished claims."
  }));
  const [generated, setGenerated] = useState<GeneratedProfileResponse | null>(null);
  const [status, setStatus] = useState("Provide public-safe source material, then generate a structured draft.");
  const [isGenerating, setIsGenerating] = useState(false);

  function updateInput(patch: Partial<ProfileBuilderInput>) {
    setInput((current) => ({ ...current, ...patch }));
  }

  async function generateDraft() {
    setIsGenerating(true);
    setStatus("Generating structured content...");
    setGenerated(null);
    try {
      const response = await fetch("/api/editor/generate-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { "x-admin-token": adminToken } : {})
        },
        body: JSON.stringify({ input, currentPersona: draft.persona, locale })
      });
      const data = (await response.json()) as GeneratedProfileResponse;
      if (!response.ok || data.error) {
        setStatus(data.error ?? "Profile generation failed.");
        return;
      }
      if (!isRecord(data.personaPatch)) {
        setStatus("The generated response did not contain a valid persona patch.");
        return;
      }
      setGenerated(data);
      setStatus(data.meta?.usedFallback ? "Generated a deterministic local draft because the AI provider is not configured." : "Generated a draft for review.");
    } catch {
      setStatus("Could not reach the profile generation route.");
    } finally {
      setIsGenerating(false);
    }
  }

  function applyGenerated() {
    if (!generated?.personaPatch) return;
    updateDraft((current) => ({ ...current, persona: mergePersonaPatch(current.persona, generated.personaPatch) }));
    setStatus("Applied the generated patch to the browser draft. Export or publish explicitly when ready.");
  }

  return (
    <div className="space-y-6">
      <EditorGroup
        title="AI Profile Builder"
        description="Generate a PersonaContent-compatible patch from owner-provided facts. The route is protected and instructed not to invent missing information."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" value={input.name} onChange={(value) => updateInput({ name: value })} />
          <Field label="Chinese name" value={input.chineseName} onChange={(value) => updateInput({ chineseName: value })} />
          <Field label="Role / title" value={input.title} onChange={(value) => updateInput({ title: value })} />
          <Field label="Preferred languages" value={input.languages} onChange={(value) => updateInput({ languages: value })} />
        </div>
        <TextArea label="Short bio" value={input.shortBio} rows={5} onChange={(value) => updateInput({ shortBio: value })} />
        <TextArea label="Research interests" value={input.researchInterests} rows={4} onChange={(value) => updateInput({ researchInterests: value })} />
        <TextArea label="Education" value={input.education} rows={4} onChange={(value) => updateInput({ education: value })} />
        <TextArea label="Projects" value={input.projects} rows={4} onChange={(value) => updateInput({ projects: value })} />
        <TextArea label="Notes / writing interests" value={input.notesInterests} rows={4} onChange={(value) => updateInput({ notesInterests: value })} />
        <TextArea label="Contact preferences" value={input.contactPreferences} rows={3} onChange={(value) => updateInput({ contactPreferences: value })} />
        <TextArea label="Preferred tone" value={input.preferredTone} rows={3} onChange={(value) => updateInput({ preferredTone: value })} />
        <TextArea label="Gallery description / categories" value={input.galleryDescription} rows={3} onChange={(value) => updateInput({ galleryDescription: value })} />
        <TextArea label="Related people / mentors / collaborators" value={input.relatedPeople} rows={4} onChange={(value) => updateInput({ relatedPeople: value })} />
        <TextArea label="Public/private boundary notes" value={input.publicPrivateBoundaries} rows={4} onChange={(value) => updateInput({ publicPrivateBoundaries: value })} />
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="button-primary px-4 py-2" onClick={() => void generateDraft()} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate draft"}
          </button>
          {generated ? (
            <button type="button" className="button-secondary px-4 py-2" onClick={applyGenerated}>
              Apply generated patch
            </button>
          ) : null}
        </div>
        <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{status}</p>
      </EditorGroup>

      {generated ? (
        <EditorGroup title="Generated preview" description="Review before applying. This does not write source files or deploy.">
          <p className="text-sm leading-6 text-ink-700 dark:text-ink-200">{generated.summary}</p>
          {generated.warnings?.length ? <ListPreview title="Warnings" items={generated.warnings} /> : null}
          <pre className="max-h-80 overflow-auto rounded-lg bg-ink-950 p-4 text-xs leading-5 text-white">{JSON.stringify(generated.personaPatch, null, 2)}</pre>
        </EditorGroup>
      ) : null}
    </div>
  );
}

function MediaEditor({ draft, updatePersona }: EditorPanelProps) {
  const portrait = draft.profile.portrait ?? { src: "", alt: "", placeholder: true };
  const personalNote = draft.profile.personalNote ?? { enabled: false, title: "A more personal note", body: "" };

  return (
    <div className="space-y-6">
      <EditorGroup title="Portrait and cover" description="Use public-safe image paths under /public. Leave paths blank to use the initials fallback.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Portrait path" value={portrait.src} onChange={(value) => updatePortrait(updatePersona, { src: value })} />
          <Field label="Portrait alt text" value={portrait.alt} onChange={(value) => updatePortrait(updatePersona, { alt: value })} />
          <Field label="Portrait caption" value={portrait.caption ?? ""} onChange={(value) => updatePortrait(updatePersona, { caption: value || undefined })} />
          <Field label="Replacement file note" value={portrait.replacePath ?? ""} onChange={(value) => updatePortrait(updatePersona, { replacePath: value || undefined })} />
          <Field label="Cover image path" value={portrait.coverSrc ?? ""} onChange={(value) => updatePortrait(updatePersona, { coverSrc: value || undefined })} />
          <Field label="Cover alt text" value={portrait.coverAlt ?? ""} onChange={(value) => updatePortrait(updatePersona, { coverAlt: value || undefined })} />
        </div>
        <TextArea label="Image note" value={portrait.note ?? ""} onChange={(value) => updatePortrait(updatePersona, { note: value || undefined })} />
        <label className="flex items-center gap-3 text-sm text-ink-700 dark:text-ink-200">
          <input
            type="checkbox"
            checked={Boolean(portrait.placeholder)}
            onChange={(event) => updatePortrait(updatePersona, { placeholder: event.target.checked })}
            className="rounded border-ink-300 text-accent-600 focus:ring-accent-600"
          />
          Mark as placeholder
        </label>
      </EditorGroup>

      <EditorGroup title="About personal note" description="A warmer public note for the About page. Keep it factual, calm, and non-private.">
        <label className="flex items-center gap-3 text-sm text-ink-700 dark:text-ink-200">
          <input
            type="checkbox"
            checked={personalNote.enabled}
            onChange={(event) => updatePersonalNote(updatePersona, { enabled: event.target.checked })}
            className="rounded border-ink-300 text-accent-600 focus:ring-accent-600"
          />
          Show this section on About
        </label>
        <Field label="Section title" value={personalNote.title} onChange={(value) => updatePersonalNote(updatePersona, { title: value })} />
        <ListField label="Body paragraphs" value={Array.isArray(personalNote.body) ? personalNote.body : personalNote.body ? [personalNote.body] : []} onChange={(items) => updatePersonalNote(updatePersona, { body: items })} />
      </EditorGroup>
    </div>
  );
}

function GalleryEditor({ draft, updatePersona, dictionary }: EditorPanelProps & { dictionary: Dictionary }) {
  const items = draft.gallery ?? [];

  return (
    <EditorGroup
      title="Gallery items"
      description="Use real images only when they are public-safe. Placeholder records should be explicit."
      action={<AddButton label="Add gallery item" onClick={() => addGalleryItem(updatePersona)} />}
    >
      <RepeatableEmptyState show={items.length === 0} label="No gallery items configured." />
      {items.map((item, index) => (
        <EditableBlock
          key={`${item.id}-${index}`}
          title={item.title || "Untitled gallery item"}
          meta={`${dictionary.labels.galleryCategory[item.category]} · ${item.visibility ?? "public"}`}
          onMoveUp={() => moveGalleryItem(updatePersona, index, -1)}
          onMoveDown={() => moveGalleryItem(updatePersona, index, 1)}
          onRemove={() => removeGalleryItem(updatePersona, index)}
          disableUp={index === 0}
          disableDown={index === items.length - 1}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ID" value={item.id} onChange={(value) => updateGalleryItem(updatePersona, index, { id: slugify(value) })} />
            <Field label="Title" value={item.title} onChange={(value) => updateGalleryItem(updatePersona, index, { title: value })} />
            <Field label="Image path" value={item.image ?? ""} onChange={(value) => updateGalleryItem(updatePersona, index, { image: value || undefined })} />
            <Field label="Alt text" value={item.alt} onChange={(value) => updateGalleryItem(updatePersona, index, { alt: value })} />
            <Field label="Date" value={item.date ?? ""} onChange={(value) => updateGalleryItem(updatePersona, index, { date: value || undefined })} />
            <Field label="Year" value={item.year ?? ""} onChange={(value) => updateGalleryItem(updatePersona, index, { year: value || undefined })} />
            <Field label="Location" value={item.location ?? ""} onChange={(value) => updateGalleryItem(updatePersona, index, { location: value || undefined })} />
            <Select label="Category" value={item.category} options={galleryCategories} onChange={(value) => updateGalleryItem(updatePersona, index, { category: value as GalleryCategory })} />
            <Select label="Visibility" value={item.visibility ?? "public"} options={visibilityOptions} onChange={(value) => updateGalleryItem(updatePersona, index, { visibility: value as GalleryItem["visibility"] })} />
          </div>
          <TextArea label="Description" value={item.description} rows={4} onChange={(value) => updateGalleryItem(updatePersona, index, { description: value })} />
          <TextArea label="Caption" value={item.caption ?? ""} rows={3} onChange={(value) => updateGalleryItem(updatePersona, index, { caption: value || undefined })} />
          <ListField label="Tags" value={item.tags} onChange={(tags) => updateGalleryItem(updatePersona, index, { tags })} />
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-3 text-sm text-ink-700 dark:text-ink-200">
              <input type="checkbox" checked={Boolean(item.featured)} onChange={(event) => updateGalleryItem(updatePersona, index, { featured: event.target.checked })} className="rounded border-ink-300 text-accent-600 focus:ring-accent-600" />
              Featured
            </label>
            <label className="flex items-center gap-3 text-sm text-ink-700 dark:text-ink-200">
              <input type="checkbox" checked={Boolean(item.placeholder)} onChange={(event) => updateGalleryItem(updatePersona, index, { placeholder: event.target.checked })} className="rounded border-ink-300 text-accent-600 focus:ring-accent-600" />
              Placeholder
            </label>
          </div>
        </EditableBlock>
      ))}
    </EditorGroup>
  );
}

function PeopleEditor({ draft, updatePersona, dictionary }: EditorPanelProps & { dictionary: Dictionary }) {
  const people = draft.people ?? [];

  return (
    <EditorGroup
      title="Related people"
      description="List only verified public relationships. Avoid private contact details and unverified links."
      action={<AddButton label="Add person" onClick={() => addPerson(updatePersona)} />}
    >
      <RepeatableEmptyState show={people.length === 0} label="No related people configured." />
      {people.map((person, index) => (
        <EditableBlock
          key={`${person.id}-${index}`}
          title={person.name || "Untitled person"}
          meta={`${dictionary.labels.peopleCategory[person.category]} · ${person.visibility ?? "public"}`}
          onMoveUp={() => movePerson(updatePersona, index, -1)}
          onMoveDown={() => movePerson(updatePersona, index, 1)}
          onRemove={() => removePerson(updatePersona, index)}
          disableUp={index === 0}
          disableDown={index === people.length - 1}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ID" value={person.id} onChange={(value) => updatePerson(updatePersona, index, { id: slugify(value) })} />
            <Field label="Name" value={person.name} onChange={(value) => updatePerson(updatePersona, index, { name: value })} />
            <Field label="Role" value={person.role} onChange={(value) => updatePerson(updatePersona, index, { role: value })} />
            <Field label="Relationship" value={person.relationship} onChange={(value) => updatePerson(updatePersona, index, { relationship: value })} />
            <Field label="Affiliation" value={person.affiliation ?? ""} onChange={(value) => updatePerson(updatePersona, index, { affiliation: value || undefined })} />
            <Field label="Public link" value={person.link ?? ""} onChange={(value) => updatePerson(updatePersona, index, { link: value || undefined })} />
            <Field label="Image path" value={person.image ?? ""} onChange={(value) => updatePerson(updatePersona, index, { image: value || undefined })} />
            <Select label="Category" value={person.category} options={peopleCategories} onChange={(value) => updatePerson(updatePersona, index, { category: value as PeopleCategory })} />
            <Select label="Visibility" value={person.visibility ?? "public"} options={visibilityOptions} onChange={(value) => updatePerson(updatePersona, index, { visibility: value as PersonConnection["visibility"] })} />
          </div>
          <TextArea label="Description" value={person.description} rows={4} onChange={(value) => updatePerson(updatePersona, index, { description: value })} />
          <ListField label="Tags" value={person.tags} onChange={(tags) => updatePerson(updatePersona, index, { tags })} />
        </EditableBlock>
      ))}
    </EditorGroup>
  );
}

function PublishEditor({
  draft,
  adminToken,
  setAdminToken,
  exportDraft
}: {
  draft: EditorDraft;
  adminToken: string;
  setAdminToken: (value: string) => void;
  exportDraft: () => void;
}) {
  const [status, setStatus] = useState("Export JSON is always available. Server publish requires owner credentials and server env vars.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function callPublish(deploy: boolean) {
    setIsSubmitting(true);
    setStatus(deploy ? "Publishing content and requesting deploy..." : "Publishing content...");
    try {
      const response = await fetch("/api/admin/publish-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { "x-admin-token": adminToken } : {})
        },
        body: JSON.stringify({ persona: draft.persona, deploy })
      });
      const data = (await response.json()) as { message?: string; error?: string };
      setStatus(data.message ?? data.error ?? "Publish route returned without a message.");
    } catch {
      setStatus("Could not reach the publish route.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function triggerDeploy() {
    setIsSubmitting(true);
    setStatus("Requesting deploy hook...");
    try {
      const response = await fetch("/api/admin/trigger-deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { "x-admin-token": adminToken } : {})
        },
        body: JSON.stringify({})
      });
      const data = (await response.json()) as { message?: string; error?: string };
      setStatus(data.message ?? data.error ?? "Deploy route returned without a message.");
    } catch {
      setStatus("Could not reach the deploy route.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <EditorGroup title="Safe publish workflow" description="Public visitors never receive tokens or deploy hook URLs. These buttons call protected server routes only.">
        <Field label="Admin token for protected routes" value={adminToken} type="password" onChange={setAdminToken} />
        <div className="flex flex-wrap gap-3">
          <button type="button" className="button-secondary px-4 py-2" onClick={exportDraft}>
            Export JSON
          </button>
          <button type="button" className="button-primary px-4 py-2" onClick={() => void callPublish(false)} disabled={isSubmitting}>
            Publish content
          </button>
          <button type="button" className="button-secondary px-4 py-2" onClick={() => void callPublish(true)} disabled={isSubmitting}>
            Publish and deploy
          </button>
          <button type="button" className="button-secondary px-4 py-2" onClick={() => void triggerDeploy()} disabled={isSubmitting}>
            Trigger deploy hook
          </button>
        </div>
        <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{status}</p>
      </EditorGroup>
    </div>
  );
}

function ProfileEditor({ draft, updatePersona }: EditorPanelProps) {
  return (
    <div className="space-y-6">
      <EditorGroup title="Core profile" description="These fields appear across the hero, about, CV, and assistant retrieval.">
        <Field label="Name" value={draft.profile.name} onChange={(value) => updateProfile(updatePersona, { name: value })} />
        <Field label="Title" value={draft.profile.title} onChange={(value) => updateProfile(updatePersona, { title: value })} />
        <Field label="Tagline" value={draft.profile.tagline} onChange={(value) => updateProfile(updatePersona, { tagline: value })} />
        <TextArea label="Bio" value={draft.profile.bio} rows={5} onChange={(value) => updateProfile(updatePersona, { bio: value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location" value={draft.profile.location ?? ""} onChange={(value) => updateProfile(updatePersona, { location: value || undefined })} />
          <Field label="Affiliation" value={draft.profile.affiliation ?? ""} onChange={(value) => updateProfile(updatePersona, { affiliation: value || undefined })} />
        </div>
        <ListField label="Interests" value={draft.profile.interests} onChange={(items) => updateProfile(updatePersona, { interests: items })} />
      </EditorGroup>

      <EditorGroup
        title="Public links"
        description="Links appear on the about page and are available to the assistant as public source context."
        action={<AddButton label="Add link" onClick={() => addProfileLink(updatePersona)} />}
      >
        <RepeatableEmptyState show={draft.profile.links.length === 0} label="No public links yet." />
        {draft.profile.links.map((link, index) => (
          <EditableBlock
            key={`${link.href}-${index}`}
            title={link.label || "Untitled link"}
            meta={link.href}
            onMoveUp={() => moveProfileLink(updatePersona, index, -1)}
            onMoveDown={() => moveProfileLink(updatePersona, index, 1)}
            onRemove={() => removeProfileLink(updatePersona, index)}
            disableUp={index === 0}
            disableDown={index === draft.profile.links.length - 1}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Label" value={link.label} onChange={(value) => updateProfileLink(updatePersona, index, { label: value })} />
              <Field label="Href" value={link.href} onChange={(value) => updateProfileLink(updatePersona, index, { href: value })} />
              <Select
                label="Kind"
                value={link.kind ?? "website"}
                options={linkKinds}
                onChange={(value) => updateProfileLink(updatePersona, index, { kind: value as ContentLink["kind"] })}
              />
            </div>
          </EditableBlock>
        ))}
      </EditorGroup>

      <EditorGroup
        title="Contact channels"
        description="Preferred contact is used by Contact, CV, hero actions, and assistant routing."
        action={<AddButton label="Add contact" onClick={() => addContact(updatePersona)} />}
      >
        <RepeatableEmptyState show={draft.profile.contact.length === 0} label="No contact channels yet." />
        {draft.profile.contact.map((contact, index) => (
          <EditableBlock
            key={`${contact.href}-${index}`}
            title={contact.label || "Untitled contact"}
            meta={contact.value}
            onMoveUp={() => moveContact(updatePersona, index, -1)}
            onMoveDown={() => moveContact(updatePersona, index, 1)}
            onRemove={() => removeContact(updatePersona, index)}
            disableUp={index === 0}
            disableDown={index === draft.profile.contact.length - 1}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Label" value={contact.label} onChange={(value) => updateContact(updatePersona, index, { label: value })} />
              <Field label="Value" value={contact.value} onChange={(value) => updateContact(updatePersona, index, { value })} />
              <Field label="Href" value={contact.href} onChange={(value) => updateContact(updatePersona, index, { href: value })} />
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm text-ink-700 dark:text-ink-200">
              <input
                type="checkbox"
                checked={Boolean(contact.preferred)}
                onChange={() => setPreferredContact(updatePersona, index)}
                className="rounded border-ink-300 text-accent-600 focus:ring-accent-600"
              />
              Preferred public contact
            </label>
          </EditableBlock>
        ))}
      </EditorGroup>
    </div>
  );
}

function HomepageEditor({ draft, updatePersona }: EditorPanelProps) {
  const missingSections = sectionTypeOptions.filter((type) => !draft.homepage.sections.some((section) => section.type === type));

  return (
    <div className="space-y-6">
      <EditorGroup
        title="Homepage sections"
        description="Control homepage order and visibility. Disabled sections stay in the draft and can be re-enabled later."
        action={missingSections.length > 0 ? <AddButton label="Add section" onClick={() => addSection(updatePersona, missingSections[0])} /> : undefined}
      >
        {missingSections.length > 0 ? (
          <Select
            label="Add missing section type"
            value={missingSections[0]}
            options={missingSections}
            onChange={(value) => addSection(updatePersona, value as SectionType)}
          />
        ) : null}
        {draft.homepage.sections.map((section, index) => (
          <EditableBlock
            key={`${section.id}-${index}`}
            title={section.title || section.type}
            meta={section.enabled ? "Enabled" : "Hidden"}
            onMoveUp={() => moveSection(updatePersona, index, -1)}
            onMoveDown={() => moveSection(updatePersona, index, 1)}
            onRemove={() => removeSection(updatePersona, index)}
            disableUp={index === 0}
            disableDown={index === draft.homepage.sections.length - 1}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Section ID" value={section.id} onChange={(value) => updateSection(updatePersona, index, { id: slugify(value || section.type) })} />
              <Field label="Optional title" value={section.title ?? ""} onChange={(value) => updateSection(updatePersona, index, { title: value || undefined })} />
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm text-ink-700 dark:text-ink-200">
              <input
                type="checkbox"
                checked={section.enabled}
                onChange={(event) => updateSection(updatePersona, index, { enabled: event.target.checked })}
                className="rounded border-ink-300 text-accent-600 focus:ring-accent-600"
              />
              Enabled on homepage
            </label>
          </EditableBlock>
        ))}
      </EditorGroup>

      <EditorGroup title="Stats" description="Small homepage metrics. Keep them short enough to scan." action={<AddButton label="Add stat" onClick={() => addStat(updatePersona)} />}>
        <RepeatableEmptyState show={draft.homepage.stats.length === 0} label="No stats configured." />
        {draft.homepage.stats.map((stat, index) => (
          <EditableBlock
            key={`${stat.label}-${index}`}
            title={stat.label || "Untitled stat"}
            meta={stat.value}
            onMoveUp={() => moveStat(updatePersona, index, -1)}
            onMoveDown={() => moveStat(updatePersona, index, 1)}
            onRemove={() => removeStat(updatePersona, index)}
            disableUp={index === 0}
            disableDown={index === draft.homepage.stats.length - 1}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Value" value={stat.value} onChange={(value) => updateStat(updatePersona, index, { value })} />
              <Field label="Label" value={stat.label} onChange={(value) => updateStat(updatePersona, index, { label: value })} />
            </div>
          </EditableBlock>
        ))}
      </EditorGroup>

      <EditorGroup title="Timeline" description="Used by homepage experience and CV." action={<AddButton label="Add entry" onClick={() => addTimelineItem(updatePersona)} />}>
        <RepeatableEmptyState show={draft.homepage.timeline.length === 0} label="No timeline entries configured." />
        {draft.homepage.timeline.map((item, index) => (
          <EditableBlock
            key={`${item.title}-${index}`}
            title={item.title || "Untitled entry"}
            meta={item.period}
            onMoveUp={() => moveTimelineItem(updatePersona, index, -1)}
            onMoveDown={() => moveTimelineItem(updatePersona, index, 1)}
            onRemove={() => removeTimelineItem(updatePersona, index)}
            disableUp={index === 0}
            disableDown={index === draft.homepage.timeline.length - 1}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" value={item.title} onChange={(value) => updateTimelineItem(updatePersona, index, { title: value })} />
              <Field label="Organization" value={item.organization} onChange={(value) => updateTimelineItem(updatePersona, index, { organization: value })} />
              <Field label="Period" value={item.period} onChange={(value) => updateTimelineItem(updatePersona, index, { period: value })} />
            </div>
            <TextArea label="Summary" value={item.summary} onChange={(value) => updateTimelineItem(updatePersona, index, { summary: value })} />
          </EditableBlock>
        ))}
      </EditorGroup>
    </div>
  );
}

function ProjectsEditor({ draft, updatePersona, dictionary }: EditorPanelProps & { dictionary: Dictionary }) {
  return (
    <EditorGroup
      title="Projects"
      description="Project records power cards, detail pages, CV highlights, and assistant retrieval."
      action={<AddButton label="Add project" onClick={() => addProject(updatePersona)} />}
    >
      <RepeatableEmptyState show={draft.projects.length === 0} label="No projects configured." />
      {draft.projects.map((project, index) => (
        <EditableBlock
          key={`${project.slug}-${index}`}
          title={project.title || "Untitled project"}
          meta={`${dictionary.labels.status[project.status]} · ${project.period ?? project.date}`}
          onMoveUp={() => moveProject(updatePersona, index, -1)}
          onMoveDown={() => moveProject(updatePersona, index, 1)}
          onRemove={() => removeProject(updatePersona, index)}
          disableUp={index === 0}
          disableDown={index === draft.projects.length - 1}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" value={project.slug} onChange={(value) => updateProject(updatePersona, index, { slug: slugify(value) })} />
            <Field label="Title" value={project.title} onChange={(value) => updateProject(updatePersona, index, { title: value })} />
            <Field label="Subtitle" value={project.subtitle ?? ""} onChange={(value) => updateProject(updatePersona, index, { subtitle: value || undefined })} />
            <Field label="Date" value={project.date} onChange={(value) => updateProject(updatePersona, index, { date: value })} />
            <Field label="Period" value={project.period ?? ""} onChange={(value) => updateProject(updatePersona, index, { period: value || undefined })} />
            <Field label="Role" value={project.role ?? ""} onChange={(value) => updateProject(updatePersona, index, { role: value || undefined })} />
            <Select
              label="Status"
              value={project.status}
              options={Object.keys(dictionary.labels.status)}
              onChange={(value) => updateProject(updatePersona, index, { status: value as Project["status"] })}
            />
          </div>
          <TextArea label="Summary" value={project.summary} onChange={(value) => updateProject(updatePersona, index, { summary: value })} />
          <TextArea label="Description" value={project.description} rows={4} onChange={(value) => updateProject(updatePersona, index, { description: value })} />
          <TextArea label="Problem" value={project.problem ?? ""} onChange={(value) => updateProject(updatePersona, index, { problem: value || undefined })} />
          <ListField label="Approach" value={project.approach ?? []} onChange={(items) => updateProject(updatePersona, index, { approach: items })} />
          <ListField label="Outcomes" value={project.outcomes ?? []} onChange={(items) => updateProject(updatePersona, index, { outcomes: items })} />
          <ListField label="Highlights" value={project.highlights ?? []} onChange={(items) => updateProject(updatePersona, index, { highlights: items })} />
          <ListField label="Tags" value={project.tags} onChange={(items) => updateProject(updatePersona, index, { tags: items })} />
          <LinksEditor links={project.links} onChange={(links) => updateProject(updatePersona, index, { links })} />
          <label className="flex items-center gap-3 text-sm text-ink-700 dark:text-ink-200">
            <input
              type="checkbox"
              checked={Boolean(project.featured)}
              onChange={(event) => updateProject(updatePersona, index, { featured: event.target.checked })}
              className="rounded border-ink-300 text-accent-600 focus:ring-accent-600"
            />
            Feature on homepage and CV
          </label>
        </EditableBlock>
      ))}
    </EditorGroup>
  );
}

function NotesEditor({ draft, updatePersona, dictionary }: EditorPanelProps & { dictionary: Dictionary }) {
  return (
    <EditorGroup
      title="Notes"
      description="Notes are public writing sources for readers and the assistant."
      action={<AddButton label="Add note" onClick={() => addNote(updatePersona)} />}
    >
      <RepeatableEmptyState show={draft.notes.length === 0} label="No notes configured." />
      {draft.notes.map((note, index) => (
        <EditableBlock
          key={`${note.slug}-${index}`}
          title={note.title || "Untitled note"}
          meta={`${note.date} · ${dictionary.labels.readingLevel[note.readingLevel]}`}
          onMoveUp={() => moveNote(updatePersona, index, -1)}
          onMoveDown={() => moveNote(updatePersona, index, 1)}
          onRemove={() => removeNote(updatePersona, index)}
          disableUp={index === 0}
          disableDown={index === draft.notes.length - 1}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" value={note.slug} onChange={(value) => updateNote(updatePersona, index, { slug: slugify(value) })} />
            <Field label="Title" value={note.title} onChange={(value) => updateNote(updatePersona, index, { title: value })} />
            <Field label="Date" value={note.date} onChange={(value) => updateNote(updatePersona, index, { date: value })} />
            <Field label="Audience" value={note.audience ?? ""} onChange={(value) => updateNote(updatePersona, index, { audience: value || undefined })} />
            <Select
              label="Reading level"
              value={note.readingLevel}
              options={Object.keys(dictionary.labels.readingLevel)}
              onChange={(value) => updateNote(updatePersona, index, { readingLevel: value as Note["readingLevel"] })}
            />
          </div>
          <TextArea label="Summary" value={note.summary} onChange={(value) => updateNote(updatePersona, index, { summary: value })} />
          <TextArea label="Body" value={note.body} rows={5} onChange={(value) => updateNote(updatePersona, index, { body: value })} />
          <ListField label="Tags" value={note.tags} onChange={(items) => updateNote(updatePersona, index, { tags: items })} />
        </EditableBlock>
      ))}
    </EditorGroup>
  );
}

function PublicationsEditor({ draft, updatePersona }: EditorPanelProps) {
  return (
    <EditorGroup
      title="Publications"
      description="Publication records appear on /publications and are retrievable by the assistant."
      action={<AddButton label="Add publication" onClick={() => addPublication(updatePersona)} />}
    >
      <RepeatableEmptyState show={draft.publications.length === 0} label="No publications configured." />
      {draft.publications.map((publication, index) => (
        <EditableBlock
          key={`${publication.title}-${index}`}
          title={publication.title || "Untitled publication"}
          meta={`${publication.venue} · ${publication.year || "Year"}`}
          onMoveUp={() => movePublication(updatePersona, index, -1)}
          onMoveDown={() => movePublication(updatePersona, index, 1)}
          onRemove={() => removePublication(updatePersona, index)}
          disableUp={index === 0}
          disableDown={index === draft.publications.length - 1}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" value={publication.title} onChange={(value) => updatePublication(updatePersona, index, { title: value })} />
            <Field label="Venue" value={publication.venue} onChange={(value) => updatePublication(updatePersona, index, { venue: value })} />
            <Field label="Year" value={String(publication.year)} onChange={(value) => updatePublication(updatePersona, index, { year: Number(value) || new Date().getFullYear() })} />
          </div>
          <ListField label="Authors" value={publication.authors} onChange={(items) => updatePublication(updatePersona, index, { authors: items })} />
          <TextArea label="Abstract" value={publication.abstract} rows={4} onChange={(value) => updatePublication(updatePersona, index, { abstract: value })} />
          <ListField label="Tags" value={publication.tags} onChange={(items) => updatePublication(updatePersona, index, { tags: items })} />
          <LinksEditor links={publication.links} onChange={(links) => updatePublication(updatePersona, index, { links })} />
        </EditableBlock>
      ))}
    </EditorGroup>
  );
}

function AssistantEditor({ draft, updateDraft }: { draft: EditorDraft; updateDraft: (updater: (current: EditorDraft) => EditorDraft) => void }) {
  function updateAi(patch: Partial<AiInstructions>) {
    updateDraft((current) => ({ ...current, persona: { ...current.persona, ai: { ...current.persona.ai, ...patch } } }));
  }

  return (
    <div className="space-y-6">
      <EditorGroup title="Assistant behavior" description="These rules are included in prompt assembly and public fallback behavior.">
        <TextArea label="Tone" value={draft.persona.ai.tone} onChange={(value) => updateAi({ tone: value })} />
        <TextArea label="Answering style" value={draft.persona.ai.style} rows={4} onChange={(value) => updateAi({ style: value })} />
        <TextArea label="Uncertainty policy" value={draft.persona.ai.uncertaintyPolicy} rows={4} onChange={(value) => updateAi({ uncertaintyPolicy: value })} />
        <ListField label="Allowed behavior" value={draft.persona.ai.allowedBehavior} onChange={(items) => updateAi({ allowedBehavior: items })} />
        <ListField label="Forbidden behavior" value={draft.persona.ai.forbiddenBehavior} onChange={(items) => updateAi({ forbiddenBehavior: items })} />
        <ListField label="Routing guidance" value={draft.persona.ai.routingGuidance} onChange={(items) => updateAi({ routingGuidance: items })} />
        <ListField label="Suggested questions" value={draft.suggestedQuestions} onChange={(items) => updateDraft((current) => ({ ...current, suggestedQuestions: items }))} />
      </EditorGroup>

      <EditorGroup
        title="FAQ seed content"
        description="FAQ entries improve retrieval for common questions."
        action={<AddButton label="Add FAQ" onClick={() => addFaq(updateDraft)} />}
      >
        <RepeatableEmptyState show={draft.persona.faq.length === 0} label="No FAQ entries configured." />
        {draft.persona.faq.map((faq, index) => (
          <EditableBlock
            key={`${faq.question}-${index}`}
            title={faq.question || "Untitled FAQ"}
            meta={faq.category}
            onMoveUp={() => moveFaq(updateDraft, index, -1)}
            onMoveDown={() => moveFaq(updateDraft, index, 1)}
            onRemove={() => removeFaq(updateDraft, index)}
            disableUp={index === 0}
            disableDown={index === draft.persona.faq.length - 1}
          >
            <Select label="Category" value={faq.category} options={faqCategories} onChange={(value) => updateFaq(updateDraft, index, { category: value as FaqItem["category"] })} />
            <TextArea label="Question" value={faq.question} onChange={(value) => updateFaq(updateDraft, index, { question: value })} />
            <TextArea label="Answer" value={faq.answer} rows={4} onChange={(value) => updateFaq(updateDraft, index, { answer: value })} />
          </EditableBlock>
        ))}
      </EditorGroup>
    </div>
  );
}

type EditorPanelProps = {
  draft: PersonaContent;
  updatePersona: (updater: (persona: PersonaContent) => PersonaContent) => void;
};

function EditorGroup({ title, description, action, children }: { title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-ink-200 p-4 dark:border-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink-950 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-ink-600 dark:text-ink-300">{description}</p>
        </div>
        {action}
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function EditableBlock({
  title,
  meta,
  onMoveUp,
  onMoveDown,
  onRemove,
  disableUp,
  disableDown,
  children
}: {
  title: string;
  meta?: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  disableUp: boolean;
  disableDown: boolean;
  children: ReactNode;
}) {
  return (
    <details className="rounded-lg border border-ink-200 bg-white/65 p-4 open:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:open:bg-white/[0.05]">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-950 dark:text-white">{title}</p>
            {meta ? <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{meta}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="button-secondary px-3 py-1.5" disabled={disableUp} onClick={(event) => handleSummaryButton(event, onMoveUp)}>
              Up
            </button>
            <button type="button" className="button-secondary px-3 py-1.5" disabled={disableDown} onClick={(event) => handleSummaryButton(event, onMoveDown)}>
              Down
            </button>
            <button type="button" className="button-secondary px-3 py-1.5" onClick={(event) => handleSummaryButton(event, onRemove)}>
              Remove
            </button>
          </div>
        </div>
      </summary>
      <div className="mt-5 space-y-4 border-t border-ink-200 pt-4 dark:border-white/10">{children}</div>
    </details>
  );
}

function handleSummaryButton(event: MouseEvent<HTMLButtonElement>, action: () => void) {
  event.preventDefault();
  event.stopPropagation();
  action();
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="button-primary shrink-0 px-4 py-2" onClick={onClick}>
      {label}
    </button>
  );
}

function RepeatableEmptyState({ show, label }: { show: boolean; label: string }) {
  if (!show) return null;
  return <p className="rounded-lg border border-dashed border-ink-300 p-4 text-sm text-ink-600 dark:border-white/15 dark:text-ink-300">{label}</p>;
}

function ListPreview({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-ink-200 p-4 dark:border-white/10">
      <p className="form-label">{title}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-700 dark:text-ink-200">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function LinksEditor({ links, onChange }: { links: ContentLink[]; onChange: (links: ContentLink[]) => void }) {
  return (
    <div className="rounded-lg border border-ink-200 p-4 dark:border-white/10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="form-label">Links</p>
          <p className="form-help">Optional source, project, publication, or download links.</p>
        </div>
        <AddButton label="Add link" onClick={() => onChange([...links, createLink()])} />
      </div>
      <div className="mt-4 space-y-3">
        <RepeatableEmptyState show={links.length === 0} label="No links configured." />
        {links.map((link, index) => (
          <div key={`${link.href}-${index}`} className="rounded-lg border border-ink-200 p-3 dark:border-white/10">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Label" value={link.label} onChange={(value) => onChange(replaceAt(links, index, { ...link, label: value }))} />
              <Field label="Href" value={link.href} onChange={(value) => onChange(replaceAt(links, index, { ...link, href: value }))} />
              <Select label="Kind" value={link.kind ?? "website"} options={linkKinds} onChange={(value) => onChange(replaceAt(links, index, { ...link, kind: value as ContentLink["kind"] }))} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="button-secondary px-3 py-1.5" onClick={() => onChange(moveItem(links, index, -1))} disabled={index === 0}>
                Up
              </button>
              <button type="button" className="button-secondary px-3 py-1.5" onClick={() => onChange(moveItem(links, index, 1))} disabled={index === links.length - 1}>
                Down
              </button>
              <button type="button" className="button-secondary px-3 py-1.5" onClick={() => onChange(removeAt(links, index))}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, type = "text", onChange }: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      <input className="form-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, rows = 3, onChange }: { label: string; value: string; rows?: number; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      <textarea className="form-input resize-y" value={value} rows={rows} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      <select className="form-input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      <textarea
        className="form-input resize-y"
        value={value.join("\n")}
        rows={Math.max(3, Math.min(value.length + 1, 8))}
        onChange={(event) => onChange(toList(event.target.value))}
      />
      <span className="form-help">One item per line.</span>
    </label>
  );
}

function createDraft(persona: PersonaContent, suggestedQuestions: string[]): EditorDraft {
  return {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    persona,
    suggestedQuestions
  };
}

function markUpdated(draft: EditorDraft): EditorDraft {
  return { ...draft, schemaVersion: 1, updatedAt: new Date().toISOString() };
}

function parseImportedDraft(value: unknown, fallback: EditorDraft): { draft: EditorDraft } {
  if (!isRecord(value)) throw new Error("Imported JSON must be an object.");
  const envelope = value as ImportEnvelope;
  const persona = isRecord(envelope.persona) ? envelope.persona : value;
  assertPersonaContent(persona);

  return {
    draft: {
      schemaVersion: 1,
      updatedAt: typeof envelope.updatedAt === "string" ? envelope.updatedAt : new Date().toISOString(),
      persona: persona as PersonaContent,
      suggestedQuestions: Array.isArray(envelope.suggestedQuestions) ? envelope.suggestedQuestions.filter(isString) : fallback.suggestedQuestions
    }
  };
}

function assertPersonaContent(value: unknown): asserts value is PersonaContent {
  if (!isRecord(value)) throw new Error("Imported JSON does not contain a persona object.");
  if (!isString(value.id) || !isString(value.label)) throw new Error("Persona must include id and label.");
  if (!isRecord(value.profile) || !isString(value.profile.name) || !isString(value.profile.title) || !isString(value.profile.tagline)) {
    throw new Error("Persona profile is missing required name, title, or tagline fields.");
  }
  if (!isRecord(value.homepage) || !Array.isArray(value.homepage.sections) || !Array.isArray(value.homepage.stats) || !Array.isArray(value.homepage.timeline)) {
    throw new Error("Homepage must include sections, stats, and timeline arrays.");
  }
  if (!Array.isArray(value.projects) || !Array.isArray(value.publications) || !Array.isArray(value.notes) || !Array.isArray(value.faq)) {
    throw new Error("Persona must include projects, publications, notes, and faq arrays.");
  }
  if (!isRecord(value.ai) || !isString(value.ai.tone) || !isString(value.ai.style) || !isString(value.ai.uncertaintyPolicy)) {
    throw new Error("Assistant configuration is missing required tone, style, or uncertainty policy fields.");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function mergePersonaPatch(current: PersonaContent, patch: Partial<PersonaContent>): PersonaContent {
  return {
    ...current,
    ...patch,
    profile: patch.profile
      ? {
          ...current.profile,
          ...patch.profile,
          portrait: patch.profile.portrait ? { ...current.profile.portrait, ...patch.profile.portrait } : current.profile.portrait,
          personalNote: patch.profile.personalNote ? { ...current.profile.personalNote, ...patch.profile.personalNote } : current.profile.personalNote
        }
      : current.profile,
    homepage: patch.homepage
      ? {
          ...current.homepage,
          ...patch.homepage,
          sections: Array.isArray(patch.homepage.sections) ? patch.homepage.sections : current.homepage.sections,
          stats: Array.isArray(patch.homepage.stats) ? patch.homepage.stats : current.homepage.stats,
          timeline: Array.isArray(patch.homepage.timeline) ? patch.homepage.timeline : current.homepage.timeline
        }
      : current.homepage,
    projects: Array.isArray(patch.projects) ? patch.projects : current.projects,
    publications: Array.isArray(patch.publications) ? patch.publications : current.publications,
    notes: Array.isArray(patch.notes) ? patch.notes : current.notes,
    gallery: Array.isArray(patch.gallery) ? patch.gallery : current.gallery,
    people: Array.isArray(patch.people) ? patch.people : current.people,
    faq: Array.isArray(patch.faq) ? patch.faq : current.faq,
    ai: patch.ai ? { ...current.ai, ...patch.ai } : current.ai
  };
}

function toList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "untitled";
}

function formatDateTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function createLink(): ContentLink {
  return { label: "New link", href: "#", kind: "website" };
}

function createContact(): ContactChannel {
  return { label: "Email", value: "name@example.com", href: "mailto:name@example.com" };
}

function createGalleryItem(existing: GalleryItem[]): GalleryItem {
  const id = uniqueSlug("new-gallery-item", existing.map((item) => item.id));
  return {
    id,
    title: "New gallery item",
    description: "Describe the image and why it belongs on the public site.",
    alt: "Describe the image for screen readers.",
    category: "academic",
    tags: [],
    featured: false,
    visibility: "public",
    placeholder: true
  };
}

function createPerson(existing: PersonConnection[]): PersonConnection {
  const id = uniqueSlug("new-person", existing.map((person) => person.id));
  return {
    id,
    name: "New person",
    role: "Public role or title",
    relationship: "Verified public relationship",
    description: "Conservative public description grounded in verified information.",
    tags: [],
    category: "other",
    visibility: "public"
  };
}

function createProject(existing: Project[]): Project {
  const slug = uniqueSlug("new-project", existing.map((item) => item.slug));
  return {
    slug,
    title: "New project",
    summary: "Short summary for this project.",
    description: "Longer project description.",
    tags: [],
    links: [],
    featured: false,
    date: new Date().toISOString().slice(0, 10),
    status: "active"
  };
}

function createNote(existing: Note[]): Note {
  const slug = uniqueSlug("new-note", existing.map((item) => item.slug));
  return {
    slug,
    title: "New note",
    date: new Date().toISOString().slice(0, 10),
    summary: "Short summary for this note.",
    body: "Draft note body.",
    tags: [],
    readingLevel: "introductory"
  };
}

function createPublication(): Publication {
  return {
    title: "New publication",
    authors: [],
    venue: "Venue",
    year: new Date().getFullYear(),
    abstract: "Short abstract or description.",
    links: [],
    tags: []
  };
}

function createFaq(): FaqItem {
  return { question: "New question?", answer: "Draft answer grounded in public content.", category: "other" };
}

function uniqueSlug(base: string, existing: string[]) {
  let candidate = base;
  let count = 2;
  while (existing.includes(candidate)) {
    candidate = `${base}-${count}`;
    count += 1;
  }
  return candidate;
}

function replaceAt<T>(items: T[], index: number, item: T) {
  return items.map((current, currentIndex) => (currentIndex === index ? item : current));
}

function removeAt<T>(items: T[], index: number) {
  return items.filter((_, currentIndex) => currentIndex !== index);
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const copy = [...items];
  const [item] = copy.splice(index, 1);
  copy.splice(nextIndex, 0, item);
  return copy;
}

function updateProfile(updatePersona: EditorPanelProps["updatePersona"], patch: Partial<PersonaContent["profile"]>) {
  updatePersona((persona) => ({ ...persona, profile: { ...persona.profile, ...patch } }));
}

function addProfileLink(updatePersona: EditorPanelProps["updatePersona"]) {
  updatePersona((persona) => ({ ...persona, profile: { ...persona.profile, links: [...persona.profile.links, createLink()] } }));
}

function updateProfileLink(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<ContentLink>) {
  updatePersona((persona) => ({
    ...persona,
    profile: { ...persona.profile, links: replaceAt(persona.profile.links, index, { ...persona.profile.links[index], ...patch }) }
  }));
}

function moveProfileLink(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, profile: { ...persona.profile, links: moveItem(persona.profile.links, index, direction) } }));
}

function removeProfileLink(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, profile: { ...persona.profile, links: removeAt(persona.profile.links, index) } }));
}

function addContact(updatePersona: EditorPanelProps["updatePersona"]) {
  updatePersona((persona) => ({ ...persona, profile: { ...persona.profile, contact: [...persona.profile.contact, createContact()] } }));
}

function updateContact(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<ContactChannel>) {
  updatePersona((persona) => ({
    ...persona,
    profile: { ...persona.profile, contact: replaceAt(persona.profile.contact, index, { ...persona.profile.contact[index], ...patch }) }
  }));
}

function moveContact(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, profile: { ...persona.profile, contact: moveItem(persona.profile.contact, index, direction) } }));
}

function removeContact(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, profile: { ...persona.profile, contact: removeAt(persona.profile.contact, index) } }));
}

function setPreferredContact(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({
    ...persona,
    profile: {
      ...persona.profile,
      contact: persona.profile.contact.map((contact, currentIndex) => ({ ...contact, preferred: currentIndex === index }))
    }
  }));
}

function updatePortrait(updatePersona: EditorPanelProps["updatePersona"], patch: Partial<NonNullable<PersonaContent["profile"]["portrait"]>>) {
  updatePersona((persona) => ({
    ...persona,
    profile: {
      ...persona.profile,
      portrait: {
        src: persona.profile.portrait?.src ?? "",
        alt: persona.profile.portrait?.alt ?? "",
        ...persona.profile.portrait,
        ...patch
      }
    }
  }));
}

function updatePersonalNote(updatePersona: EditorPanelProps["updatePersona"], patch: Partial<NonNullable<PersonaContent["profile"]["personalNote"]>>) {
  updatePersona((persona) => ({
    ...persona,
    profile: {
      ...persona.profile,
      personalNote: {
        enabled: persona.profile.personalNote?.enabled ?? false,
        title: persona.profile.personalNote?.title ?? "A more personal note",
        body: persona.profile.personalNote?.body ?? "",
        ...patch
      }
    }
  }));
}

function addSection(updatePersona: EditorPanelProps["updatePersona"], type: SectionType) {
  updatePersona((persona) => ({
    ...persona,
    homepage: {
      ...persona.homepage,
      sections: [...persona.homepage.sections, { id: uniqueSlug(type, persona.homepage.sections.map((section) => section.id)), type, enabled: true }]
    }
  }));
}

function updateSection(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<HomeSection>) {
  updatePersona((persona) => ({
    ...persona,
    homepage: { ...persona.homepage, sections: replaceAt(persona.homepage.sections, index, { ...persona.homepage.sections[index], ...patch }) }
  }));
}

function moveSection(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, homepage: { ...persona.homepage, sections: moveItem(persona.homepage.sections, index, direction) } }));
}

function removeSection(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, homepage: { ...persona.homepage, sections: removeAt(persona.homepage.sections, index) } }));
}

function addStat(updatePersona: EditorPanelProps["updatePersona"]) {
  updatePersona((persona) => ({ ...persona, homepage: { ...persona.homepage, stats: [...persona.homepage.stats, { value: "1", label: "New stat" }] } }));
}

function updateStat(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<Stat>) {
  updatePersona((persona) => ({ ...persona, homepage: { ...persona.homepage, stats: replaceAt(persona.homepage.stats, index, { ...persona.homepage.stats[index], ...patch }) } }));
}

function moveStat(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, homepage: { ...persona.homepage, stats: moveItem(persona.homepage.stats, index, direction) } }));
}

function removeStat(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, homepage: { ...persona.homepage, stats: removeAt(persona.homepage.stats, index) } }));
}

function addTimelineItem(updatePersona: EditorPanelProps["updatePersona"]) {
  updatePersona((persona) => ({
    ...persona,
    homepage: {
      ...persona.homepage,
      timeline: [...persona.homepage.timeline, { title: "New role", organization: "Organization", period: "Year", summary: "Short summary." }]
    }
  }));
}

function updateTimelineItem(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<TimelineItem>) {
  updatePersona((persona) => ({
    ...persona,
    homepage: { ...persona.homepage, timeline: replaceAt(persona.homepage.timeline, index, { ...persona.homepage.timeline[index], ...patch }) }
  }));
}

function moveTimelineItem(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, homepage: { ...persona.homepage, timeline: moveItem(persona.homepage.timeline, index, direction) } }));
}

function removeTimelineItem(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, homepage: { ...persona.homepage, timeline: removeAt(persona.homepage.timeline, index) } }));
}

function addGalleryItem(updatePersona: EditorPanelProps["updatePersona"]) {
  updatePersona((persona) => ({ ...persona, gallery: [...(persona.gallery ?? []), createGalleryItem(persona.gallery ?? [])] }));
}

function updateGalleryItem(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<GalleryItem>) {
  updatePersona((persona) => {
    const items = persona.gallery ?? [];
    return { ...persona, gallery: replaceAt(items, index, { ...items[index], ...patch }) };
  });
}

function moveGalleryItem(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, gallery: moveItem(persona.gallery ?? [], index, direction) }));
}

function removeGalleryItem(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, gallery: removeAt(persona.gallery ?? [], index) }));
}

function addPerson(updatePersona: EditorPanelProps["updatePersona"]) {
  updatePersona((persona) => ({ ...persona, people: [...(persona.people ?? []), createPerson(persona.people ?? [])] }));
}

function updatePerson(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<PersonConnection>) {
  updatePersona((persona) => {
    const people = persona.people ?? [];
    return { ...persona, people: replaceAt(people, index, { ...people[index], ...patch }) };
  });
}

function movePerson(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, people: moveItem(persona.people ?? [], index, direction) }));
}

function removePerson(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, people: removeAt(persona.people ?? [], index) }));
}

function addProject(updatePersona: EditorPanelProps["updatePersona"]) {
  updatePersona((persona) => ({ ...persona, projects: [...persona.projects, createProject(persona.projects)] }));
}

function updateProject(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<Project>) {
  updatePersona((persona) => ({ ...persona, projects: replaceAt(persona.projects, index, { ...persona.projects[index], ...patch }) }));
}

function moveProject(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, projects: moveItem(persona.projects, index, direction) }));
}

function removeProject(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, projects: removeAt(persona.projects, index) }));
}

function addNote(updatePersona: EditorPanelProps["updatePersona"]) {
  updatePersona((persona) => ({ ...persona, notes: [...persona.notes, createNote(persona.notes)] }));
}

function updateNote(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<Note>) {
  updatePersona((persona) => ({ ...persona, notes: replaceAt(persona.notes, index, { ...persona.notes[index], ...patch }) }));
}

function moveNote(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, notes: moveItem(persona.notes, index, direction) }));
}

function removeNote(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, notes: removeAt(persona.notes, index) }));
}

function addPublication(updatePersona: EditorPanelProps["updatePersona"]) {
  updatePersona((persona) => ({ ...persona, publications: [...persona.publications, createPublication()] }));
}

function updatePublication(updatePersona: EditorPanelProps["updatePersona"], index: number, patch: Partial<Publication>) {
  updatePersona((persona) => ({ ...persona, publications: replaceAt(persona.publications, index, { ...persona.publications[index], ...patch }) }));
}

function movePublication(updatePersona: EditorPanelProps["updatePersona"], index: number, direction: -1 | 1) {
  updatePersona((persona) => ({ ...persona, publications: moveItem(persona.publications, index, direction) }));
}

function removePublication(updatePersona: EditorPanelProps["updatePersona"], index: number) {
  updatePersona((persona) => ({ ...persona, publications: removeAt(persona.publications, index) }));
}

function addFaq(updateDraft: (updater: (current: EditorDraft) => EditorDraft) => void) {
  updateDraft((current) => ({ ...current, persona: { ...current.persona, faq: [...current.persona.faq, createFaq()] } }));
}

function updateFaq(updateDraft: (updater: (current: EditorDraft) => EditorDraft) => void, index: number, patch: Partial<FaqItem>) {
  updateDraft((current) => ({ ...current, persona: { ...current.persona, faq: replaceAt(current.persona.faq, index, { ...current.persona.faq[index], ...patch }) } }));
}

function moveFaq(updateDraft: (updater: (current: EditorDraft) => EditorDraft) => void, index: number, direction: -1 | 1) {
  updateDraft((current) => ({ ...current, persona: { ...current.persona, faq: moveItem(current.persona.faq, index, direction) } }));
}

function removeFaq(updateDraft: (updater: (current: EditorDraft) => EditorDraft) => void, index: number) {
  updateDraft((current) => ({ ...current, persona: { ...current.persona, faq: removeAt(current.persona.faq, index) } }));
}
