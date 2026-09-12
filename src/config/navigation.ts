export const navigation = [
  { page: "about", label: "About", href: "/about" },
  {
    page: "services",
    label: "Services",
    href: "/services",
    children: "collection",
  },
  {
    page: "caseStudies",
    label: "Case Studies",
    href: "/case-studies",
    filters: [
      { label: "Aquatic Weed & Vegetation", filter: "weed" },
      { label: "Reed Beds & Bulrush", filter: "reed" },
      { label: "Silt & Sediment", filter: "silt" },
      { label: "Excavation & Habitat", filter: "excavation" },
    ],
  },
  { page: "clients", label: "Clients", href: "/clients" },
  { page: "truxor", label: "Truxor", href: "/truxor" },
] as const;
