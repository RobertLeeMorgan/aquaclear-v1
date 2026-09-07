console.log("contact script loaded");

const form = document.querySelector<HTMLFormElement>(".contact-form");
if (!form) throw new Error("Form not found");

const button = form.querySelector<HTMLButtonElement>("button");
const text = button?.querySelector<HTMLSpanElement>(".btn-text");
const spinner = button?.querySelector<SVGElement>("svg");

if (!button || !text || !spinner) {
  throw new Error("Button elements missing");
}

const ui = { button, text, spinner };

const errorBox = document.createElement("p");
errorBox.className = "text-red-600 text-sm";
form.appendChild(errorBox);

const successBox = document.createElement("p");
successBox.className = "text-green-600 text-sm";
form.appendChild(successBox);

function setLoading(isLoading: boolean) {
  ui.button.disabled = isLoading;

  if (isLoading) {
    ui.text.textContent = "Sending...";
    ui.spinner.classList.remove("hidden");
  } else {
    ui.text.textContent = "Send Message";
    ui.spinner.classList.add("hidden");
  }
}

form.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();

  errorBox.textContent = "";
  successBox.textContent = "";

  setLoading(true);

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
    });

    const data: { ok: boolean; error?: string } = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    successBox.textContent = "Thanks for your message. We'll get back to you shortly.";
    form.reset();

  } catch (err: unknown) {
    errorBox.textContent =
      err instanceof Error ? err.message : "Unknown error";
  } finally {
    setLoading(false);
  }
});