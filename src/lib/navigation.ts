import { getCollection } from "astro:content";

import { pages } from "../generate/metadata/pages";
import { navigation } from "../config/navigation";

export type NavLink = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  dropdown?: NavLink[];
};

export type NavigationLookupItem = {
  label: string;
  href: string;
  parent?: string;
};

function href(key: keyof typeof pages) {
  const page = pages[key];

  if ("output" in page) {
    const route = page.output
      .replace(/^src\/pages\//, "")
      .replace(/\/index\.astro$/, "")
      .replace(/\.astro$/, "");

    return route ? `/${route}` : "/";
  }

  if (page.type === "collection") {
    return `/${page.folder.replace("src/content/", "")}`;
  }

  const route = page.path
    .replace(/^src\/content\//, "")
    .replace(/index\.md$/, "")
    .replace(/\.md$/, "");

  return route.startsWith("pages/")
    ? `/${route.replace(/^pages\//, "")}`
    : `/${route}`;
}

async function buildNavigation() {
  const nav: NavItem[] = [];
  const lookup: NavigationLookupItem[] = [];

  for (const item of navigation) {
    if (typeof item === "string") {
      const page = pages[item];

      const navItem = {
        label: page.label,
        href: href(item),
      };

      nav.push(navItem);
      lookup.push(navItem);

      continue;
    }

    if (item.children === "collection") {
      const page = pages[item.page];

      if (page.type !== "collection") {
        throw new Error(`Navigation page "${item.page}" is not a collection.`);
      }

      const collectionHref = href(item.page);

      const entries = await getCollection(item.page as any);

      const dropdown = entries.map((entry: any) => ({
        label: entry.data.seo.title,
        href: `${collectionHref}/${entry.id}`,
      }));

      nav.push({
        label: page.label,
        href: collectionHref,
        dropdown,
      });

      lookup.push({
        label: page.label,
        href: collectionHref,
      });

      lookup.push(
        ...dropdown.map((entry) => ({
          ...entry,
          parent: collectionHref,
        })),
      );

      continue;
    }

    const dropdown = item.children.map((key) => ({
      label: pages[key].label,
      href: href(key),
    }));

    nav.push({
      label: item.label,
      href: item.href,
      dropdown,
    });

    lookup.push({
      label: item.label,
      href: item.href,
    });

    lookup.push(
      ...dropdown.map((entry) => ({
        ...entry,
        parent: item.href,
      })),
    );
  }

  return {
    nav,
    lookup,
  };
}

export async function getNavItems() {
  return (await buildNavigation()).nav;
}

export async function getNavigationLookup() {
  return (await buildNavigation()).lookup;
}
