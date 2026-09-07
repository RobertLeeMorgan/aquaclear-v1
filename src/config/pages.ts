import { sections } from "../generate/metadata/sections";

import { definePages } from "./types";

export const pages = definePages({
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
        section: sections.cards,
        title: "Services",
        sources: [
          {
            collection: "services",
          },
        ],
      },
      {
        section: sections.iconListSection,
        title: "Why Choose Us",
      },
      {
        section: sections.richTextSection,
        title: "Featured Project"
      },
      {
        section: sections.iconListSection,
        title: "Trusted By",

        sources: [{ entry: "clients.clients", section: "Trusted By" }],
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },

  about: {
    label: "About",

    type: "file",
    path: "src/content/pages/about.md",

    layout: "AboutLayout",
    schema: "about",

    sections: [
      {
        section: sections.hero,
        title: "Hero",
      },
      {
        section: sections.richTextSection,
        title: "About Aquaclear",
      },
      {
        section: sections.keyFeatures,
        title: "Experience and Expertise",
      },
      {
        section: sections.iconListSection,
        title: "Truxor",
      },
      {
        section: sections.richTextSection,
        title: "How We Work",
      },
      {
        section: sections.carouselSection,
        title: "Trusted Experience",

        sources: [
          {
            entry: "clients.clients",
            section: "Testimonials",
          },
        ],
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
        title: "Overview",

        section: sections.content,

        content: {
          discriminator: "type",

          options: [
            sections.hero,
            sections.pageHeader,
            sections.richTextSection,
            sections.richTextSections,
            sections.iconListSection,
            sections.accordionSection,
            sections.cards,
            sections.gallery,
          ],
        },
      },
      {
        section: sections.carouselSection,
        title: "Related Case Studies",

        sources: [
          {
            collection: "caseStudies",
          },
        ],
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],

    files: [
      {
        slug: "weed-cutting",
        title: "Weed Cutting",
      },
      {
        slug: "bulrush-removal",
        title: "Bulrush Removal",
      },
      {
        slug: "blanket-weed-removal",
        title: "Blanket Weed Removal",
      },
      {
        slug: "invasive-species-removal",
        title: "Invasive Species Removal",
      },
      {
        slug: "trash-and-debris-removal",
        title: "Trash and Debris Removal",
      },
      {
        slug: "tree-work",
        title: "Tree Work",
      },
      {
        slug: "silt-pumping",
        title: "Silt Pumping",
      },
      {
        slug: "excavation-and-ditching",
        title: "Excavation and Ditching",
      },
      {
        slug: "reed-bed-control",
        title: "Reed Bed Control",
      },
      {
        slug: "water-lily-management",
        title: "Water Lily Management",
      },
    ],
  },

  servicesIndex: {
    label: "Services Index",

    type: "file",

    path: "src/content/pages/servicesIndex.md",

    output: "src/pages/services/index.astro",

    layout: "ServicesIndexLayout",

    schema: "collection",

    sections: [
      {
        section: sections.hero,
        title: "Hero",
      },
      {
        section: sections.cards,
        title: "Services",
        sources: [
          {
            collection: "services",
          },
        ],
      },
      {
        section: sections.carouselSection,
        title: "Site Specific",
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },

  weedIdentificationGuide: {
    label: "Weed Identification Guide",

    type: "file",
    path: "src/content/pages/weed-identification-guide.md",

    layout: "WeedIdentificationLayout",
    schema: "webPage",

    sections: [
      {
        section: sections.hero,
        title: "Hero",
      },
      {
        section: sections.cards,
        title: "Guide",
      },
      {
        section: sections.cards,
        title: "Margins",
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },

  truxor: {
    label: "Truxor",

    type: "file",
    path: "src/content/pages/truxor.md",

    layout: "TruxorLayout",
    schema: "webPage",

    sections: [
      {
        section: sections.hero,
        title: "Hero",
      },
      {
        section: sections.richTextSection,
        title: "Truxor Expertise",
      },
      {
        section: sections.iconListSection,
        title: "Capabilities",
      },
      {
        section: sections.richTextSection,
        title: "Aquaclear and Truxor",
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
    folder: "src/content/case-studies",

    layout: "CaseStudyLayout",
    schema: "article",

    slug: "field",
    create: true,

    sections: [
      {
        section: sections.metadata,
        title: "Metadata",
      },
      {
        section: sections.richTextSections,
        title: "Overview",
      },
    ],

    files: [
      {
        title: "Canal and River Trust Wales",
        slug: "canal-and-river-trust-wales",
      },
    ],
  },

  caseStudiesIndex: {
    label: "Case Studies Index",

    type: "file",

    path: "src/content/pages/caseStudiesIndex.md",

    output: "src/pages/case-studies/index.astro",

    layout: "CSIndexLayout",

    schema: "collection",

    sections: [
      {
        section: sections.hero,
        title: "Hero",
      },
      {
        section: sections.cards,
        title: "Case Studies",
        sources: [
          {
            collection: "caseStudies",
          },
        ],
      },
    ],
  },

  clients: {
    label: "Clients",

    type: "file",
    path: "src/content/pages/clients.md",

    layout: "ClientsLayout",
    schema: "webPage",

    sections: [
      {
        section: sections.hero,
        title: "Hero",
      },
      {
        section: sections.iconListSection,
        title: "Trusted By",
      },
      {
        section: sections.carouselSection,
        title: "Testimonials",
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },

  contact: {
    label: "Contact",

    type: "file",
    path: "src/content/pages/contact.md",

    layout: "ContactLayout",
    schema: "contact",

    sections: [
      {
        section: sections.contactForm,
        title: "Get In Touch",
      },
      {
        section: sections.cta,
        title: "Call To Action",
      },
    ],
  },
});
