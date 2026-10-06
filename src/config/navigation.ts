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
    label: "Projects",
    href: "/case-studies",
  },
  { page: "gallery", label: "Gallery", href: "/gallery" },
  { page: "clients", label: "Clients", href: "/clients" },
  { page: "truxor", label: "Truxor", href: "/truxor" },
] as const;
