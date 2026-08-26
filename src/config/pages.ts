import { sections } from "../generate/metadata/sections";

import type { PageConfig } from "./types";

export const pages = {
  home: {
    label: "Home",

    type: "file",
    path: "src/content/pages/index.md",

    layout: "HomeLayout",
    schema: "home",

    sections: [
      {
        section: sections.hero,
        title: "Hero",
      },
      {
        section: sections.richTextSection,
        title: "Introduction",
      },
      {
        section: sections.banner,
        title: "Banner",
      },
      {
        section: sections.carouselSection,
        title: "Carousel",
      },
      {
        section: sections.cards,
        title: "Services",
      },
      {
        section: sections.iconListSection,
        title: "Why Choose Us",
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },

  services: {
    label: "Services",

    type: "collection",
    folder: "src/content/services",

    layout: "ServiceLayout",
    schema: "service",

    slug: "filename",
    create: true,

    sections: [
      {
        section: sections.hero,
        title: "Hero",
      },
      {
        section: sections.richTextSection,
        title: "Overview",
      },
      {
        section: sections.cards,
        title: "Related Services",
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },

  insights: {
    label: "Insights",

    output: "src/pages/insights/index.astro",

    schema: "article",

    sections: [
      {
        section: sections.cards,
        title: "Latest Insights",

        sources: [
          {
            collection: "news",
            section: "introduction",
          },
          {
            collection: "caseStudies",
            section: "introduction",
          },
        ],
      },
    ],
  },

  news: {
    label: "News",

    type: "collection",
    folder: "src/content/insights/news",

    layout: "InsightLayout",
    schema: "article",

    slug: "field",
    create: true,

    sections: [
      {
        section: sections.richTextSection,
        title: "Introduction",
      },
      {
        section: sections.carouselSection,
        title: "Related Articles",
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },

  caseStudies: {
    label: "Case Studies",

    type: "collection",
    folder: "src/content/insights/case-studies",

    layout: "InsightLayout",
    schema: "article",

    slug: "field",
    create: true,

    sections: [
      {
        section: sections.richTextSection,
        title: "Introduction",
      },
      {
        section: sections.carouselSection,
        title: "Related Case Studies",
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },

  featuredInsights: {
    label: "Featured Insights",

    type: "file",
    path: "src/content/pages/featured-insights.md",
    output: "src/pages/featured-insights/index.astro",

    layout: "FeaturedInsightsLayout",
    schema: "article",

    sections: [
      {
        section: sections.hero,
        title: "Hero",
      },
      {
        section: sections.cards,
        title: "Featured",
        sources: [
          {
            collection: "news",
          },
        ],
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },
} satisfies Record<string, PageConfig>;
