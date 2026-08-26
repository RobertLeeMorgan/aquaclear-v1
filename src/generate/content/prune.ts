import fs from "node:fs";
import path from "node:path";
import { load, dump } from "js-yaml";

import {
  parseMetadata,
  type Metadata,
  type ParsedField,
  type ParsedSectionInstance,
  type ParsedType,
} from "../metadata/parser";

export function pruneContent(metadata = parseMetadata()) {
  for (const page of metadata.pages) {
    if (!page.type) {
      continue;
    }

    if (page.type === "file") {
      pruneFile(page.path!, buildSchema(page.sections, metadata));

      continue;
    }

    if (page.files.length) {
      for (const file of page.files) {
        pruneFile(
          path.join(page.folder!, `${file.slug}.md`),
          buildSchema(page.sections, metadata),
        );
      }

      continue;
    }

    const template = path.join(page.folder!, "_template.md");

    if (fs.existsSync(template)) {
      pruneFile(template, buildSchema(page.sections, metadata));
    }
  }

  console.log("");
  console.log("Prune complete.");
}

function pruneFile(file: string, schema: Record<string, unknown>) {
  if (!fs.existsSync(file)) {
    return;
  }

  const existing = parseYaml(fs.readFileSync(file, "utf8"));

  const pruned = prune(existing, schema);

  fs.writeFileSync(
    file,
    `---\n${dump(pruned, {
      lineWidth: -1,
      noRefs: true,
    }).trimEnd()}\n---\n`,
    "utf8",
  );

  console.log("✂", file);
}

function buildUnion(type: ParsedType, metadata: Metadata) {
  const option = type.options![0];

  return {
    [type.discriminator!]: option.key,
    ...buildObject(option.fields, metadata),
  };
}

function buildSchema(sections: ParsedSectionInstance[], metadata: Metadata) {
  const schema: Record<string, unknown> = {
    title: "",
    seo: buildObject(metadata.seo.fields, metadata),
  };

  const counts = new Map<string, number>();

  for (const instance of sections) {
    if (instance.sources?.length) {
      continue;
    }

    const key = instance.name;

    const count = (counts.get(key) ?? 0) + 1;
    counts.set(key, count);

    schema[count === 1 ? key : `${key}${count}`] = buildSection(
      instance,
      metadata,
    );
  }

  return schema;
}

function buildSection(
  instance: ParsedSectionInstance,
  metadata: Metadata,
): unknown {
  if (instance.content) {
    return instance.content.options.reduce(
      (acc, option) => {
        acc[option.key] = buildObject(option.fields, metadata);

        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  return buildObject(instance.section.fields, metadata);
}

function buildObject(fields: ParsedField[], metadata: Metadata) {
  const obj: Record<string, unknown> = {};

  for (const field of fields) {
    obj[field.name] = buildField(field, metadata);
  }

  return obj;
}

function buildField(field: ParsedField, metadata: Metadata) {
  const type = metadata.typeMap.get(field.type.name);

  if (!type) {
    throw new Error(`Unknown type "${field.type.name}"`);
  }

  if (field.array) {
    switch (type.kind) {
      case "scalar":
      case "enum":
        return [];

      case "object":
        return [buildObject(type.fields!, metadata)];

      case "union":
        return type.options!.map((option) => ({
          [type.discriminator!]: option.key,
          ...buildObject(option.fields, metadata),
        }));
    }
  }

  switch (type.kind) {
    case "scalar":
    case "enum":
      return null;

    case "object":
      return buildObject(type.fields ?? [], metadata);

    case "union":
      return buildUnion(type, metadata);
  }
}

function prune(existing: any, schema: any): any {
  if (schema === null || typeof schema !== "object") {
    return existing;
  }

  if (
    !Array.isArray(schema) &&
    Object.values(schema).every(
      (value) => value && typeof value === "object" && !Array.isArray(value),
    ) &&
    Array.isArray(existing) &&
    existing.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.type === "string" &&
        typeof item.title === "string",
    )
  ) {
    return existing
      .filter((item) => item.type in schema)
      .map((item) => ({
        type: item.type,
        ...prune(item, schema[item.type]),
      }));
  }

  if (Array.isArray(schema)) {
    if (!Array.isArray(existing)) {
      return existing;
    }

    if (
      schema.length === 0 ||
      typeof schema[0] !== "object" ||
      schema[0] === null
    ) {
      return existing;
    }

    return existing.map((item) => prune(item, schema[0]));
  }

  if (existing == null || typeof existing !== "object") {
    return existing;
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(schema)) {
    if (!(key in existing)) {
      continue;
    }

    result[key] = prune(existing[key], schema[key]);
  }

  return result;
}

function parseYaml(content: string): any {
  const match = content.match(/^---\s*([\s\S]*?)\s*---/);

  if (!match) {
    return {};
  }

  return load(match[1]) ?? {};
}
