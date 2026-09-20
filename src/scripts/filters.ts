type ServiceFilter = "all" | "weed" | "reed" | "silt" | "excavation";

type SiteFilter =
  | "all"
  | "nature-reserves-sssi"
  | "castles-heritage-sites"
  | "canals-rivers"
  | "fisheries"
  | "suds-reservoirs"
  | "golf-courses"
  | "leisure-waterways-marinas"
  | "public-private-lakes-ponds";

const serviceGroups: Record<
  Exclude<ServiceFilter, "all">,
  string[]
> = {
  weed: [
    "weed-cutting",
    "water-lily-management",
    "algae-removal",
    "invasive-species-removal",
  ],
  reed: [
    "reed-bed-management",
    "bulrush-removal",
  ],
  silt: [
    "silt-pumping",
  ],
  excavation: [
    "excavation-and-ditching",
    "tree-work",
  ],
};

const siteFilters: Exclude<SiteFilter, "all">[] = [
  "nature-reserves-sssi",
  "castles-heritage-sites",
  "canals-rivers",
  "fisheries",
  "suds-reservoirs",
  "golf-courses",
  "leisure-waterways-marinas",
  "public-private-lakes-ponds",
];

interface FilterOptions {
  filterNav: string;
  itemSelector: string;
  serviceAttribute?: string;
  siteAttribute?: string;
}

const setActiveButtons = (
  buttons: HTMLElement[],
  filter: string,
  attribute: "serviceFilter" | "siteFilter",
) => {
  buttons.forEach((button) => {
    const active = button.dataset[attribute] === filter;

    button.classList.toggle("bg-dark", active);
    button.classList.toggle("text-white", active);
    button.classList.toggle("bg-dark/5", !active);
    button.classList.toggle("text-dark", !active);
    button.classList.toggle("hover:bg-dark/10", !active);
  });
};

const initFilters = ({
  filterNav,
  itemSelector,
  serviceAttribute = "services",
  siteAttribute = "sites",
}: FilterOptions) => {
  const nav = document.querySelector(filterNav);

  if (!nav) {
    return;
  }

  const items = Array.from(
    document.querySelectorAll(itemSelector),
  ) as HTMLElement[];

  const serviceButtons = Array.from(
    nav.querySelectorAll("[data-service-filter]"),
  ) as HTMLElement[];

  const siteButtons = Array.from(
    nav.querySelectorAll("[data-site-filter]"),
  ) as HTMLElement[];

  const getFiltersFromUrl = () => {
    const params = new URLSearchParams(window.location.search);

    const service = params.get("service");
    const site = params.get("site");

    const serviceFilter: ServiceFilter =
      service &&
      (service === "all" ||
        Object.prototype.hasOwnProperty.call(serviceGroups, service))
        ? (service as ServiceFilter)
        : "all";

    const siteFilter: SiteFilter =
      site &&
      (site === "all" || siteFilters.includes(site as Exclude<SiteFilter, "all">))
        ? (site as SiteFilter)
        : "all";

    return {
      serviceFilter,
      siteFilter,
    };
  };

  const applyFilters = (
    serviceFilter: ServiceFilter,
    siteFilter: SiteFilter,
  ) => {
    items.forEach((item) => {
      const services = JSON.parse(
        item.dataset[serviceAttribute] || "[]",
      ) as string[];

      const sites = JSON.parse(
        item.dataset[siteAttribute] || "[]",
      ) as string[];

      const activeServices =
        serviceFilter !== "all"
          ? serviceGroups[serviceFilter]
          : undefined;

      const serviceMatch =
        serviceFilter === "all" ||
        activeServices?.some((service) =>
          services.includes(service),
        );

      const siteMatch =
        siteFilter === "all" ||
        sites.includes(siteFilter);

      item.style.display =
        serviceMatch && siteMatch ? "" : "none";
    });

    setActiveButtons(
      serviceButtons,
      serviceFilter,
      "serviceFilter",
    );

    setActiveButtons(
      siteButtons,
      siteFilter,
      "siteFilter",
    );

    document.dispatchEvent(
      new CustomEvent("case-study-filters-updated"),
    );
  };

  const updateUrl = (
    serviceFilter: ServiceFilter,
    siteFilter: SiteFilter,
  ) => {
    const url = new URL(window.location.href);

    if (serviceFilter === "all") {
      url.searchParams.delete("service");
    } else {
      url.searchParams.set("service", serviceFilter);
    }

    if (siteFilter === "all") {
      url.searchParams.delete("site");
    } else {
      url.searchParams.set("site", siteFilter);
    }

    window.history.pushState({}, "", url);
  };

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter =
        button.dataset.serviceFilter as ServiceFilter | undefined;

      if (!filter) {
        return;
      }

      const { siteFilter } = getFiltersFromUrl();

      updateUrl(filter, siteFilter);
      applyFilters(filter, siteFilter);
    });
  });

  siteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter =
        button.dataset.siteFilter as SiteFilter | undefined;

      if (!filter) {
        return;
      }

      const { serviceFilter } = getFiltersFromUrl();

      updateUrl(serviceFilter, filter);
      applyFilters(serviceFilter, filter);
    });
  });

  window.addEventListener("popstate", () => {
    const { serviceFilter, siteFilter } =
      getFiltersFromUrl();

    applyFilters(serviceFilter, siteFilter);
  });

  const { serviceFilter, siteFilter } =
    getFiltersFromUrl();

  applyFilters(serviceFilter, siteFilter);
};

export const initCaseStudyFilters = () => {
  initFilters({
    filterNav: '[data-filter-nav="case-study"]',
    itemSelector: "[data-case-study-card]",
  });
};

export const initGalleryFilters = () => {
  initFilters({
    filterNav: '[data-filter-nav="gallery"]',
    itemSelector: "[data-gallery-item]",
  });
};