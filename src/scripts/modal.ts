class Modal {
  element: HTMLElement;
  content: HTMLElement | null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.content = element.querySelector(".modal-content");

    this.handleEscape = this.handleEscape.bind(this);

    const backdrop = element.querySelector<HTMLElement>(".modal-backdrop");

    backdrop?.addEventListener("click", (event) => {
      if (event.target !== backdrop) return;
      this.close();
    });

    element.querySelectorAll("[data-modal-close-button]").forEach((button) => {
      button.addEventListener("click", () => this.close());
    });
  }

  open() {
    this.element.classList.add("modal-open");
    this.element.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    if (this.element.dataset.closeEscape === "true") {
      document.addEventListener("keydown", this.handleEscape);
    }

    // Force a layout so the browser paints the initial state
    this.element.getBoundingClientRect();

    // Then apply the animated state
    requestAnimationFrame(() => {
      this.element.classList.add("modal-visible");
    });
  }

  close() {
    this.element.classList.remove("modal-visible");

    document.removeEventListener("keydown", this.handleEscape);
    document.body.style.overflow = "";

    window.setTimeout(() => {
      this.element.classList.remove("modal-open");
      this.element.setAttribute("aria-hidden", "true");
      this.element.dispatchEvent(new CustomEvent("modal:close"));
    }, 200);
  }

  handleEscape(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.close();
    }
  }
}

const modals = new Map<string, Modal>();

document.querySelectorAll<HTMLElement>("[data-modal]").forEach((element) => {
  modals.set(element.id, new Modal(element));
});

window.modal = {
  open(id: string) {
    // Close every other modal first
    modals.forEach((modal, key) => {
      if (key !== id) {
        modal.close();
      }
    });

    modals.get(id)?.open();
  },

  close(id: string) {
    modals.get(id)?.close();
  },
};

document.addEventListener("click", (event) => {
  const trigger = (event.target as HTMLElement).closest<HTMLElement>(
    "[data-modal-open]",
  );

  if (!trigger) return;

  const id = trigger.dataset.modalOpen;

  if (!id) return;

  window.modal.open(id);
});
