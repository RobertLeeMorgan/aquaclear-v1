import type { sections } from "../generate/metadata/sections";

type SectionSource = {
  collection: string;
  section?: string;
};

type SectionInstance = {
  section: (typeof sections)[keyof typeof sections];

  title: string;

  content?: {
    discriminator: string;

    options: readonly (typeof sections)[keyof typeof sections][];
  };

  sources?: readonly SectionSource[];
};

interface BasePage {
  label: string;

  layout?: string;

  schema: string;

  sections: readonly SectionInstance[];
}

export interface FilePage extends BasePage {
  type: "file";

  path: string;
}

export interface CollectionPage extends BasePage {
  type: "collection";

  folder: string;

  slug: "filename" | "field";

  create?: boolean;

  files?: readonly {
    slug: string;
    title: string;
  }[];
}

export interface OutputPage extends BasePage {
  output: string;
}

export type PageConfig =
  | FilePage
  | CollectionPage
  | OutputPage;