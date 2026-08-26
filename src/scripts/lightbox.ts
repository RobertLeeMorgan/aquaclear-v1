interface LightboxState {
  images: HTMLImageElement[];
  index: number;
}

const state: LightboxState = {
  images: [],
  index: 0,
};

const lightboxImage = document.querySelector<HTMLImageElement>(".lightbox-image");
const lightboxCounter = document.querySelector<HTMLElement>(".lightbox-counter");
const lightboxPrevious = document.querySelector<HTMLElement>(".lightbox-prev");
const lightboxNext = document.querySelector<HTMLElement>(".lightbox-next");

if (
  !lightboxImage ||
  !lightboxCounter ||
  !lightboxPrevious ||
  !lightboxNext
) {
  throw new Error("Lightbox elements not found.");
}

const image = lightboxImage;
const counter = lightboxCounter;
const previous = lightboxPrevious;
const next = lightboxNext;

function getLargestSrc(image: HTMLImageElement) {
  const srcset = image.srcset;

  if (!srcset) {
    return image.src;
  }

  const largest = srcset
    .split(",")
    .map((entry) => {
      const [url, width] = entry.trim().split(" ");

      return {
        url,
        width: parseInt(width.replace("w", ""), 10),
      };
    })
    .sort((a, b) => b.width - a.width)[0];

  return largest?.url ?? image.src;
}

function render() {
  const current = state.images[state.index];

  if (!current) return;

  image.classList.add("lightbox-image-changing");

  window.setTimeout(() => {
    image.src = getLargestSrc(current);
    image.alt = current.alt;

    counter.textContent = `${state.index + 1} / ${state.images.length}`;

    image.classList.remove("lightbox-image-changing");
  }, 120);
}

function open(images: HTMLImageElement[], index: number) {
  state.images = images;
  state.index = index;

  render();

  window.modal.open("lightbox");
}

function nextImage() {
  if (state.images.length <= 1) return;
    
  state.index = (state.index + 1) % state.images.length;

  render();
}

function previousImage() {
  if (state.images.length <= 1) return;

  state.index =
    (state.index - 1 + state.images.length) %
    state.images.length;

  render();
}

previous.addEventListener("click", previousImage);

next.addEventListener("click", nextImage);

document.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement)
    .closest<HTMLImageElement>("img[data-gallery]");

  if (!target) return;

  const gallery = target.dataset.gallery;

  if (!gallery) return;

  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>(
      `img[data-gallery="${gallery}"]`
    )
  );

  const index = images.indexOf(target);

  if (index === -1) return;

  open(images, index);
});

function show(index: number) {
  const current = state.images[index];
  if (!current) return;

  image.classList.add("lightbox-image-changing");

  window.setTimeout(() => {
    state.index = index;

    image.src = current.dataset.full ?? current.currentSrc;
    image.alt = current.alt;

    counter.textContent = `${index + 1} / ${state.images.length}`;

    image.classList.remove("lightbox-image-changing");
  }, 120);
}

const lightboxModal = document.getElementById("lightbox");

lightboxModal?.addEventListener("modal:close", () => {
  image.src = "";
  image.alt = "";

  state.images = [];
  state.index = 0;

  counter.textContent = "";
});