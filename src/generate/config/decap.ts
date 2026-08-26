import type {
  Metadata,
  ParsedField,
  ParsedSectionInstance,
  ParsedType,
  ParsedUnion,
  ParsedUnionOption,
} from "../metadata/parser";
import { site } from "../../config/site";
import path from "node:path";

function mediaPath(contentPath: string) {
  return path
    .relative(path.dirname(contentPath), "src/assets/images")
    .replace(/\\/g, "/");
}

function emitUnion(
  union: ParsedUnion,
  metadata: Metadata,
  out: string[],
  indent: number,
) {
  const pad = " ".repeat(indent);

  out.push(`${pad}- label: "Content"`);
  out.push(`${pad}  name: "content"`);
  out.push(`${pad}  widget: list`);
  out.push(`${pad}  types:`);

  for (const option of union.options) {
    emitUnionOption(option, union.discriminator, metadata, out, indent + 4);
  }
}

export function generateDecap(metadata: Metadata): string {
  const out: string[] = [];

  out.push(`local_backend: true`);
  out.push(`publish_mode: editorial_workflow`);
  out.push("");

  out.push(`backend:`);
  out.push(`  name: github`);
  out.push(`  repo: RobertLeeMorgan/${site.repo}`);
  out.push(`  branch: main`);
  out.push(`  site_domain: ${site.url}`);
  out.push(`  base_url: ${site.url}`);
  out.push(`  auth_endpoint: /api/auth`);
  out.push(`  squash_merges: true`);
  out.push("");

  out.push(`media_library:`);
  out.push(`  name: uploadcare`);
  out.push("");

  out.push(`collections:`);

  const files = metadata.pages.filter((p) => p.path);
  const collections = metadata.pages.filter((p) => p.folder);

  // ------------------------------------------------------
  // collections
  // ------------------------------------------------------

  for (const page of collections) {
    out.push(``);
    out.push(`  - name: "${page.key}"`);
    out.push(`    label: "${page.label}"`);
    out.push(`    folder: "${page.folder}"`);
    out.push(`    create: ${page.create ?? true}`);
    out.push(
      `    slug: "${page.slug === "field" ? "{{fields.slug}}" : "{{slug}}"}"`,
    );
    out.push(
      `    media_folder: "${mediaPath(path.join(page.folder!, "_template.md"))}"`,
    );
    out.push(
      `    public_folder: "${mediaPath(path.join(page.folder!, "_template.md"))}"`,
    );

    out.push(`    fields:`);

    emitSeo(metadata, out, 6);

    for (const section of page.sections) {
      emitSection(section, metadata, out, 6);
    }
  }

  // ------------------------------------------------------
  // singleton files
  // ------------------------------------------------------

  if (files.length) {
    out.push("");
    out.push(`  - name: "pages"`);
    out.push(`    label: "Pages"`);
    out.push(`    files:`);

    for (const page of files) {
      out.push("");
      out.push(`      - file: "${page.path}"`);
      out.push(`        name: "${page.key}"`);
      out.push(`        label: "${page.label}"`);
      out.push(`        media_folder: "${mediaPath(page.path!)}"`);
      out.push(`        public_folder: "${mediaPath(page.path!)}"`);
      out.push(`        fields:`);

      emitSeo(metadata, out, 10);

      for (const section of page.sections) {
        emitSection(section, metadata, out, 10);
      }
    }
  }

  return out.join("\n");
}

function emitSeo(metadata: Metadata, out: string[], indent: number) {
  const pad = " ".repeat(indent);

  out.push(`${pad}- label: "SEO"`);
  out.push(`${pad}  name: "seo"`);
  out.push(`${pad}  widget: object`);
  out.push(`${pad}  fields:`);

  for (const field of metadata.seo.fields) {
    emitField(field, metadata, out, indent + 4);
  }
}

function emitSection(
  instance: ParsedSectionInstance,
  metadata: Metadata,
  out: string[],
  indent: number,
) {
  if (instance.sources?.length) {
    return;
  }
  const pad = " ".repeat(indent);

  // content compiler
  if (instance.content) {
    emitUnion(instance.content, metadata, out, indent);
    return;
  }

  out.push(`${pad}- label: "${instance.title}"`);
  out.push(`${pad}  name: "${instance.name}"`);
  out.push(`${pad}  widget: object`);
  out.push(`${pad}  fields:`);

  for (const field of instance.section.fields) {
    emitField(field, metadata, out, indent + 4);
  }
}

function emitScalar(
  field: ParsedField,
  type: ParsedType,
  out: string[],
  indent: number,
) {
  const pad = " ".repeat(indent);

  if (!field.array) {
    out.push(
      `${pad}- { label: "${title(field.name)}", name: "${field.name}", widget: "${type.decap!.widget}"${field.optional ? ", required: false" : ""} }`,
    );

    return;
  }

  out.push(`${pad}- label: "${title(field.name)}"`);
  out.push(`${pad}  name: "${field.name}"`);
  out.push(`${pad}  widget: list`);

  if (field.optional) {
    out.push(`${pad}  required: false`);
  }

  out.push(`${pad}  field:`);
  out.push(`${pad}    label: "${title(field.type.name)}"`);
  out.push(`${pad}    name: "${field.type.name}"`);
  out.push(`${pad}    widget: "${type.decap!.widget}"`);
}

function emitObject(
  field: ParsedField,
  type: ParsedType,
  metadata: Metadata,
  out: string[],
  indent: number,
) {
  const pad = " ".repeat(indent);

  if (!field.array) {
    out.push(`${pad}- label: "${title(field.name)}"`);
    out.push(`${pad}  name: "${field.name}"`);
    out.push(`${pad}  widget: object`);

    if (field.optional) {
      out.push(`${pad}  required: false`);
    }

    out.push(`${pad}  fields:`);

    for (const child of type.fields!) {
      emitField(child, metadata, out, indent + 4);
    }

    return;
  }

  out.push(`${pad}- label: "${title(field.name)}"`);
  out.push(`${pad}  name: "${field.name}"`);
  out.push(`${pad}  widget: list`);

  if (field.optional) {
    out.push(`${pad}  required: false`);
  }

  out.push(`${pad}  fields:`);

  for (const child of type.fields!) {
    emitField(child, metadata, out, indent + 4);
  }
}

function emitEnum(
  field: ParsedField,
  type: ParsedType,
  out: string[],
  indent: number,
) {
  const pad = " ".repeat(indent);

  if (!field.array) {
    out.push(`${pad}- label: "${title(field.name)}"`);
    out.push(`${pad}  name: "${field.name}"`);
    out.push(`${pad}  widget: select`);
    out.push(`${pad}  options:`);

    for (const value of type.values!) {
      out.push(`${pad}    - "${value}"`);
    }

    if (field.optional) {
      out.push(`${pad}  required: false`);
    }

    return;
  }

  out.push(`${pad}- label: "${title(field.name)}"`);
  out.push(`${pad}  name: "${field.name}"`);
  out.push(`${pad}  widget: list`);

  if (field.optional) {
    out.push(`${pad}  required: false`);
  }

  out.push(`${pad}  field:`);
  out.push(`${pad}    widget: select`);
  out.push(`${pad}    options:`);

  for (const value of type.values!) {
    out.push(`${pad}      - "${value}"`);
  }
}

function emitUnionOption(
  option: ParsedUnionOption,
  discriminator: string,
  metadata: Metadata,
  out: string[],
  indent: number,
) {
  const pad = " ".repeat(indent);

  out.push(`${pad}- label: "${title(option.key)}"`);
  out.push(`${pad}  name: "${option.key}"`);
  out.push(`${pad}  widget: object`);
  out.push(`${pad}  fields:`);

  out.push(
    `${pad}    - { label: "${title(discriminator)}", name: "${discriminator}", widget: "hidden", default: "${option.key}" }`,
  );

  for (const field of option.fields) {
    emitField(field, metadata, out, indent + 4);
  }
}

function emitUnionField(
  field: ParsedField,
  type: ParsedType,
  metadata: Metadata,
  out: string[],
  indent: number,
) {
  const pad = " ".repeat(indent);

  out.push(`${pad}- label: "${title(field.name)}"`);
  out.push(`${pad}  name: "${field.name}"`);
  out.push(`${pad}  widget: list`);

  if (field.optional) {
    out.push(`${pad}  required: false`);
  }

  out.push(`${pad}  types:`);

  for (const option of type.options ?? []) {
    emitUnionOption(option, type.discriminator!, metadata, out, indent + 4);
  }
}

function getType(field: ParsedField, metadata: Metadata): ParsedType {
  const type = metadata.typeMap.get(field.type.name);

  if (!type) {
    throw new Error(`Unknown type "${field.type.name}"`);
  }

  return type;
}

function emitField(
  field: ParsedField,
  metadata: Metadata,
  out: string[],
  indent: number,
) {
  const type = getType(field, metadata);

  switch (type.kind) {
    case "scalar":
      emitScalar(field, type, out, indent);
      return;

    case "enum":
      emitEnum(field, type, out, indent);
      return;

    case "object":
      emitObject(field, type, metadata, out, indent);
      return;

    case "union":
      emitUnionField(field, type, metadata, out, indent);
      return;
  }
}

function title(text: string) {
  return text.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}
