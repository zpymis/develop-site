document.addEventListener("DOMContentLoaded", () => {
  // Elementos
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const closeBtn = document.querySelector(".menu-mobile__close");
  const overlay = document.querySelector(".menu-mobile__overlay");
  const body = document.body;

  // Submenús (botones que abren/cerran)
  const submenuToggles = menu.querySelectorAll(
    ".menu-mobile__link[aria-controls]"
  );

  // Helpers focus-trap
  let lastFocusedBeforeOpen = null;

  const getFocusable = (root) =>
    root.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

  const openMenu = () => {
    if (menu.classList.contains("menu-mobile--show")) return;
    lastFocusedBeforeOpen = document.activeElement;

    menu.classList.add("menu-mobile--show");
    toggleBtn.setAttribute("aria-expanded", "true");
    overlay.hidden = false;
    body.classList.add("no-scroll");

    // Focus al primer foco dentro del menú
    const focusables = getFocusable(menu);
    const first = focusables[0] || closeBtn;
    first && first.focus();

    // Esc para cerrar
    document.addEventListener("keydown", onKeydown);
  };

  const closeMenu = () => {
    if (!menu.classList.contains("menu-mobile--show")) return;
    menu.classList.remove("menu-mobile--show");
    toggleBtn.setAttribute("aria-expanded", "false");
    overlay.hidden = true;
    body.classList.remove("no-scroll");

    // Devuelve el foco al botón que abrió
    if (lastFocusedBeforeOpen) {
      lastFocusedBeforeOpen.focus();
      lastFocusedBeforeOpen = null;
    }

    // Cierra submenús abiertos
    submenuToggles.forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
      const id = btn.getAttribute("aria-controls");
      const panel = id ? document.getElementById(id) : null;
      if (panel) panel.style.display = "none";
    });

    document.removeEventListener("keydown", onKeydown);
  };

  const onKeydown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === "Tab") {
      // Focus trap
      const focusables = Array.from(getFocusable(menu));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Clicks
  toggleBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  // Submenús
  submenuToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const id = btn.getAttribute("aria-controls");
      const panel = id ? document.getElementById(id) : null;
      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.style.display = expanded ? "none" : "block";
    });
  });

  // Cerrar menú al cambiar a viewport ancho
  window.addEventListener("resize", () => {
    const windowWidth = parseInt(document.body.clientWidth, 10);
    if (windowWidth >= 985) {
      closeMenu();
    }
  });

  // Cerrar al navegar dentro del menú (links)
  menu.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target &&
      target.matches("a.submenu-mobile__link, a.menu-mobile__link") &&
      !target.hasAttribute("aria-controls")
    ) {
      closeMenu();
    }
  });
});
