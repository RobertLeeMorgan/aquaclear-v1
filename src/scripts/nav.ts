function initNav() {
  const btn = document.getElementById("menuBtn") as HTMLButtonElement | null;
  const menu = document.getElementById("mobileMenu") as HTMLDivElement | null;

  const menuIcon = document.getElementById("menuIcon") as SVGElement | null;
  const closeIcon = document.getElementById("closeIcon") as SVGElement | null;

  function openMenu() {
    if (!btn || !menu || !menuIcon || !closeIcon) return;

    menu.classList.remove("opacity-0", "-translate-y-6", "pointer-events-none");
    document.body.classList.add("overflow-hidden");

    menuIcon.classList.add("hidden");
    closeIcon.classList.remove("hidden");

    btn.setAttribute("aria-label", "Close menu");
  }

  function closeMenu() {
    if (!btn || !menu || !menuIcon || !closeIcon) return;

    menu.classList.add("opacity-0", "-translate-y-6", "pointer-events-none");
    document.body.classList.remove("overflow-hidden");

    closeIcon.classList.add("hidden");
    menuIcon.classList.remove("hidden");

    btn.setAttribute("aria-label", "Open menu");
  }

  if (!btn || !menu || !menuIcon || !closeIcon) return;

  btn.replaceWith(btn.cloneNode(true));
  const newBtn = document.getElementById("menuBtn") as HTMLButtonElement;
  const newMenuIcon = document.getElementById("menuIcon") as unknown as SVGElement;
  const newCloseIcon = document.getElementById("closeIcon") as unknown as SVGElement;

  newBtn.addEventListener("click", () => {
    if (menu.classList.contains("pointer-events-none")) {
      menu.classList.remove("opacity-0", "-translate-y-6", "pointer-events-none");
      document.body.classList.add("overflow-hidden");

      newMenuIcon.classList.add("hidden");
      newCloseIcon.classList.remove("hidden");

      newBtn.setAttribute("aria-label", "Close menu");
    } else {
      menu.classList.add("opacity-0", "-translate-y-6", "pointer-events-none");
      document.body.classList.remove("overflow-hidden");

      newCloseIcon.classList.add("hidden");
      newMenuIcon.classList.remove("hidden");

      newBtn.setAttribute("aria-label", "Open menu");
    }
  });

  document.querySelectorAll<HTMLButtonElement>(".mobile-toggle").forEach((button) => {
    button.replaceWith(button.cloneNode(true));
  });

  document.querySelectorAll<HTMLButtonElement>(".mobile-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.target;
      if (!id) return;

      const submenu = document.getElementById(id);
      submenu?.classList.toggle("hidden");

      button.querySelector("svg")?.classList.toggle("rotate-180");
      button.querySelector("span")?.classList.toggle("text-primary");
    });
  });

  menu.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

document.addEventListener("astro:page-load", initNav);