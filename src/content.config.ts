import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const iconEnumSchema = z.enum(["leaf","gauge","wrench","cpu","link","shield","waves","truck","zap","cog","fuel","settings","hardHat","scissors","package","pickaxe","anchor","sprout","layers","map","ship","check","badgeCheck","tractor","crown","shipWheel","bird","building2","fish","treePine","trees","flag","shovel","recycle","trophy","move","forklift","medal","wavesLadder","landmark","landPlot","shieldCheck","merge","chevronsUp"]);

const responsiveProfileSchema = z.enum(["large","medium","small","thumbnail"]);

const serviceEnumSchema = z.enum(["weed-cutting","bulrush-removal","invasive-species-removal","blanket-weed-removal","water-lily-management","reed-bed-management","trash-and-debris-removal","tree-work","silt-pumping","excavation-and-ditching"]);

const imageItemSchema = (image: () => any) =>
  z.object({
    src: image(),
    alt: z.string(),
  });

const buttonSchema = (image: () => any) =>
  z.object({
    title: z.string(),
    href: z.string().optional(),
  });

const richTextSchema = (image: () => any) =>
  z.object({
    title: z.string(),
    content: z.string(),
    media: mediaSchema(image).optional(),
    buttons: z.array(buttonSchema(image)).optional(),
  });

const cardSchema = (image: () => any) =>
  z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    image: image().optional(),
    href: z.string().optional(),
  });

const testimonialSchema = (image: () => any) =>
  z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    company: z.string().optional(),
    avatar: image().optional(),
    rating: z.number().optional(),
  });

const carouselSchema = (image: () => any) =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("card"),
      card: z.array(cardSchema(image)),
    }),
    z.object({
      type: z.literal("image"),
      image: z.array(imageItemSchema(image)),
    }),
    z.object({
      type: z.literal("video"),
      video: z.array(videoSchema(image)),
    }),
    z.object({
      type: z.literal("testimonial"),
      testimonial: z.array(testimonialSchema(image)),
    }),
  ]);

const iconSchema = (image: () => any) =>
  z.object({
    icon: iconEnumSchema,
    title: z.string(),
  });

const accordionGroupSchema = (image: () => any) =>
  z.object({
    title: z.string().optional(),
    items: z.array(accordionItemSchema(image)),
  });

const accordionItemSchema = (image: () => any) =>
  z.object({
    title: z.string(),
    blocks: z.array(accordionBlockSchema(image)),
  });

const accordionBlockSchema = (image: () => any) =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("text"),
      heading: z.string().optional(),
      content: z.string(),
      media: mediaSchema(image).optional(),
    }),
    z.object({
      type: z.literal("media"),
      heading: z.string().optional(),
      media: mediaSchema(image),
    }),
    z.object({
      type: z.literal("icons"),
      heading: z.string().optional(),
      items: z.array(iconSchema(image)),
    }),
  ]);

const stickyGroupSchema = (image: () => any) =>
  z.object({
    title: z.string(),
    items: z.array(stickyCardSchema(image)),
  });

const stickyCardSchema = (image: () => any) =>
  z.object({
    title: z.string(),
    description: z.string().optional(),
  });

const keyFeatureSchema = (image: () => any) =>
  z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string().optional(),
  });

const splitContentItemSchema = (image: () => any) =>
  z.object({
    title: z.string(),
    description: z.string(),
  });

const mediaSchema = (image: () => any) =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("image"),
      src: image(),
      alt: z.string(),
    }),
    z.object({
      type: z.literal("video"),
      video: videoSchema(image),
    }),
    z.object({
      type: z.literal("beforeAfter"),
      before: image(),
      after: image(),
      beforeAlt: z.string(),
      afterAlt: z.string(),
    }),
  ]);

const videoSchema = (image: () => any) =>
  z.discriminatedUnion("provider", [
    z.object({
      provider: z.literal("youtube"),
      id: z.string(),
      title: z.string().optional(),
    }),
    z.object({
      provider: z.literal("vimeo"),
      id: z.string(),
      title: z.string().optional(),
    }),
    z.object({
      provider: z.literal("html"),
      src: z.string(),
      title: z.string().optional(),
    }),
  ]);

const bannerItemSchema = (image: () => any) =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("logo"),
      image: image(),
      alt: z.string(),
      href: z.string().optional(),
    }),
    z.object({
      type: z.literal("text"),
      text: z.string(),
      href: z.string().optional(),
    }),
  ]);

const home = defineCollection({
  loader: glob({ pattern: "index.md", base: "./src/content/pages" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      hero: z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image(),
      alt: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      introduction: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string(),
      media: mediaSchema(image).optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      whyChooseUs: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      media: mediaSchema(image),
      alt: z.string().optional(),
      items: z.array(iconSchema(image)),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      featuredProject: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string(),
      media: mediaSchema(image).optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      callToAction: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
    }),
});

const about = defineCollection({
  loader: glob({ pattern: "about.md", base: "./src/content/pages" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      hero: z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image(),
      alt: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      aboutAquaclear: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string(),
      media: mediaSchema(image).optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      experienceAndExpertise: z.object({
      items: z.array(keyFeatureSchema(image)),
    }),
      truxor: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      media: mediaSchema(image),
      alt: z.string().optional(),
      items: z.array(iconSchema(image)),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      howWeWork: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string(),
      media: mediaSchema(image).optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      callToAction: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      overview: z.array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("hero"),
          title: z.string(),
          description: z.string().optional(),
          image: image(),
          alt: z.string().optional(),
          buttons: z.array(buttonSchema(image)).optional(),
        }),
        z.object({
          type: z.literal("pageHeader"),
          eyebrow: z.string().optional(),
          title: z.string(),
          description: z.string().optional(),
        }),
        z.object({
          type: z.literal("richTextSection"),
          eyebrow: z.string().optional(),
          title: z.string(),
          content: z.string(),
          media: mediaSchema(image).optional(),
          buttons: z.array(buttonSchema(image)).optional(),
        }),
        z.object({
          type: z.literal("richTextSections"),
          eyebrow: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          items: z.array(richTextSchema(image)),
        }),
        z.object({
          type: z.literal("iconListSection"),
          eyebrow: z.string().optional(),
          title: z.string(),
          description: z.string().optional(),
          media: mediaSchema(image),
          alt: z.string().optional(),
          items: z.array(iconSchema(image)),
          buttons: z.array(buttonSchema(image)).optional(),
        }),
        z.object({
          type: z.literal("accordionSection"),
          eyebrow: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          groups: z.array(accordionGroupSchema(image)),
        }),
        z.object({
          type: z.literal("cards"),
          eyebrow: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          items: z.array(cardSchema(image)),
        }),
        z.object({
          type: z.literal("gallery"),
          eyebrow: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          items: z.array(mediaSchema(image)),
        }),
      ])
    ),
      callToAction: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
    }),
});

const servicesIndex = defineCollection({
  loader: glob({ pattern: "servicesIndex.md", base: "./src/content/pages" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      hero: z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image(),
      alt: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      siteSpecific: z.object({
      eyebrow: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      items: carouselSchema(image),
    }),
      callToAction: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
    }),
});

const weedIdentificationGuide = defineCollection({
  loader: glob({ pattern: "weed-identification-guide.md", base: "./src/content/pages" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      hero: z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image(),
      alt: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      guide: z.object({
      eyebrow: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      items: z.array(cardSchema(image)),
    }),
      margins: z.object({
      eyebrow: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      items: z.array(cardSchema(image)),
    }),
      callToAction: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
    }),
});

const truxor = defineCollection({
  loader: glob({ pattern: "truxor.md", base: "./src/content/pages" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      hero: z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image(),
      alt: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      truxorExpertise: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string(),
      media: mediaSchema(image).optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      capabilities: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      media: mediaSchema(image),
      alt: z.string().optional(),
      items: z.array(iconSchema(image)),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      aquaclearAndTruxor: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      content: z.string(),
      media: mediaSchema(image).optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      callToAction: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
    }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      metadata: z.object({
      title: z.string(),
      client: z.string(),
      location: z.string(),
      date: z.string(),
      services: z.array(serviceEnumSchema),
      summary: z.string(),
    }),
      overview: z.object({
      eyebrow: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      items: z.array(richTextSchema(image)),
    }),
    }),
});

const caseStudiesIndex = defineCollection({
  loader: glob({ pattern: "caseStudiesIndex.md", base: "./src/content/pages" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      hero: z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image(),
      alt: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
    }),
});

const clients = defineCollection({
  loader: glob({ pattern: "clients.md", base: "./src/content/pages" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      hero: z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image(),
      alt: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      trustedBy: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      media: mediaSchema(image),
      alt: z.string().optional(),
      items: z.array(iconSchema(image)),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
      testimonials: z.object({
      eyebrow: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      items: carouselSchema(image),
    }),
      callToAction: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
    }),
});

const contact = defineCollection({
  loader: glob({ pattern: "contact.md", base: "./src/content/pages" }),

  schema: ({ image }) =>
    z.object({
      seo: z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
    }),
      getInTouch: z.object({
      eyebrow: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
    }),
      callToAction: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      buttons: z.array(buttonSchema(image)).optional(),
    }),
    }),
});

export const collections = {
  home,
  about,
  services,
  servicesIndex,
  weedIdentificationGuide,
  truxor,
  caseStudies,
  caseStudiesIndex,
  clients,
  contact,
};