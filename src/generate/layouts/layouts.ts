import fs from "node:fs";
import path from "node:path";

import type {
  Metadata,
  ParsedField,
  ParsedPage,
  ParsedSectionInstance,
} from "../metadata/parser";

import { camelCase } from "../../utils/slugify";

import { sectionComponentName } from "../pages/imports";

function generateLayout(page: ParsedPage, generated: Set<string>) {
  if (!page.layout) {
    throw new Error(`Page "${page.key}" requires a layout`);
  }

  const name = page.layout;

  if (generated.has(name)) {
    return;
  }

  generated.add(name);

  const file = path.join("src", "layouts", `${name}.astro`);

  if (fs.existsSync(file)) {
    syncLayout(file, page.sections);
    return;
  }

  fs.mkdirSync(path.dirname(file), {
    recursive: true,
  });

  fs.writeFileSync(file, buildLayout(page.sections), "utf8");

  console.log("✓", file);
}

export function generateLayouts(metadata: Metadata) {
  const generated = new Set<string>();

  for (const page of metadata.pages) {
    if (page.type !== "file" && page.type !== "collection") {
      continue;
    }

    generateLayout(page, generated);
  }
}

function syncProps(content: string, sections: ParsedSectionInstance[]) {
  const variables = [
    "data",
    ...sections
      .filter((section) => section.sources?.length)
      .map((section) => `${camelCase(section.name)}Items`),
  ];

  const declaration = `const { ${variables.join(", ")} } = Astro.props;`;

  const match = content.match(/const\s*\{[^}]*\}\s*=\s*Astro\.props;/);

  if (match) {
    return content.replace(match[0], declaration);
  }

  return content.replace(/---\n/, `---\n${declaration}\n`);
}

function syncLayout(file: string, sections: ParsedSectionInstance[]) {
  let content = fs.readFileSync(file, "utf8");

  for (const section of sections) {
    if (section.content) {
      continue;
    }

    const component = sectionComponentName(section.section.key);

    const match = content.match(
      new RegExp(`<${component}(\\s|[\\s\\S])*?/>`, "m"),
    );

    if (!match) {
      continue;
    }

    let componentBlock = match[0];

    if (section.sources?.length) {
      const title = `title="${section.title}"`;

      if (!componentBlock.includes(title)) {
        componentBlock = componentBlock.replace("/>", `  ${title}\n/>`);
      }

      const itemsProp = "items={";

      if (!componentBlock.includes(itemsProp)) {
        componentBlock = componentBlock.replace(
          "/>",
          `  items={${camelCase(section.name)}Items}\n/>`,
        );
      }
    } else {
      for (const field of section.section.fields) {
        const prop = `${field.name}={`;

        if (componentBlock.includes(prop)) {
          continue;
        }

        componentBlock = componentBlock.replace(
          "/>",
          `  ${renderField(field, `data.${section.name}`)}\n/>`,
        );
      }
    }

    content = content.replace(match[0], componentBlock);
  }

  content = syncProps(content, sections);

  fs.writeFileSync(file, content, "utf8");

  console.log("↺", file);
}

function buildLayout(sections: ParsedSectionInstance[]) {
  const imports = new Set<string>();

  for (const section of sections) {
    imports.add(section.section.key);
  }

  const importBlock = [...imports]
    .sort()
    .map(
      (section) =>
        `import ${sectionComponentName(section)} from "../components/sections/${sectionComponentName(section)}.astro";`,
    )
    .join("\n");

  const variables = [
    "data",
    ...sections
      .filter((section) => section.sources?.length)
      .map((section) => `${camelCase(section.name)}Items`),
  ];

  const propsBlock = `const { ${variables.join(", ")} } = Astro.props;`;

  const renderBlock = renderSections(sections, "data");

  return `---
${importBlock}

${propsBlock}

---
${renderBlock}
`;
}

function renderField(field: ParsedField, source: string) {
  return `${field.name}={${source}.${field.name}}`;
}

function renderSection(section: ParsedSectionInstance, dataSource: string) {
  const component = sectionComponentName(section.section.key);

  if (section.sources?.length) {
    const sourceItems = `${camelCase(section.name)}Items`;

    return `<${component}
  title="${section.title}"
  items={${sourceItems}}
/>`;
  }

  if (section.content) {
    return `<${component}
  data={${dataSource}.${section.name}}
/>`;
  }

  const fields = section.section.fields
    .map((field) => renderField(field, `${dataSource}.${section.name}`))
    .join("\n  ");

  if (!fields) {
    return `<${component} />`;
  }

  return `<${component}
  ${fields}
/>`;
}

export function renderSections(
  sections: ParsedSectionInstance[],
  dataSource: string,
) {
  return sections
    .map((section) => renderSection(section, dataSource))
    .join("\n\n");
}
