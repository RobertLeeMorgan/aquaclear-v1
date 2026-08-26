import { getNavigationLookup } from "../lib/navigation";
import { site } from "../config/site";

export async function breadcrumbSchema(
  pathname: string,
  pageTitle?: string,
) {
  const lookup = await getNavigationLookup();

  const items = [
    {
      name: "Home",
      url: "/",
    },
  ];

  const trail: typeof lookup = [];

  let current = lookup.find((item) => item.href === pathname);

  while (current) {
    trail.unshift(current);

    current = current.parent
      ? lookup.find((item) => item.href === current!.parent)
      : undefined;
  }

  items.push(
    ...trail.map((item) => ({
      name: item.label,
      url: item.href,
    })),
  );

  if (
    pageTitle &&
    items.at(-1)?.url !== pathname
  ) {
    items.push({
      name: pageTitle,
      url: pathname,
    });
  }

  return createBreadcrumbSchema(items);
}

function createBreadcrumbSchema(
  items: {
    name: string;
    url: string;
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.url, site.url).toString(),
    })),
  };
}