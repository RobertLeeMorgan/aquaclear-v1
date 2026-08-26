function initBeforeAfter() {
  document.querySelectorAll<HTMLElement>(".before-after").forEach((container) => {
    let dragging = false;

    function update(clientX: number) {
      const rect = container.getBoundingClientRect();

      const percent = Math.min(
        Math.max(((clientX - rect.left) / rect.width) * 100, 0),
        100,
      );

      container.style.setProperty("--position", `${percent}%`);
    }

    function pointerDown(event: PointerEvent) {
        dragging = true;

        container.classList.add("dragging");

        container.setPointerCapture(event.pointerId);

        update(event.clientX);
    }

    function pointerUp(event: PointerEvent) {
        dragging = false;

        container.classList.remove("dragging");

        container.releasePointerCapture(event.pointerId);
    }

    function pointerMove(event: PointerEvent) {
      if (!dragging) return;

      update(event.clientX);
    }

    container.addEventListener("pointerdown", pointerDown);
    container.addEventListener("pointermove", pointerMove);
    container.addEventListener("pointerup", pointerUp);
    container.addEventListener("pointerleave", pointerUp);
  });
}

initBeforeAfter();

document.addEventListener("astro:page-load", initBeforeAfter);