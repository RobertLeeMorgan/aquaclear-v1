import type {
  ParsedPage,
  ParsedField,
  ParsedSectionSource,
  ParsedType,
} from "../metadata/parser";
import { camelCase } from "../../utils/slugify";
import path from "node:path";

function outputDirectory(page: ParsedPage) {
  if (page.type === "collection") {
    return path.dirname(collectionOutputPath(page));
  }

  return path.dirname(pageOutputPath(page));
}

export function relative(page: ParsedPage, target: string) {
  const dir = outputDirectory(page);

  const depth =
    dir
      .replace(/^src\/pages/, "")
      .split("/")
      .filter(Boolean).length + 1;

  return `${"../".repeat(depth)}${target}`;
}

export function layoutsPath(page: ParsedPage) {
  return relative(page, "layouts");
}

export function libPath(page: ParsedPage) {
  return relative(page, "lib");
}

export function pageOutputPath(page: ParsedPage) {
  if (page.output) {
    return page.output;
  }

  const relative = page
    .path!.replace(/^src\/content\//, "")
    .replace(/\.md$/, ".astro");

  if (relative.startsWith("pages/")) {
    return `src/${relative}`;
  }

  return `src/pages/${relative}`;
}

export function collectionOutputPath(page: ParsedPage) {
  return `${page.folder!.replace("src/content", "src/pages")}/[slug].astro`;
}

export function schemaFunction(page: ParsedPage) {
  return `${page.schema}Schema`;
}

export function hasBreadcrumbs(page: ParsedPage) {
  return page.type === "collection";
}

export function layoutComponent(page: ParsedPage) {
  return page.layout;
}

export function schemaCall(page: ParsedPage, source: string) {
  switch (page.schema) {
    case "faq": {
      const accordion = page.sections.find(
        (section) => section.section.key === "accordion",
      );

      if (!accordion) {
        throw new Error(
          `${page.key} requires an accordion section for FAQ schema`,
        );
      }

      return `${schemaFunction(page)}(${source}.${accordion.name}.groups.flatMap(group => group.items))`;
    }

    case "localBusiness":
      return `${schemaFunction(page)}()`;

    default:
      return `${schemaFunction(page)}({
        name: ${source}.seo.title,
        description: ${source}.seo.description,
        image: ${source}.seo.image?.src,
        url: Astro.url.pathname,
      })`;
  }
}

export function ogType(page: ParsedPage) {
  return page.schema === "article" ? 'ogType="article"' : "";
}

/* -------------------------------------------------------------------------- */
/* Sources                                                                    */
/* -------------------------------------------------------------------------- */

export function sectionSources(page: ParsedPage) {
  return page.sections.flatMap((section) => section.sources ?? []);
}

export function uniqueSources(page: ParsedPage) {
  const sources = sectionSources(page);

  return sources.filter(
    (source, index, all) =>
      all.findIndex(
        (candidate) =>
          candidate.collection === source.collection &&
          candidate.entry === source.entry &&
          candidate.section === source.section,
      ) === index,
  );
}

export function sourceVariable(source: ParsedSectionSource) {
  if (source.collection) {
    return camelCase(source.collection);
  }

  if (source.entry) {
    const { id } = parseEntrySource(source.entry);
    return `${camelCase(id)}Entry`;
  }

  throw new Error("Section source must specify collection or entry");
}

function parseEntrySource(source: string) {
  const separator = source.indexOf(".");

  if (separator === -1) {
    throw new Error(
      `Invalid entry source "${source}". Expected "collection.entry".`,
    );
  }

  return {
    collection: source.slice(0, separator),
    id: source.slice(separator + 1),
  };
}

function getTypeFields(
  typeName: string,
  typeMap: Map<string, ParsedType>,
): ParsedField[] {
  const type = typeMap.get(typeName);

  if (!type || type.kind !== "object" || !type.fields) {
    throw new Error(`Unknown object type "${typeName}"`);
  }

  return type.fields;
}

function isArrayType(field: ParsedField) {
  return field.array;
}

function isObjectType(field: ParsedField) {
  return field.array && field.type.kind === "object";
}

function compatibleTypes(source: ParsedField, target: ParsedField) {
  return source.type.name === target.type.name;
}

function findMatchingField(
  target: ParsedField,
  sourceFields: ParsedField[],
): ParsedField | undefined {
  const exact = sourceFields.find(
    (field) => field.name === target.name && compatibleTypes(field, target),
  );

  if (exact) {
    return exact;
  }

  const aliases: Record<string, string[]> = {
    description: ["content"],
    content: ["description"],
    title: ["heading"],
    heading: ["title"],
  };

  const candidates = aliases[target.name] ?? [];

  return sourceFields.find(
    (field) =>
      candidates.includes(field.name) && compatibleTypes(field, target),
  );
}

function sourceExpression(source: ParsedSectionSource) {
  const variable = sourceVariable(source);

  if (!source.section) {
    if (source.collection) {
      const href = sourceHref(source);

      return `${variable}.map((entry) => ({
        ...entry.data.seo,
        href: \`${href}/\${entry.id}\`,
      }))`;
    }

    const href = sourceHref(source);

    return `[{
      ...${variable}.data.seo,
      href: \`${href}\`,
    }]`;
  }

  if (!source.resolvedSection) {
    throw new Error(`Source section "${source.section}" has not been resolved`);
  }

  const section = source.resolvedSection.name;

  if (source.collection) {
    const href = sourceHref(source);

    return `${variable}.map((entry) => ({
      ...entry.data.${section},
      href: \`${href}/\${entry.id}\`,
    }))`;
  }

  const href = sourceHref(source);

  return `[{
    ...${variable}.data.${section},
    href: \`${href}\`,
  }]`;
}

function adaptSource(
  source: string,
  sourceFields: ParsedField[],
  targetFields: ParsedField[],
  typeMap: Map<string, ParsedType>,
) {
  const targetArray = targetFields.find(
    (field) => isArrayType(field) && isObjectType(field),
  );

  if (!targetArray) {
    throw new Error(
      "Sourced section requires an array of object items in its fields",
    );
  }

  const targetItemFields = getTypeFields(targetArray.type.name, typeMap);

  const mappings = targetItemFields
    .map((targetField) => {
      if (targetField.name === "href") {
        return "href: item.href";
      }

      const sourceField = findMatchingField(targetField, sourceFields);

      if (!sourceField) {
        return null;
      }

      return `${targetField.name}: item.${sourceField.name}`;
    })
    .filter((mapping): mapping is string => mapping !== null);

  return `${source}.flatMap((item) => [{ ${mappings.join(", ")} }])`;
}

export function sourceData(
  sources: ParsedSectionSource[],
  targetFields: ParsedField[],
  typeMap: Map<string, ParsedType>,
  seoFields: ParsedField[],
) {
  const expressions = sources.map((source) => {
    const expression = sourceExpression(source);

    const sourceFields = source.resolvedSection
      ? source.resolvedSection.section.fields
      : seoFields;

    return adaptSource(expression, sourceFields, targetFields, typeMap);
  });

  return `[${expressions.map((expression) => `...${expression}`).join(", ")}]`;
}

/* -------------------------------------------------------------------------- */
/* Generated source loading                                                   */
/* -------------------------------------------------------------------------- */

export function sourceLoads(page: ParsedPage) {
  return uniqueSources(page)
    .map((source) => {
      if (source.collection) {
        return `const ${sourceVariable(source)} = await getCollection("${source.collection}");`;
      }

      if (source.entry) {
        const { collection, id } = parseEntrySource(source.entry);

        return `const ${sourceVariable(source)} = await getEntry("${collection}", "${id}");`;
      }

      throw new Error("Section source must specify collection or entry");
    })
    .join("\n");
}

export function sourceAdapters(
  page: ParsedPage,
  typeMap: Map<string, ParsedType>,
  seoFields: ParsedField[],
) {
  return page.sections
    .filter((section) => section.sources?.length)
    .map(
      (section) =>
        `const ${camelCase(section.name)}Items = ${sourceData(
          section.sources!,
          section.section.fields,
          typeMap,
          seoFields,
        )};`,
    )
    .join("\n");
}

export function sourceProps(page: ParsedPage) {
  return page.sections
    .filter((section) => section.sources?.length)
    .map(
      (section) =>
        `${camelCase(section.name)}Items={${camelCase(section.name)}Items}`,
    )
    .join("\n    ");
}

function sourceHref(source: ParsedSectionSource) {
  const page = source.resolvedPage;

  if (!page) {
    throw new Error("Source page has not been resolved");
  }

  if (source.collection) {
    if (!page.folder) {
      throw new Error(`Collection source "${source.collection}" has no folder`);
    }

    return page.folder.replace(/^src\/content/, "").replace(/\/$/, "");
  }

  if (source.entry) {
    const output = page.output ?? page.path;

    if (!output) {
      throw new Error(`Entry source "${source.entry}" has no output path`);
    }

    return (
      output
        .replace(/^src\/content/, "")
        .replace(/^src\/pages/, "")
        .replace(/\/index\.astro$/, "")
        .replace(/\.md$/, "")
        .replace(/\.astro$/, "") || "/"
    );
  }

  throw new Error("Source must specify collection or entry");
}

export function contentImports(page: ParsedPage, functions: string[] = []) {
  const imports = new Set(functions);

  for (const source of uniqueSources(page)) {
    if (source.collection) {
      imports.add("getCollection");
    }

    if (source.entry) {
      imports.add("getEntry");
    }
  }

  if (imports.size === 0) {
    return "";
  }

  return `import { ${[...imports].join(", ")} } from "astro:content";`;
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */

export function sectionComponentName(section: string) {
  return section.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase());
}

export function sectionComponentImport(page: ParsedPage, section: string) {
  const component = sectionComponentName(section);

  return `import ${component} from "${relative(
    page,
    `components/sections/${component}.astro`,
  )}";`;
}
