document.querySelectorAll<HTMLElement>("[data-accordion]").forEach((accordion) => {
  if (accordion.dataset.initialised) return;
  accordion.dataset.initialised = "true";

  const single = accordion.dataset.single === "true";

  accordion.addEventListener("click", (event) => {
    const trigger = (event.target as HTMLElement).closest(".accordion-trigger");

    if (!trigger) return;

    const item = trigger.closest(".accordion-item") as HTMLElement;
    const open = item.classList.contains("is-open");

    if (single) {
      accordion
        .querySelectorAll<HTMLElement>(".accordion-item")
        .forEach((el) => el.classList.remove("is-open"));

      if (!open) {
        item.classList.add("is-open");
      }
    } else {
      item.classList.toggle("is-open");
    }
  });
});