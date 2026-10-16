// Menu mobile
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

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