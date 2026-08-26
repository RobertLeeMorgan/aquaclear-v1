export const sections = {
  hero: {
    key: "hero",

    fields: {
      title: "string",
      description: "markdown?",
      image: "image",
      alt: "string?",
      buttons: "button[]?",
    },
  },

  richTextSection: {
    key: "richTextSection",

    fields: {
      eyebrow: "string?",
      title: "string",
      content: "markdown",
      media: "media?",
    },
  },

  contactForm: {
    key: "contactForm",

    fields: {
      eyebrow: "string?",
      title: "string?",
      description: "markdown?",
    },
  },

  cards: {
    key: "cards",

    fields: {
      eyebrow: "string?",
      title: "string?",
      description: "markdown?",
      items: "card[]",
    },
  },

  carouselSection: {
    key: "carouselSection",

    fields: {
      eyebrow: "string?",
      title: "string?",
      description: "markdown?",
      carousel: "carousel",
    },
  },

  iconListSection: {
    key: "iconListSection",

    fields: {
      eyebrow: "string?",
      title: "string",
      description: "markdown?",
      media: "media",
      alt: "string?",
      items: "icon[]",
      buttons: "button[]?",
    },
  },

  accordionSection: {
    key: "accordionSection",

    fields: {
      eyebrow: "string?",
      title: "string?",
      description: "markdown?",
      groups: "accordionGroup[]",
    },
  },

  mediaSection: {
    key: "mediaSection",

    fields: {
      eyebrow: "string?",
      title: "string?",
      description: "markdown?",
      media: "media",
    },
  },

  gallery: {
    key: "gallery",

    fields: {
      eyebrow: "string?",
      title: "string?",
      description: "markdown?",
      items: "media[]",
    },
  },

  cta: {
    key: "cta",

    fields: {
      eyebrow: "string?",
      title: "string",
      description: "markdown?",
      buttons: "button[]?",
    },
  },

  stickyList: {
    key: "stickyList",

    fields: {
      eyebrow: "string?",
      title: "string",
      description: "markdown?",
      groups: "stickyGroup[]",
      buttons: "button[]?",
    },
  },

  keyFeatures: {
    key: "keyFeatures",

    fields: {
      items: "keyFeature[]",
    },
  },

  splitContent: {
    key: "splitContent",

    fields: {
      eyebrow: "string?",
      title: "string?",
      description: "markdown?",
      items: "splitContentItem[]",
    },
  },

  banner: {
    key: "banner",
    
    fields: {
      items: "bannerItem[]",
    },
  },

  content: {
    key: "content",

    fields: [],
  },
} as const;
