export const initFeaturedCaseStudies = () => {
  const grid = document.querySelector("[data-case-study-grid]");

  if (!grid) {
    return;
  }

  const updateFeatured = () => {
    const cards = Array.from(
      grid.querySelectorAll("[data-case-study-card]"),
    ) as HTMLElement[];

    cards.forEach((card) => {
      const actualCard = card.querySelector(".card");

      actualCard?.classList.remove("featured-card");

      const eyebrow = card.querySelector("[data-card-eyebrow]");

      if (eyebrow) {
        eyebrow.textContent = "";
        eyebrow.classList.add("hidden");
      }
    });

    const eligible = cards.filter(
      (card) =>
        card.dataset.featured === "true" &&
        card.style.display !== "none",
    );

    const selected = [...eligible]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    selected.forEach((card) => {
      const actualCard = card.querySelector(".card");

      grid.prepend(card);
      actualCard?.classList.add("featured-card");

      const eyebrow = card.querySelector("[data-card-eyebrow]");

      if (eyebrow) {
        eyebrow.textContent = "Featured project";
        eyebrow.classList.remove("hidden");
      }
    });
  };

  updateFeatured();

  document.addEventListener("case-study-filters-updated", updateFeatured);
};