function initCarousel() {
  const viewport = document.getElementById("viewport") as HTMLDivElement;
  const track = document.getElementById("track") as HTMLDivElement;
  const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
  const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;

  if (!viewport || !track || !prevBtn || !nextBtn) return;

  function measureButtons() {
    [prevBtn, nextBtn].forEach((button) => {
      button.classList.remove("md:hidden");
      button.style.width = "";
      button.classList.remove("is-collapsing");
    });
  }

  function setButton(
    button: HTMLButtonElement,
    visible: boolean,
    paddingClass: string,
  ) {
    if (visible) {
      if (!button.classList.contains("md:hidden")) return;

      button.classList.remove("md:hidden");
      button.classList.add(paddingClass);
      button.style.width = "0px";
      button.classList.add("is-collapsing");

      void button.offsetWidth;

      const width = button.scrollWidth;

      requestAnimationFrame(() => {
        button.style.width = `${width}px`;
        button.classList.remove("is-collapsing");
      });

      const finish = (event: TransitionEvent) => {
        if (event.propertyName !== "width") return;

        button.style.width = "";
        button.removeEventListener("transitionend", finish);
      };

      button.addEventListener("transitionend", finish);

      return;
    }

    if (button.classList.contains("md:hidden")) return;

    button.style.width = `${button.getBoundingClientRect().width}px`;

    requestAnimationFrame(() => {
      button.classList.add("is-collapsing");
      button.style.width = "0px";
      button.classList.remove(paddingClass);
    });

    const finish = (event: TransitionEvent) => {
      if (event.propertyName !== "width") return;

      button.classList.add("md:hidden");
      button.style.width = "";
      button.removeEventListener("transitionend", finish);
    };

    button.addEventListener("transitionend", finish);
  }

  function updateButtons() {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;

    const atStart = viewport.scrollLeft <= 1;
    const atEnd = viewport.scrollLeft >= maxScroll - 1;

    setButton(prevBtn, !atStart, "carousel-btn-prev");
    setButton(nextBtn, !atEnd, "carousel-btn-next");

    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  }

  function getScrollAmount() {
    const firstItem = track.firstElementChild as HTMLElement | null;

    if (!firstItem) return viewport.clientWidth;

    const gap = parseFloat(
      getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0",
    );

    return firstItem.getBoundingClientRect().width + gap;
  }

  function scroll(direction: 1 | -1) {
    viewport.scrollBy({
      left: getScrollAmount() * direction,
      behavior: "smooth",
    });
  }

  const prev = () => scroll(-1);
  const next = () => scroll(1);

  measureButtons();
  updateButtons();

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  viewport.addEventListener("scroll", updateButtons, { passive: true });

  const handleResize = () => {
    measureButtons();
    updateButtons();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    prevBtn.removeEventListener("click", prev);
    nextBtn.removeEventListener("click", next);
    viewport.removeEventListener("scroll", updateButtons);
    window.removeEventListener("resize", handleResize);
  };
}

let cleanup = initCarousel();

document.addEventListener("astro:page-load", () => {
  cleanup?.();
  cleanup = initCarousel();
});
