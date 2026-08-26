import { pages } from "../../config/pages";
import { sections } from "../metadata/sections";
import { types } from "../metadata/field-types";
import { seo } from "../metadata/seo";
import { camelCase } from "../../utils/slugify";
import { enums } from "../metadata/enums";

export interface ParsedTypeReference {
  name: string;
  kind: ParsedTypeKind;
}

export interface ParsedField {
  name: string;
  type: ParsedTypeReference;
  optional: boolean;
  array: boolean;
}

export interface ParsedUnionOption {
  key: string;
  fields: ParsedField[];
}

export interface ParsedUnion {
  discriminator: string;
  options: ParsedUnionOption[];
}

export interface ParsedSectionSource {
  collection?: string;
  entry?: string;
  section?: string;
  resolvedPage?: ParsedPage;
  resolvedSection?: ParsedSectionInstance;
}

export interface ParsedSectionInstance {
  title: string;
  section: ParsedSection;
  name: string;
  content?: ParsedUnion;
  sources?: ParsedSectionSource[];
}

export interface ParsedFile {
  slug: string;
  title: string;
}

export interface ParsedSection {
  key: string;
  fields: ParsedField[];
}

export interface ParsedPage {
  key: string;
  label: string;

  type?: "file" | "collection";

  path?: string;
  folder?: string;
  output?: string;

  layout?: string;

  slug: "filename" | "field";
  create?: boolean;

  schema: string;

  files: ParsedFile[];

  sections: ParsedSectionInstance[];
}

export type ParsedTypeKind = "scalar" | "object" | "enum" | "union";

export interface ParsedType {
  name: string;

  kind: ParsedTypeKind;

  zod?: string;

  decap?: {
    widget: string;
    [key: string]: unknown;
  };

  fields?: ParsedField[];

  values?: string[];

  discriminator?: string;

  options?: ParsedUnionOption[];
}

export interface ParsedSeo {
  fields: ParsedField[];
}

export interface Metadata {
  pages: ParsedPage[];
  sections: ParsedSection[];
  types: ParsedType[];
  seo: ParsedSeo;
  typeMap: Map<string, ParsedType>;
}

function getDefinitions() {
  return {
    ...types,

    ...Object.fromEntries(
      Object.entries(enums).map(([name, values]) => [
        name,
        {
          values,
        },
      ]),
    ),
  };
}

function getTypeKind(definition: any): ParsedTypeKind {
  if (definition.fields) {
    return "object";
  }

  if (definition.values) {
    return "enum";
  }

  if (definition.discriminator) {
    return "union";
  }

  return "scalar";
}

function parseField(
  name: string,
  definition: string,
  typeMap: Map<string, ParsedType>,
): ParsedField {
  let value = definition;

  const optional = value.endsWith("?");

  if (optional) {
    value = value.slice(0, -1);
  }

  const array = value.endsWith("[]");

  if (array) {
    value = value.slice(0, -2);
  }

  const type = typeMap.get(value);

  if (!type) {
    throw new Error(`Unknown type "${value}" in field "${name}"`);
  }

  return {
    name,

    type: {
      name: type.name,
      kind: type.kind,
    },

    optional,
    array,
  };
}

function parseUnion(union: any, typeMap: Map<string, ParsedType>): ParsedUnion {
  return {
    discriminator: union.discriminator,

    options: union.options.map((option: any) => ({
      key: option.key,

      fields: Object.entries(option.fields ?? {}).map(([field, value]) =>
        parseField(field, value as string, typeMap),
      ),
    })),
  };
}

function parseSection(
  section: any,
  typeMap: Map<string, ParsedType>,
): ParsedSection {
  return {
    key: section.key,

    fields: Object.entries(section.fields).map(([name, value]) =>
      parseField(name, value as string, typeMap),
    ),
  };
}

function parseType(
  name: string,
  definition: any,
  typeMap: Map<string, ParsedType>,
): ParsedType {
  const kind = getTypeKind(definition);

  return {
    name,

    kind,

    zod: definition.zod,

    decap: definition.decap,

    fields: definition.fields
      ? Object.entries(definition.fields).map(([field, value]) =>
          parseField(field, value as string, typeMap),
        )
      : undefined,

    values: definition.values,

    discriminator: definition.discriminator,

    options: definition.options?.map((option: any) => ({
      key: option.key,

      fields: Object.entries(option.fields ?? {}).map(([field, value]) =>
        parseField(field, value as string, typeMap),
      ),
    })),
  };
}

function parseSectionInstance(
  section: any,
  typeMap: Map<string, ParsedType>,
): ParsedSectionInstance {
  return {
    title: section.title,
    name: camelCase(section.title),

    section: parseSection(section.section, typeMap),
    content: section.content ? parseUnion(section.content, typeMap) : undefined,
    sources: section.sources?.map((source: any) => ({
      collection: source.collection,
      entry: source.entry,
      section: source.section,
    })),
  };
}

function parseSeo(typeMap: Map<string, ParsedType>): ParsedSeo {
  return {
    fields: Object.entries(seo.fields).map(([name, value]) =>
      parseField(name, value as string, typeMap),
    ),
  };
}

function parseFile(file: any): ParsedFile {
  return {
    slug: file.slug,
    title: file.title,
  };
}

function resolveSourceSections(pages: ParsedPage[]) {
  for (const page of pages) {
    for (const section of page.sections) {
      for (const source of section.sources ?? []) {
        const pageKey = source.collection ?? source.entry?.split(".")[0];

        if (!pageKey) {
          throw new Error(`Source must specify a collection or entry`);
        }

        const sourcePage = pages.find((candidate) => candidate.key === pageKey);

        if (!sourcePage) {
          throw new Error(`Unable to resolve source page "${pageKey}"`);
        }

        source.resolvedPage = sourcePage;

        if (!source.section) {
          continue;
        }

        const sectionName = source.section;

        const sourceSection = sourcePage.sections.find(
          (candidate) => candidate.name === camelCase(sectionName),
        );

        if (!sourceSection) {
          throw new Error(
            `Unable to resolve source section "${sectionName}" on page "${pageKey}"`,
          );
        }

        source.resolvedSection = sourceSection;
      }
    }
  }
}

function parsePage(
  name: string,
  page: any,
  typeMap: Map<string, ParsedType>,
): ParsedPage {
  return {
    key: name,

    label: page.label,

    type: page.type,

    path: page.path,
    folder: page.folder,
    output: page.output,

    layout: page.layout,

    slug: page.slug ?? "filename",
    create: page.create,

    schema: page.schema,

    files: (page.files ?? []).map(parseFile),

    sections: page.sections.map((section: any) =>
      parseSectionInstance(section, typeMap),
    ),
  };
}

export function parseMetadata(): Metadata {
  const parsedTypes: ParsedType[] = [];

  const typeMap = new Map<string, ParsedType>();

  const definitions = getDefinitions();

  // First pass: register type names
  Object.entries(definitions).forEach(([name, definition]) => {
    const kind = getTypeKind(definition);

    const parsed: ParsedType = {
      name,
      kind,
    };

    parsedTypes.push(parsed);
    typeMap.set(name, parsed);
  });

  // Second pass: populate type definitions
  Object.entries(definitions).forEach(([name, definition]) => {
    const parsed = parseType(name, definition, typeMap);

    Object.assign(typeMap.get(name)!, parsed);
  });

  const parsedPages = Object.entries(pages).map(([name, page]) =>
    parsePage(name, page, typeMap),
  );

  resolveSourceSections(parsedPages);

  return {
    pages: parsedPages,

    sections: Object.values(sections).map((section) =>
      parseSection(section, typeMap),
    ),

    types: parsedTypes,

    seo: parseSeo(typeMap),

    typeMap,
  };
}
