document.addEventListener("DOMContentLoaded", () => {
  const switcherBtn = document.querySelector(".switcher__btn");
  const lightIcon = document.querySelector(".switcher__icon-light");
  const darkIcon = document.querySelector(".switcher__icon-dark");

  const DARK_ID = "dark-theme";
  const DARK_HREF = "./assets/css/dark.css";

  const ensureDarkLink = () => {
    let link = document.getElementById(DARK_ID);
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = DARK_HREF;
      link.id = DARK_ID;
      document.head.appendChild(link);
    }
  };
  const removeDarkLink = () => {
    const link = document.getElementById(DARK_ID);
    if (link) link.remove();
  };

  const swapLogos = (theme /* "light" | "dark" */) => {
    const pics = document.querySelectorAll("picture.js-theme-logo");
    pics.forEach((pic) => {
      const webp = pic.querySelector('source[type="image/webp"]');
      const img = pic.querySelector("img");
      const w = pic.dataset[`${theme}Webp`];
      const p = pic.dataset[`${theme}Png`];
      if (webp && w) webp.srcset = w;
      if (img && p) img.src = p; // fallback
      if (img) {
        const current = img.currentSrc;
        img.src = p;
        if (current !== img.currentSrc) {
          img.src = p; // segunda asignación asegura repaint
        }
      }
    });
  };

  /** Actualiza UI del botón e íconos */
  const setUIForTheme = (isDark) => {
    switcherBtn.setAttribute("aria-pressed", String(isDark));
    lightIcon.style.display = isDark ? "none" : "block";
    darkIcon.style.display = isDark ? "block" : "none";
    swapLogos(isDark ? "dark" : "light");
  };

  // Estado inicial: persistido o preferencia del SO
  const saved = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startDark = saved ? saved === "dark" : prefersDark;

  if (startDark) {
    ensureDarkLink();
    setUIForTheme(true);
  } else {
    removeDarkLink();
    setUIForTheme(false);
  }

  // Toggle
  switcherBtn.addEventListener("click", () => {
    const isDark = !!document.getElementById(DARK_ID);
    if (isDark) {
      removeDarkLink();
      localStorage.setItem("theme", "light");
      setUIForTheme(false);
    } else {
      ensureDarkLink();
      localStorage.setItem("theme", "dark");
      setUIForTheme(true);
    }
  });
});
