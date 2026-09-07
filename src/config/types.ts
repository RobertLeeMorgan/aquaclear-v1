import type { sections } from "../generate/metadata/sections";

type SectionDefinition =
  (typeof sections)[keyof typeof sections];

type SectionInstance = {
  section: SectionDefinition;

  title: string;

  content?: {
    discriminator: string;
    options: readonly SectionDefinition[];
  };

  sources?: readonly SectionSource[];
};

type SectionSource = {
  collection?: string;
  entry?: string;
  section?: string;
};

type BasePage = {
  label: string;
  layout?: string;
  schema: string;
  sections: readonly SectionInstance[];
};

export type FilePage = BasePage & {
  type: "file";
  path: string;
};

export type CollectionPage = BasePage & {
  type: "collection";
  folder: string;
  slug: "filename" | "field";
  create?: boolean;

  files?: readonly {
    slug: string;
    title: string;
  }[];
};

export type OutputPage = BasePage & {
  output: string;
};

export type PageConfig =
  | FilePage
  | CollectionPage
  | OutputPage;

/* -------------------------------------------------------------------------- */
/* Source validation                                                          */
/* -------------------------------------------------------------------------- */

type Page = {
  sections: readonly {
    title: string;
    section: SectionDefinition;
  }[];
};

type Pages = Record<string, Page>;

type EntryParts<S extends string> =
  S extends `${infer Page}.${string}`
    ? [Page]
    : never;

type PageForEntry<
  P extends Pages,
  Entry extends string,
> =
  EntryParts<Entry> extends [
    infer Page extends keyof P,
  ]
    ? P[Page]
    : never;

type SectionForTitle<
  P extends Page,
  Title extends string,
> =
  P["sections"][number] extends infer S
    ? S extends {
        title: Title;
        section: infer Section extends SectionDefinition;
      }
      ? Section
      : never
    : never;

type Fields<S extends SectionDefinition> =
  S extends { fields: infer F }
    ? F
    : never;

type Compatible<
  Source extends SectionDefinition,
  Target extends SectionDefinition,
> =
  [Fields<Source>] extends [Fields<Target>]
    ? [Fields<Target>] extends [Fields<Source>]
      ? true
      : false
    : false;

type ValidEntrySource<
  P extends Pages,
  Target extends SectionDefinition,
  Source,
> =
  Source extends {
    entry: infer Entry extends string;
    section: infer Title extends string;
  }
    ? PageForEntry<P, Entry> extends infer SourcePage
      ? SourcePage extends Page
        ? SectionForTitle<SourcePage, Title> extends infer SourceSection
          ? SourceSection extends SectionDefinition
            ? Compatible<SourceSection, Target> extends true
              ? Source
              : never
            : never
          : never
        : never
      : never
    : Source;

type ValidateSection<
  P extends Pages,
  S,
> =
  S extends {
    section: infer Target extends SectionDefinition;
    sources: readonly (infer Source)[];
  }
    ? Source extends {
        entry: string;
        section: string;
      }
      ? ValidEntrySource<P, Target, Source> extends never
        ? never
        : S
      : S
    : S;

/* -------------------------------------------------------------------------- */
/* Validate every section individually                                        */
/* -------------------------------------------------------------------------- */

type ValidateSections<
  P extends Pages,
  S extends readonly unknown[],
> = {
  [K in keyof S]:
    S[K] extends unknown
      ? ValidateSection<P, S[K]>
      : never;
};

/* -------------------------------------------------------------------------- */
/* Validate every page                                                        */
/* -------------------------------------------------------------------------- */

type ValidatePage<
  P extends Pages,
  PageValue,
> =
  PageValue extends {
    sections: infer S extends readonly unknown[];
  }
    ? PageValue & {
        sections: ValidateSections<P, S>;
      }
    : PageValue;

type ValidatePages<P extends Pages> = {
  [K in keyof P]: ValidatePage<P, P[K]>;
};

export function definePages<const P extends Pages>(
  pages: P & ValidatePages<P>,
): P {
  return pages;
}