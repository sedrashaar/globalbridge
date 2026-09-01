/* Global Bridge GmbH — shared site behaviour (single-page version) */
(function () {
  "use strict";

  var state = { view: "home", lang: "en" };

  var PAGE_META = {
    en: {
      home: { title: "Global Bridge GmbH — Building Cleaning, Transport & Import/Export | Remagen, Germany", desc: "Global Bridge GmbH is a Remagen-based company providing building cleaning, transport services and import/export trade across Germany and the EU." },
      about: { title: "About Us — Global Bridge GmbH", desc: "Global Bridge GmbH is a Remagen-based company combining building cleaning, transport and import/export trade under one roof." },
      services: { title: "Services — Building Cleaning, Transport & Import/Export | Global Bridge GmbH", desc: "Explore Global Bridge GmbH's three core services: building cleaning, transport, and import/export trade." },
      products: { title: "Products & Trade Categories — Global Bridge GmbH", desc: "Global Bridge GmbH imports, exports and trades auto parts, electronics, household goods, solar modules, furniture and more across the EU." },
      contact: { title: "Contact — Global Bridge GmbH", desc: "Get in touch with Global Bridge GmbH for building cleaning, transport or import/export trade requests." },
      impressum: { title: "Legal Notice (Impressum) — Global Bridge GmbH", desc: "Legal notice / Impressum for Global Bridge GmbH in accordance with §5 TMG." }
    },
    de: {
      home: { title: "Global Bridge GmbH — Gebäudereinigung, Transport & Import/Export | Remagen", desc: "Global Bridge GmbH mit Sitz in Remagen bietet Gebäudereinigung, Transportdienstleistungen und Import-/Exporthandel in Deutschland und der EU." },
      about: { title: "Über uns — Global Bridge GmbH", desc: "Global Bridge GmbH aus Remagen vereint Gebäudereinigung, Transport und Import-/Exporthandel unter einem Dach." },
      services: { title: "Leistungen — Gebäudereinigung, Transport & Import/Export | Global Bridge GmbH", desc: "Entdecken Sie die drei Kernleistungen von Global Bridge GmbH: Gebäudereinigung, Transport und Import-/Exporthandel." },
      products: { title: "Produkte & Handelskategorien — Global Bridge GmbH", desc: "Global Bridge GmbH importiert, exportiert und handelt mit Autoteilen, Elektronik, Haushaltswaren, Solarmodulen, Möbeln und mehr in der EU." },
      contact: { title: "Kontakt — Global Bridge GmbH", desc: "Kontaktieren Sie Global Bridge GmbH für Gebäudereinigung, Transport oder Import-/Exportanfragen." },
      impressum: { title: "Impressum — Global Bridge GmbH", desc: "Impressum von Global Bridge GmbH gemäß § 5 TMG." }
    }
  };

  function updateMeta() {
    var meta = PAGE_META[state.lang] && PAGE_META[state.lang][state.view];
    if (meta) {
      document.title = meta.title;
      var m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", meta.desc);
    }
  }

  function applyLang(lang) {
    state.lang = lang;
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.style.display = el.getAttribute("data-lang") === lang ? "" : "none";
    });
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
    });
    updateMeta();
  }

  function applyView(view) {
    state.view = view;
    document.querySelectorAll(".view").forEach(function (sec) {
      sec.style.display = sec.getAttribute("data-view") === view ? "" : "none";
    });
    document.querySelectorAll(".nav-link[data-goto]").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-goto") === view);
    });
    updateMeta();
    window.scrollTo(0, 0);
  }

  /* Navigation + language switch clicks (event delegation) */
  document.addEventListener("click", function (e) {
    var gotoEl = e.target.closest("[data-goto]");
    if (gotoEl) {
      e.preventDefault();
      applyView(gotoEl.getAttribute("data-goto"));
      var anchorId = gotoEl.getAttribute("data-anchor");
      if (anchorId) {
        setTimeout(function () {
          var target = document.querySelector(
            '.view[data-view="' + gotoEl.getAttribute("data-goto") + '"] [data-lang]:not([style*="display: none"]) #' + anchorId
          );
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
      }
      var panel = document.querySelector(".mobile-panel");
      var toggleBtn = document.querySelector(".nav-toggle");
      if (panel && panel.classList.contains("open")) {
        panel.classList.remove("open");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
      return;
    }
    var langEl = e.target.closest("[data-lang-btn]");
    if (langEl) {
      e.preventDefault();
      applyLang(langEl.getAttribute("data-lang-btn"));
    }
  });

  /* Mobile navigation toggle */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.querySelector(".mobile-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      panel.classList.toggle("open");
      document.body.style.overflow = !expanded ? "hidden" : "";
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* Contact forms — static delivery: validate + show confirmation.
     No backend is wired up yet; replace the handler below once
     server-side / form-service integration is chosen. */
  document.querySelectorAll(".js-contact-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var successId = form.getAttribute("data-success-target");
      var successBox = successId ? document.getElementById(successId) : null;
      form.style.display = "none";
      if (successBox) successBox.classList.add("show");
    });
  });

  /* Sticky header: transparent at top, glass on scroll + hide on scroll down / show on scroll up */
  var header = document.querySelector(".site-header");
  if (header) {
    var lastScrollY = window.scrollY;
    var getHeroThreshold = function () {
      var activeHero = document.querySelector(
        '.view:not([style*="display: none"]) [data-lang]:not([style*="display: none"]) .hero, ' +
        '.view:not([style*="display: none"]) [data-lang]:not([style*="display: none"]) .page-hero'
      );
      return activeHero ? Math.max(activeHero.offsetHeight - 60, 40) : 40;
    };
    var onScroll = function () {
      var y = window.scrollY;
      if (y > getHeroThreshold()) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
      if (y > lastScrollY && y > 140) {
        header.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
      }
      lastScrollY = y;
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-goto]")) {
        setTimeout(onScroll, 50);
      }
    });
    onScroll();
  }

  /* Init: default to English homepage */
  applyLang("de");
  applyView("home");

  /* Back-to-top floating button */
  var toTopBtn = document.querySelector(".float-totop");
  if (toTopBtn) {
    document.addEventListener("scroll", function () {
      toTopBtn.classList.toggle("is-visible", window.scrollY > 480);
    }, { passive: true });
    toTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Services page: tab switcher */
  document.querySelectorAll(".service-tab-nav").forEach(function (nav) {
    nav.addEventListener("click", function (e) {
      var btn = e.target.closest(".service-tab-btn");
      if (!btn) return;
      var tabs = nav.closest(".service-tabs");
      var index = btn.getAttribute("data-tab");

      nav.querySelectorAll(".service-tab-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      tabs.querySelectorAll(".service-tab-panel").forEach(function (panel) {
        var match = panel.getAttribute("data-tab") === index;
        panel.style.display = match ? "" : "none";
        panel.classList.toggle("active", match);
      });
    });
  });
})();
