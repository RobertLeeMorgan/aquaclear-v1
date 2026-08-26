export const types = {
  string: {
    zod: "z.string()",
    decap: {
      widget: "string",
    },
  },

  markdown: {
    zod: "z.string()",
    decap: {
      widget: "markdown",
    },
  },

  text: {
    zod: "z.string()",
    decap: {
      widget: "text",
    },
  },

  number: {
    zod: "z.number()",
    decap: {
      widget: "number",
    },
  },

  boolean: {
    zod: "z.boolean()",
    decap: {
      widget: "boolean",
    },
  },

  date: {
    zod: "z.coerce.date()",
    decap: {
      widget: "datetime",
      time_format: false,
    },
  },

  image: {
    zod: "image()",
    decap: {
      widget: "image",
    },
  },

  imageItem: {
    fields: {
      src: "image",
      alt: "string",
    },
  },

  button: {
    fields: {
      title: "string",
      href: "string?",
    },
  },

  card: {
    fields: {
      eyebrow: "string?",
      title: "string",
      description: "markdown?",
      image: "image?",
      href: "string?",
    },
  },

  testimonial: {
    fields: {
      quote: "markdown",
      author: "string",
      role: "string?",
      company: "string?",
      avatar: "image?",
      rating: "number?",
    },
  },

  carousel: {
    discriminator: "type",

    options: [
      {
        key: "card",
        fields: {
          card: "card[]",
        },
      },
      {
        key: "image",
        fields: {
          image: "imageItem[]",
        },
      },
      {
        key: "video",
        fields: {
          video: "video[]",
        },
      },
      {
        key: "testimonial",
        fields: {
          testimonial: "testimonial[]",
        },
      },
    ],
  },

  icon: {
    fields: {
      icon: "iconEnum",
      title: "string",
    },
  },

  accordionGroup: {
    fields: {
      title: "string?",
      items: "accordionItem[]",
    },
  },

  accordionItem: {
    fields: {
      title: "string",
      blocks: "accordionBlock[]",
    },
  },

  accordionBlock: {
    discriminator: "type",

    options: [
      {
        key: "text",

        fields: {
          heading: "string?",
          content: "markdown",
          media: "media?",
        },
      },
      {
        key: "media",
        fields: {
          heading: "string?",
          media: "media",
        },
      },
      {
        key: "icons",

        fields: {
          heading: "string?",
          items: "icon[]",
        },
      },
    ],
  },

  stickyGroup: {
    fields: {
      title: "string",
      items: "stickyCard[]",
    },
  },

  stickyCard: {
    fields: {
      title: "string",
      description: "markdown?",
    },
  },

  keyFeature: {
    fields: {
      icon: "string",
      title: "string",
      description: "markdown?",
    },
  },

  splitContentItem: {
    fields: {
      title: "string",
      description: "markdown",
    },
  },

  media: {
    discriminator: "type",

    options: [
      {
        key: "image",

        fields: {
          src: "image",
          alt: "string",
        },
      },

      {
        key: "video",

        fields: {
          video: "video",
        },
      },

      {
        key: "beforeAfter",

        fields: {
          before: "image",
          after: "image",
          beforeAlt: "string",
          afterAlt: "string",
        },
      },
    ],
  },

  video: {
    discriminator: "provider",

    options: [
      {
        key: "youtube",

        fields: {
          id: "string",
          title: "string?",
        },
      },

      {
        key: "vimeo",

        fields: {
          id: "string",
          title: "string?",
        },
      },

      {
        key: "html",

        fields: {
          src: "string",
          title: "string?",
        },
      },
    ],
  },

  bannerItem: {
    discriminator: "type",

    options: [
      {
        key: "logo",
        fields: {
          image: "image",
          alt: "string",
          href: "string?",
        },
      },
      {
        key: "text",
        fields: {
          text: "string",
          href: "string?",
        },
      },
    ],
  },
} as const;
