import fs from "node:fs";
import path from "node:path";

import type { Metadata } from "../metadata/parser";

import { pageOutputPath, collectionOutputPath } from "./imports";

import { buildSingleton, buildCollection, buildOutput } from "./builders";

export function generatePages(metadata: Metadata) {
  for (const page of metadata.pages) {
    if (page.key.endsWith("Page")) {
      continue;
    }

    if (page.type === "file") {
      write(pageOutputPath(page), buildSingleton(page, metadata));

      continue;
    }

    if (page.type === "collection") {
      write(collectionOutputPath(page), buildCollection(page, metadata));

      continue;
    }

    write(pageOutputPath(page), buildOutput(page, metadata));
  }
}

function write(file: string, content: string) {
  const absolute = path.resolve(file);

  if (fs.existsSync(absolute)) {
    console.log("↷", file, "(exists)");
    return;
  }

  fs.mkdirSync(path.dirname(absolute), {
    recursive: true,
  });

  fs.writeFileSync(absolute, content.trimEnd() + "\n", "utf8");

  console.log("✓", file);
}
