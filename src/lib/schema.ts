import { site } from "../config/site";

const sameAs = Object.values(site.social).filter(Boolean);

export function homeSchema({
  name,
  description,
  image,
  url = "/"
}: {
  name: string;
  description: string;
  image?: string;
  url?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    ...(image && {
        primaryImageOfPage: new URL(image, site.url).toString(),
    }),
    ...(url && {
        url: new URL(url, site.url).toString(),
    })
  };
}

export function aboutSchema({
  name,
  description,
  image,
  url = "/about"
}: {
  name: string;
  description: string;
  image?: string;
  url?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name,
    description,
    ...(image && {
        primaryImageOfPage: new URL(image, site.url).toString(),
    }),
    ...(url && {
        url: new URL(url, site.url).toString(),
    })
  };
}

export function contactSchema({
  name,
  description,
  image,
  url = "/contact"
}: {
  name: string;
  description: string;
  image?: string;
  url?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    description,
    ...(url && {
        url: new URL(url, site.url).toString(),
    })
  };
}

export function collectionSchema({
  name,
  description,
  image,
  url
}: {
  name: string;
  description: string;
  image?: string;
  url?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    ...(url && {
      url: new URL(url, site.url).toString(),
    }),
  };
}

export function serviceSchema({
  name,
  description,
  url,
  image
}: {
  name: string;
  description: string;
  url?: string;
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: site.name,
    },
    ...(url && {
      url: new URL(url, site.url).toString(),
    }),
    ...(image && {
        image: new URL(image, site.url).toString(),
    }),
  };
}

export function articleSchema({
  name,
  description,
  image,
  url,
}: {
  name: string;
  description: string;
  image?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: name,
    description,
    ...(image && {
        image: new URL(image, site.url).toString(),
    }),
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
    ...(url && {
      url: new URL(url, site.url).toString(),
    }),
  };
}

export function techarticleSchema({
  name,
  description,
  image,
  url
}: {
  name: string;
  description: string;
  image?: string;
  url?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: name,
    description,
    ...(image && {
        image: new URL(image, site.url).toString(),
    }),
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
    ...(url && {
      url: new URL(url, site.url).toString(),
    }),
  };
}

export function productSchema({
  name,
  description,
  image,
  brand = site.name,
  url
}: {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  url?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    ...(image && {
        image: new URL(image, site.url).toString(),
    }),
    brand: {
      "@type": "Brand",
      name: brand,
    },
    ...(url && {
      url: new URL(url, site.url).toString(),
    }),
  };
}

export function faqSchema(
  items: {
    title: string;
    blocks: {
      type: string;
      text?: string;
    }[];
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ title, blocks }) => ({
      "@type": "Question",
      name: title,
      acceptedAnswer: {
        "@type": "Answer",
        text: blocks.find(block => block.text)?.text ?? "",
      },
    })),
  };
}

export function webPageSchema({
  name,
  description,
  image,
  url
}: {
  name: string;
  description: string;
  image?: string;
  url?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    ...(url && {
        url: new URL(url, site.url).toString(),
    })
  };
}

export function localBusinessSchema({
  type = "LocalBusiness",
  openingHours,
  priceRange,
  geo,
}: {
  type?:
    | "LocalBusiness"
    | "ProfessionalService"
    | "HomeAndConstructionBusiness"
    | "Store";
  openingHours?: string[];
  priceRange?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.svg`,
    email: site.email,
    telephone: site.mobile || site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      addressLocality: site.town,
      postalCode: site.postCode,
      addressCountry: site.countryCode,
    },
    ...(openingHours && { openingHours }),
    ...(priceRange && { priceRange }),
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    ...(sameAs.length && { sameAs }),
  };
}

export function itemListSchema({
  name,
  items,
}: {
  name: string;
  items: {
    name: string;
    url: string;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: new URL(item.url, site.url).toString(),
      name: item.name,
    })),
  };
}

export function siteSchemas() {
  return [
    organizationSchema(),
    websiteSchema(),
  ];
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.svg`,
    email: site.email,
    telephone: site.mobile || site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      addressLocality: site.town,
      postalCode: site.postCode,
      addressCountry: site.countryCode,
    },
    ...(sameAs.length && { sameAs }),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
    inLanguage: site.language
  };
}