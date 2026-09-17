function initBeforeAfter() {
  document.querySelectorAll<HTMLElement>(".before-after").forEach((container) => {
    const handle = container.querySelector<HTMLButtonElement>(
      ".before-after-handle",
    );

    if (!handle) return;

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

      handle?.setPointerCapture(event.pointerId);

      update(event.clientX);
    }

    function pointerUp(event: PointerEvent) {
      if (!dragging) return;

      dragging = false;

      container.classList.remove("dragging");

      if (handle?.hasPointerCapture(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId);
      }
    }

    function pointerMove(event: PointerEvent) {
      if (!dragging) return;

      update(event.clientX);
    }

    handle.addEventListener("pointerdown", pointerDown);
    handle.addEventListener("pointermove", pointerMove);
    handle.addEventListener("pointerup", pointerUp);
    handle.addEventListener("pointerleave", pointerUp);
  });
}

initBeforeAfter();

document.addEventListener("astro:page-load", initBeforeAfter);