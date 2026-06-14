export const navItems = [
  { key: "about", href: "/about" },
  { key: "gallery", href: "/gallery" },
  { key: "people", href: "/people" },
  { key: "projects", href: "/projects" },
  { key: "publications", href: "/publications" },
  { key: "notes", href: "/notes" },
  { key: "cv", href: "/cv" },
  { key: "contact", href: "/contact" }
] as const;

export type NavKey = (typeof navItems)[number]["key"];

export function getNavLabel(labels: Record<NavKey, string>, key: NavKey) {
  return labels[key];
}
