import fs from "node:fs";
import path from "node:path";

import { parseMetadata } from "./metadata/parser";

import { generatePages } from "./pages";
import { generateContent } from "./content/content";
import { generateLayouts } from "./layouts/layouts";

import { generateZod } from "./config/zod";
import { generateDecap } from "./config/decap";
import { generateTypes } from "./types/generate";

export function generate() {
  const ROOT = process.cwd();

  const metadata = parseMetadata();

  generatePages(metadata);
  generateContent(metadata);
  generateLayouts(metadata)
  generateTypes()

  const files = [
    {
      path: path.join(ROOT, "src", "content.config.ts"),
      content: generateZod(metadata),
    },
    {
      path: path.join(ROOT, "public", "admin", "config.yml"),
      content: generateDecap(metadata),
    },
  ];

  for (const file of files) {
    fs.mkdirSync(path.dirname(file.path), {
      recursive: true,
    });

    fs.writeFileSync(file.path, file.content, "utf8");

    console.log(`✓ ${path.relative(ROOT, file.path)}`);
  }

  return metadata;
}