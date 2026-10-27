// Menu mobile
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const mobileMenu = window.matchMedia("(max-width: 1000px)");

if (menuBtn && nav) {
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };
  menuBtn.setAttribute("aria-controls", "nav");
  menuBtn.setAttribute("type", "button");
  setMenu(false);
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !menuBtn.contains(event.target)) setMenu(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  mobileMenu.addEventListener("change", () => {
    if (!mobileMenu.matches && nav.contains(document.activeElement)) menuBtn.blur();
    setMenu(false);
  });
}

// Année
document.getElementById("year").textContent = new Date().getFullYear();

// Animation timeline au scroll
const timeline = document.querySelector(".timeline");

const timelineObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add("active");
        timelineObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

if (timeline) {
  timelineObserver.observe(timeline);
}

// Formulaire AJAX Formspree
const form = document.querySelector(".form");

if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const button = form.querySelector("button[type='submit']");
    const originalText = button.textContent;

    button.textContent = "Envoi…";
    button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        form.reset();
        button.textContent = "Message envoyé ✓";

        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 3000);
      } else {
        throw new Error("Erreur");
      }
    } catch {
      button.textContent = "Erreur, réessayez";
      button.disabled = false;
    }
  });
}

// Compteur temps récupéré
const gainValue = document.getElementById("gainValue");

if (gainValue) {
  const target = 6; // heures illustratives
  let current = 0;

  const gainObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const interval = setInterval(() => {
          current += 0.2;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          gainValue.textContent = current.toFixed(1) + " h";
        }, 40);

        gainObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  gainObserver.observe(gainValue);
}
// Exemples : filtres et agrandissement
(() => {
  const section = document.getElementById("demos");
  if (!section) return;
  const filters = section.querySelector(".example-filters");
  const buttons = [...section.querySelectorAll(".example-filter")];
  const panels = [...section.querySelectorAll(".example-panel")];
  const select = (id) => {
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.example === id)));
    panels.forEach(panel => { panel.hidden = panel.id !== `example-${id}`; });
  };
  if (filters && buttons.length) {
    filters.hidden = false;
    buttons.forEach(button => button.addEventListener("click", () => select(button.dataset.example)));
    select(buttons[0].dataset.example);
  }
  const dialog = document.querySelector(".image-dialog");
  let trigger = null;
  if (dialog) {
    dialog.querySelector(".image-dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => { if (trigger) trigger.focus(); });
  }
  section.querySelectorAll(".example-image-button").forEach(button => {
    const img = button.querySelector("img");
    const placeholder = button.querySelector(".example-placeholder");
    const ready = () => {
      if (!img.naturalWidth) return;
      img.hidden = false;
      placeholder.hidden = true;
      button.disabled = false;
    };
    img.addEventListener("load", ready);
    if (img.complete) ready();
    button.addEventListener("click", () => {
      if (!dialog || typeof dialog.showModal !== "function") {
        window.open(img.src, "_blank", "noopener");
        return;
      }
      trigger = button;
      const large = dialog.querySelector("img");
      large.src = img.currentSrc || img.src;
      large.alt = img.alt;
      dialog.querySelector(".image-dialog-caption").textContent = img.alt;
      dialog.showModal();
    });
  });
})();
