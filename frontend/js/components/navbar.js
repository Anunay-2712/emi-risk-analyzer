function renderNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  nav.innerHTML = `
    <a class="navbar-brand" href="#" data-route="apply">EMI Risk Analyzer</a>
    <nav class="navbar-nav">
      <a class="nav-link" id="nav-apply"   href="#" data-route="apply">Apply</a>
      <a class="nav-link" id="nav-compare" href="#" data-route="compare">Compare</a>
      <a class="nav-link" id="nav-risk"    href="#" data-route="risk">Risk Analysis</a>
      <a class="nav-link" id="nav-history" href="#" data-route="history">History</a>
    </nav>`;
}
