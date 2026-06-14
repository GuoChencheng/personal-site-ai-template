import Image from "next/image";
import type { GalleryItem } from "@/lib/content/schema";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function GalleryCard({ item, dictionary, priority = false }: { item: GalleryItem; dictionary: Dictionary; priority?: boolean }) {
  const dateLabel = item.year ?? item.date;

  return (
    <article className="section-card group overflow-hidden p-0 transition hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f3efe9] dark:bg-ink-900">
        {item.image ? (
          <Image src={item.image} alt={item.alt} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 28rem, (min-width: 640px) 50vw, 100vw" priority={priority} />
        ) : (
          <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.8),transparent_28%),linear-gradient(135deg,#ece5da,#d7e3df_52%,#d8dbe9)] p-5 dark:bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(135deg,#111827,#1f2937_52%,#273549)]">
            <div className="h-16 w-16 rounded-full border border-white/70 bg-white/40 backdrop-blur dark:border-white/15 dark:bg-white/10" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-600 dark:text-ink-300">{dictionary.pages.gallery.placeholder}</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-ink-800 dark:text-ink-100">{item.alt}</p>
            </div>
          </div>
        )}
        {item.placeholder ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-800 backdrop-blur dark:border-white/15 dark:bg-ink-950/65 dark:text-white">
            {dictionary.pages.gallery.placeholder}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <div className="meta-row">
          <span>{dictionary.labels.galleryCategory[item.category]}</span>
          {dateLabel ? <span>{dateLabel}</span> : null}
          {item.location ? <span>{item.location}</span> : null}
        </div>
        <h2 className="mt-3 text-lg font-semibold text-ink-950 dark:text-white">{item.title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{item.description}</p>
        {item.caption ? <p className="mt-4 border-l-2 border-accent-500/70 pl-3 text-sm leading-6 text-ink-600 dark:text-ink-300">{item.caption}</p> : null}
        {item.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-ink-100 px-2.5 py-1 text-xs text-ink-600 dark:bg-white/10 dark:text-ink-200">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
