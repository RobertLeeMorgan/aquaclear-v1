import fs from "node:fs/promises";
import path from "node:path";

import {
  parseMetadata,
  type ParsedField,
  type ParsedType,
  type ParsedSection,
} from "../metadata/parser";

const primitiveMap: Record<string, string> = {
  string: "string",
  markdown: "string",
  text: "string",
  number: "number",
  boolean: "boolean",
  date: "Date",
  image: "ImageMetadata",
};

function withSuffix(name: string, suffix: string) {
  return name.endsWith(suffix)
    ? name
    : `${name}${suffix}`;
}

function pascal(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, "");
}

function typeName(name: string) {
  return withSuffix(pascal(name), "Type");
}

function sectionName(name: string) {
  return withSuffix(pascal(name), "Section");
}

function enumName(name: string) {
  return withSuffix(pascal(name), "Enum");
}

function unionName(name: string) {
  return withSuffix(pascal(name), "Union");
}

function getBaseType(field: ParsedField) {
  switch (field.type.kind) {
    case "scalar":
      return primitiveMap[field.type.name];

    case "enum":
      return enumName(field.type.name);

    case "object":
      return typeName(field.type.name);

    case "union":
      return unionName(field.type.name);
  }
}

function getArrayType(type: string, field: ParsedField) {
  return field.array ? `${type}[]` : type;
}

function resolveType(field: ParsedField) {
  const type = getBaseType(field);

  return getArrayType(type, field);
}

function emitInterface(out: string[], name: string, fields: ParsedField[]) {
  out.push(`export interface ${name} {`);

  for (const field of fields) {
    out.push(
      `  ${field.name}${field.optional ? "?" : ""}: ${resolveType(field)};`,
    );
  }

  out.push("}");
  out.push("");
}

function emitSectionUnion(out: string[], sections: ParsedSection[]) {
  out.push(`export type ContentSection =`);

  for (const section of sections) {
    out.push(`  | ({ type: "${section.key}" } & ${sectionName(section.key)})`);
  }

  out.push("");
}

function emitEnum(out: string[], name: string, values: string[]) {
  out.push(`export type ${enumName(name)} =`);

  for (const value of values) {
    out.push(`  | "${value}"`);
  }

  out.push("");
}

function emitUnion(out: string[], type: ParsedType) {
  out.push(`export type ${unionName(type.name)} =`);

  for (const option of type.options ?? []) {
    out.push(
      `  | ({ ${type.discriminator}: "${option.key}" } & ${pascal(type.name)}${pascal(option.key)}Type)`,
    );
  }

  out.push("");

  for (const option of type.options ?? []) {
    emitInterface(
      out,
      `${pascal(type.name)}${pascal(option.key)}Type`,
      option.fields,
    );
  }
}

export async function generateTypes() {
  const metadata = parseMetadata();

  const out: string[] = [];

  out.push(`import type { ImageMetadata } from "astro";`);
  out.push("");

  for (const type of metadata.types) {
    switch (type.kind) {
      case "object":
        emitInterface(out, typeName(type.name), type.fields ?? []);
        break;

      case "enum":
        emitEnum(out, type.name, type.values!);
        break;

      case "union":
        emitUnion(out, type);
        break;
    }
  }

  const renderableSections = metadata.sections.filter(
    (section) => section.key !== "content",
  );

  for (const section of renderableSections) {
    emitInterface(out, sectionName(section.key), section.fields);
  }

  emitSectionUnion(out, renderableSections);

  const file = path.join(process.cwd(), "src/lib/types.ts");

  await fs.mkdir(path.dirname(file), { recursive: true });

  await fs.writeFile(file, out.join("\n"));
}
