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
    children: "collection",
  },
  { page: "clients", label: "Clients", href: "/clients" },
  { page: "truxor", label: "Truxor", href: "/truxor" },
] as const;
