import Link from "next/link";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="rounded-lg border border-dashed border-ink-300 bg-white/55 p-6 text-sm dark:border-white/15 dark:bg-white/5">
      <h2 className="font-semibold text-ink-950 dark:text-white">{title}</h2>
      <p className="mt-2 leading-6 text-ink-600 dark:text-ink-300">{description}</p>
      {action ? (
        <Link href={action.href} className="mt-4 inline-flex text-sm font-medium text-accent-600 hover:text-accent-500">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
