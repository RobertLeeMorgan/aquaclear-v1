import fs from "node:fs";
import { load, dump } from "js-yaml";

export function updateContent(file: string, generatedYaml: string) {
  const existing = parseYaml(fs.readFileSync(file, "utf8"));
  const generated = parseYaml(`---\n${generatedYaml}\n---`);

  const merged = merge(existing, generated);

  fs.writeFileSync(
    file,
    `---\n${dump(merged, {
      lineWidth: -1,
      noRefs: true,
    }).trimEnd()}\n---\n`,
    "utf8",
  );

  console.log("↺", file);
}

function parseYaml(content: string): any {
  const match = content.match(/^---\s*([\s\S]*?)\s*---/);

  if (!match) {
    return {};
  }

  return load(match[1]) ?? {};
}

function mergeDiscriminatedArray(existing: any[], generated: any[]) {
  const result = [...existing];

  for (const template of generated) {
    const existingItem = existing.find((item) => item?.type === template.type);

    if (existingItem) {
      continue;
    }

    result.push(template);
  }

  return result.map((item) => {
    const template = generated.find(
      (generatedItem) => generatedItem?.type === item?.type,
    );

    return template ? merge(item, template) : item;
  });
}

function merge(existing: any, generated: any): any {
  // Existing file missing
  if (existing == null) {
    return generated;
  }

  // Primitive values always preserve user content
  if (typeof generated !== "object" || generated === null) {
    return existing;
  }

  // Arrays
  if (Array.isArray(generated)) {
    if (!Array.isArray(existing)) {
      return generated;
    }

    if (
      generated.every(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.type === "string" &&
          typeof item.title === "string",
      )
    ) {
      return mergeDiscriminatedArray(existing, generated);
    }

    return existing;
  }

  // Objects
  const result: Record<string, any> = {
    ...existing,
  };

  for (const [key, value] of Object.entries(generated)) {
    // content is user-owned after creation
    if (!(key in existing)) {
      result[key] = value;
      continue;
    }
    result[key] = merge(existing[key], value);
  }
  return result;
}
