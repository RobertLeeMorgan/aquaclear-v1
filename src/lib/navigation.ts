import { getCollection } from "astro:content";
import { navigation } from "../config/navigation";
import { sortServices } from "./services";

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
    if (item.filters) {
      const dropdown = item.filters.map((filter: any) => ({
        label: filter.label,
        href: `${item.href}?filter=${filter.filter}`,
      }));

      nav.push({ label: item.label, href: item.href, dropdown });

      lookup.push({ label: item.label, href: item.href });
      lookup.push(
        ...dropdown.map((entry: any) => ({
          ...entry,
          parent: item.href,
        })),
      );

      continue;
    }

    if (item.children === "collection") {
      let entries = await getCollection(item.page);

      if (item.page === "services") {
        entries = sortServices(entries);
      }

      const dropdown = entries.map((entry: any) => ({
        label: entry.data.seo.title,
        href: `${item.href}/${entry.id}`,
      }));

      nav.push({ label: item.label, href: item.href, dropdown });

      lookup.push({ label: item.label, href: item.href });
      lookup.push(
        ...dropdown.map((entry: any) => ({
          ...entry,
          parent: item.href,
        })),
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
