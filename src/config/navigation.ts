export const navigation = [
  "about",
  {
    page: "services",
    children: "collection",
  },
  {
    page: "caseStudies",
    children: "collection",
  },
  "clients",
  "truxor",
] as const;