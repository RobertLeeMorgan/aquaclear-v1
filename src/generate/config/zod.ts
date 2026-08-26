import type {
  Metadata,
  ParsedField,
  ParsedSectionInstance,
  ParsedType,
  ParsedUnion,
  ParsedUnionOption,
} from "../metadata/parser";

function generateUnionOption(
  option: ParsedUnionOption,
  discriminator: string,
  metadata: Metadata,
) {
  const out: string[] = [];

  out.push(`z.object({`);

  out.push(`  ${discriminator}: z.literal("${option.key}"),`);

  for (const field of option.fields) {
    out.push(`  ${field.name}: ${generateField(field, metadata)},`);
  }

  out.push(`})`);

  return out.join("\n");
}

function generateDiscriminatedUnion(
  type: ParsedType,
  metadata: Metadata,
): string {
  const out: string[] = [];

  out.push(`z.discriminatedUnion("${type.discriminator}", [`);

  for (const option of type.options ?? []) {
    out.push(
      indent(generateUnionOption(option, type.discriminator!, metadata), 2) +
        ",",
    );
  }

  out.push(`])`);

  return out.join("\n");
}

function generateType(type: ParsedType, metadata: Metadata): string {
  switch (type.kind) {
    case "object":
      return generateObject(type.fields!, metadata);

    case "enum":
      return `z.enum(${JSON.stringify(type.values)})`;

    case "union":
      return generateDiscriminatedUnion(type, metadata);

    case "scalar":
      return type.zod!;

    default:
      throw new Error(`Unsupported type kind: ${(type as ParsedType).kind}`);
  }
}

export function generateZod(metadata: Metadata): string {
  const out: string[] = [];

  out.push(`import { defineCollection } from "astro:content";`);
  out.push(`import { glob } from "astro/loaders";`);
  out.push(`import { z } from "astro/zod";`);
  out.push("");

  // ------------------------------------------------------------------
  // enums
  // ------------------------------------------------------------------

  const enumTypes = metadata.types.filter((t) => t.kind === "enum");

  for (const type of enumTypes) {
    out.push(
      `const ${type.name}Schema = z.enum(${JSON.stringify(type.values)});`,
    );

    out.push("");
  }

  // ------------------------------------------------------------------
  // shared custom types
  // ------------------------------------------------------------------

  const complexTypes = metadata.types.filter(
    (t) => t.kind === "object" || t.kind === "union",
  );

  for (const type of complexTypes) {
    out.push(`const ${type.name}Schema = (image: () => any) =>`);
    out.push(indent(generateType(type, metadata), 2) + ";");
    out.push("");
  }

  const contentPages = metadata.pages.filter(
    (page) => page.path || page.folder,
  );

  // ------------------------------------------------------------------
  // collections
  // ------------------------------------------------------------------

  for (const page of contentPages) {
    out.push(`const ${page.key} = defineCollection({`);

    if (page.folder) {
      out.push(
        `  loader: glob({ pattern: "**/*.md", base: "./${page.folder}" }),`,
      );
    } else if (page.path) {
      const parts = page.path.split("/");
      const filename = parts.pop()!;
      const base = parts.join("/");

      out.push(
        `  loader: glob({ pattern: "${filename}", base: "./${base}" }),`,
      );
    }

    out.push(``);
    out.push(`  schema: ({ image }) =>`);

    out.push(indent(generatePageSchema(page.sections, metadata), 4) + ",");

    out.push(`});`);
    out.push("");
  }

  // ------------------------------------------------------------------
  // export
  // ------------------------------------------------------------------

  out.push(`export const collections = {`);

  for (const page of contentPages) {
    out.push(`  ${page.key},`);
  }

  out.push(`};`);

  return out.join("\n");
}

function generatePageSchema(
  sections: ParsedSectionInstance[],
  metadata: Metadata,
) {
  const lines: string[] = [];
  const counts = new Map<string, number>();

  lines.push(`z.object({`);

  lines.push(`  seo: ${generateObject(metadata.seo.fields, metadata)},`);

  for (const instance of sections) {
    if (instance.sources?.length) {
      continue;
    }

    const key = instance.name;

    const count = (counts.get(key) ?? 0) + 1;
    counts.set(key, count);

    lines.push(
      `  ${count === 1 ? key : `${key}${count}`}: ${generateSection(instance, metadata)},`,
    );
  }

  lines.push(`})`);

  return lines.join("\n");
}

function generateContentSection(union: ParsedUnion, metadata: Metadata) {
  const out: string[] = [];

  out.push(`z.array(`);

  out.push(`  z.discriminatedUnion("${union.discriminator}", [`);

  for (const option of union.options) {
    out.push(
      indent(generateUnionOption(option, union.discriminator, metadata), 4) +
        ",",
    );
  }

  out.push(`  ])`);
  out.push(`)`);

  return out.join("\n");
}

function generateSection(instance: ParsedSectionInstance, metadata: Metadata) {
  if (instance.content) {
    return generateContentSection(instance.content, metadata);
  }

  return generateObject(instance.section.fields, metadata);
}

function generateObject(fields: ParsedField[], metadata: Metadata) {
  const out: string[] = [];

  out.push(`z.object({`);

  for (const field of fields) {
    out.push(`  ${field.name}: ${generateField(field, metadata)},`);
  }

  out.push(`})`);

  return out.join("\n");
}

function generateField(field: ParsedField, metadata: Metadata): string {
  let value = "";

  const type = metadata.typeMap.get(field.type.name);

  if (!type) {
    throw new Error(`Unknown parsed type "${field.type.name}"`);
  }

  switch (type.kind) {
    case "scalar":
      value = type.zod!;
      break;

    case "enum":
      value = `${type.name}Schema`;
      break;

    case "object":
    case "union":
      value = `${type.name}Schema(image)`;
      break;
  }

  if (field.array) {
    value = `z.array(${value})`;
  }

  if (field.optional) {
    value += `.optional()`;
  }

  return value;
}

function indent(text: string, spaces: number) {
  const pad = " ".repeat(spaces);

  return text
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n");
}
