import fs from "node:fs";
import path from "node:path";
import { dump } from "js-yaml";
import { updateContent } from "./merge";

import type {
  Metadata,
  ParsedField,
  ParsedUnion,
  ParsedUnionOption,
  ParsedType,
  ParsedSectionInstance,
} from "../metadata/parser";

function placeholderImage(contentFile: string) {
  return path
    .relative(
      path.dirname(contentFile),
      "src/assets/images/hero/placeholder.jpeg",
    )
    .replace(/\\/g, "/");
}

function buildUnionOption(
  option: ParsedUnionOption,
  discriminator: string,
  metadata: Metadata,
  file: string,
): Record<string, unknown> {
  return {
    [discriminator]: option.key,
    ...buildObject(option.fields, metadata, file),
  };
}

function buildUnionValue(union: ParsedUnion, metadata: Metadata, file: string) {
  return buildUnionOption(
    union.options[0],
    union.discriminator,
    metadata,
    file,
  );
}

function buildUnionArray(union: ParsedUnion, metadata: Metadata, file: string) {
  return [
    buildUnionOption(union.options[0], union.discriminator, metadata, file),
  ];
}

function buildSection(
  instance: ParsedSectionInstance,
  metadata: Metadata,
  file: string,
): unknown {
  if (instance.sources?.length) {
    return undefined;
  }

  if (instance.content) {
    return buildUnionArray(instance.content, metadata, file);
  }

  return buildObject(instance.section.fields, metadata, file);
}

function buildContent(
  title: string,
  sections: ParsedSectionInstance[],
  metadata: Metadata,
  file: string,
) {
  const data: Record<string, unknown> = {
    title,
    seo: {
      ...buildObject(metadata.seo.fields, metadata, file),
      title,
    },
  };

  const counts = new Map<string, number>();

  for (const instance of sections) {
    if (instance.sources?.length) {
      continue;
    }

    const key = instance.name;

    const count = (counts.get(key) ?? 0) + 1;
    counts.set(key, count);

    data[count === 1 ? key : `${key}${count}`] = buildSection(
      instance,
      metadata,
      file,
    );
  }

  return dump(data, {
    lineWidth: -1,
    noRefs: true,
  });
}

export function generateContent(metadata: Metadata) {
  for (const page of metadata.pages) {
    if (page.path) {
      const file = page.path;

      const content = buildContent(page.label, page.sections, metadata, file);

      if (fs.existsSync(file)) {
        updateContent(file, content);
      } else {
        write(file, content);
      }

      continue;
    }

    if (page.folder) {
      if (page.files.length) {
        for (const entry of page.files) {
          const file = path.join(page.folder, `${entry.slug}.md`);

          const content = buildContent(
            entry.title,
            page.sections,
            metadata,
            file,
          );

          if (fs.existsSync(file)) {
            updateContent(file, content);
          } else {
            write(file, content);
          }
        }
      } else {
        const file = path.join(page.folder, "_template.md");

        const content = buildContent("Template", page.sections, metadata, file);

        if (fs.existsSync(file)) {
          updateContent(file, content);
        } else {
          write(file, content);
        }
      }
    }
  }
}

function buildObject(
  fields: ParsedField[],
  metadata: Metadata,
  file: string,
): Record<string, unknown> {
  const object: Record<string, unknown> = {};

  for (const field of fields) {
    object[field.name] = defaultValue(field, metadata, file);
  }

  return object;
}

function getType(field: ParsedField, metadata: Metadata): ParsedType {
  const type = metadata.typeMap.get(field.type.name);

  if (!type) {
    throw new Error(`Unknown type "${field.type.name}"`);
  }

  return type;
}

function defaultScalar(type: string, file: string): unknown {
  switch (type) {
    case "string":
    case "text":
    case "markdown":
    case "date":
      return "";

    case "number":
      return 0;

    case "boolean":
      return false;

    case "image":
      return placeholderImage(file);

    default:
      return null;
  }
}

function defaultValue(
  field: ParsedField,
  metadata: Metadata,
  file: string,
): unknown {
  const type = getType(field, metadata);

  let value: unknown;

  switch (type.kind) {
    case "scalar":
      value = defaultScalar(type.name, file);
      break;

    case "enum":
      value = type.values![0];
      break;

    case "object":
      value = buildObject(type.fields!, metadata, file);
      break;

    case "union":
      value = buildUnionValue(
        {
          discriminator: type.discriminator!,
          options: type.options!,
        },
        metadata,
        file,
      );
      break;
  }

  if (field.array) {
    switch (type.kind) {
      case "scalar":
      case "enum":
        return [];

      case "object":
        return [buildObject(type.fields!, metadata, file)];

      case "union":
        return buildUnionArray(
          {
            discriminator: type.discriminator!,
            options: type.options!,
          },
          metadata,
          file,
        );
    }
  }

  return value;
}

function write(file: string, content: string) {
  const absolute = path.resolve(file);

  fs.mkdirSync(path.dirname(absolute), {
    recursive: true,
  });

  const output = `---\n${content.trimEnd()}\n---\n`;

  fs.writeFileSync(absolute, output, "utf8");

  console.log("✓", file);
}
