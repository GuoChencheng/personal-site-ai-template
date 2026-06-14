export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent-600">{eyebrow}</p> : null}
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-ink-600 dark:text-ink-300">{description}</p> : null}
    </div>
  );
}
