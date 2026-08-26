import type { Metadata, ParsedPage } from "../metadata/parser";
import path from "node:path";

import {
  layoutsPath,
  libPath,
  schemaFunction,
  layoutComponent,
  hasBreadcrumbs,
  schemaCall,
  ogType,
  sourceLoads,
  sourceProps,
  sourceAdapters,
  contentImports,
  sectionComponentImport,
} from "./imports";
import { renderSections } from "../layouts/layouts";

export function buildSingleton(page: ParsedPage, metadata: Metadata) {
  const layouts = layoutsPath(page);
  const lib = libPath(page);
  const id = path.basename(page.path!, ".md");

  const sources = sourceLoads(page);
  const props = sourceProps(page);

  const adapters = sourceAdapters(page, metadata.typeMap, metadata.seo.fields);

  return `---
import Layout from "${layouts}/Layout.astro";
import ${layoutComponent(page)} from "${layouts}/${layoutComponent(page)}.astro";
${contentImports(page, ["getEntry"])}
import { ${schemaFunction(page)} } from "${lib}/schema";

const entry = await getEntry("${page.key}", "${id}");

if (!entry) {
  throw new Error("${page.label} content not found.");
}

${sources}

${adapters}

const schema = [
  ${schemaCall(page, "entry.data")},
];
---

<Layout title={entry.data.seo.title} description={entry.data.seo.description} image={entry.data.seo.image} schema={schema} ${ogType(page)}>
  <${layoutComponent(page)}
    data={entry.data}
    ${props}
  />
</Layout>
`;
}

export function buildCollection(page: ParsedPage, metadata: Metadata) {
  const layouts = layoutsPath(page);
  const lib = libPath(page);

  const breadcrumbImport = hasBreadcrumbs(page)
    ? `import { breadcrumbSchema } from "${lib}/breadcrumbs";`
    : "";

  const breadcrumbSchema = hasBreadcrumbs(page)
    ? `, await breadcrumbSchema(Astro.url.pathname, entry.data.seo.title)`
    : "";

  const sources = sourceLoads(page);
  const props = sourceProps(page);

  const adapters = sourceAdapters(page, metadata.typeMap, metadata.seo.fields);

  return `---
import Layout from "${layouts}/Layout.astro";
import ${layoutComponent(page)} from "${layouts}/${layoutComponent(page)}.astro";
${contentImports(page, ["getCollection"])}
import { ${schemaFunction(page)} } from "${lib}/schema";
${breadcrumbImport}

export async function getStaticPaths() {
  const entries = await getCollection("${page.key}");

  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;

${sources}

${adapters}

const schema = [
  ${schemaCall(page, "entry.data")}
  ${breadcrumbSchema},
];
---

<Layout title={entry.data.seo.title} description={entry.data.seo.description} image={entry.data.seo.image} schema={schema} ${ogType(page)}>
  <${layoutComponent(page)}
    data={entry.data}
    ${props}
  />
</Layout>
`;
}

export function buildOutput(page: ParsedPage, metadata: Metadata) {
  const layouts = layoutsPath(page);
  const lib = libPath(page);
  const sources = sourceLoads(page);
  const adapters = sourceAdapters(page, metadata.typeMap, metadata.seo.fields);

  const sectionImports = [
    ...new Set(
      page.sections.map((section) =>
        sectionComponentImport(page, section.section.key),
      ),
    ),
  ].join("\n");

  return `---
import Layout from "${layouts}/Layout.astro";
${sectionImports}
${contentImports(page)}
import { ${schemaFunction(page)} } from "${lib}/schema";

${sources}

${adapters}

const pageData = {
  eyebrow: "Overview",
  title: "${page.label}",
  description: "Browse our ${page.label.toLowerCase()}.",
};

const schema = [
  ${schemaFunction(page)}({
    name: pageData.title,
    description: pageData.description,
    url: Astro.url.pathname,
  }),
];
---

<Layout
  title={pageData.title}
  description={pageData.description}
  schema={schema}
>
${renderSections(page.sections, "pageData")}
</Layout>
`;
}
