function initBanners() {
  const banners = document.querySelectorAll<HTMLElement>("[data-banner]");

  banners.forEach((banner) => {
    const viewport = banner.querySelector<HTMLElement>(
      "[data-banner-viewport]",
    );

    if (!viewport) return;

    const pause = () => {
      viewport.classList.add("is-paused");
    };

    const resume = () => {
      viewport.classList.remove("is-paused");
    };

    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", resume);

    viewport.addEventListener("focusin", pause);
    viewport.addEventListener("focusout", resume);
  });
}

initBanners();

document.addEventListener("astro:page-load", initBanners);
