import { getCollection } from "astro:content";
import { navigation } from "../config/navigation";

export type NavLink = { label: string; href: string };
export type NavItem = { label: string; href: string; dropdown?: NavLink[] };
export type NavigationLookupItem = {
  label: string;
  href: string;
  parent?: string;
};

async function buildNavigation() {
  const nav: NavItem[] = [];
  const lookup: NavigationLookupItem[] = [];

  for (const item of navigation as any) {
    if (item.children === "collection") {
      const entries = await getCollection(item.page);

      const dropdown = entries.map((entry: any) => ({
        label: entry.data.seo.title,
        href: `${item.href}/${entry.id}`,
      }));

      nav.push({ label: item.label, href: item.href, dropdown });

      lookup.push({ label: item.label, href: item.href });
      lookup.push(
        ...dropdown.map((entry) => ({ ...entry, parent: item.href })),
      );

      continue;
    }

    const navItem = { label: item.label, href: item.href };

    nav.push(navItem);
    lookup.push(navItem);
  }
  return { nav, lookup };
}

export async function getNavItems() {
  return (await buildNavigation()).nav;
}

export async function getNavigationLookup() {
  return (await buildNavigation()).lookup;
}
