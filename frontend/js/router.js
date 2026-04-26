const routes = {
  apply:   { pageId: "page-apply",   navId: "nav-apply"   },
  result:  { pageId: "page-result",  navId: "nav-apply"   },
  compare: { pageId: "page-compare", navId: "nav-compare" },
  risk:    { pageId: "page-risk",    navId: "nav-risk"    },
  history: { pageId: "page-history", navId: "nav-history" },
};

function navigate(route) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  // Remove active nav
  document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));

  const cfg = routes[route] || routes["apply"];
  document.getElementById(cfg.pageId)?.classList.add("active");
  document.getElementById(cfg.navId)?.classList.add("active");

  window.location.hash = route;

  // Trigger page-level init if defined
  const initFn = window[`init_${route}`];
  if (typeof initFn === "function") initFn();
}

function initRouter() {
  document.querySelectorAll("[data-route]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(el.dataset.route);
    });
  });

  const hash = window.location.hash.replace("#", "") || "apply";
  navigate(hash);
}
