export const navigation = [
  "home",

  {
    page: "services",
    children: "collection",
  },

  {
    label: "Insights",
    href: "/insights",
    children: ["news", "caseStudies"],
  },

  "featuredInsights",
] as const;