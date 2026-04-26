let currentLoanAmount = 2000000;

async function init_compare() {
  document.getElementById("cmp-amount").value = currentLoanAmount;
  await loadOffers();
}

async function loadOffers() {
  const amount = parseFloat(document.getElementById("cmp-amount").value) || 2000000;
  currentLoanAmount = amount;
  try {
    const offers = await API.compareOffers(amount);
    renderOffersTable(offers);
  } catch (err) {
    showToast("Failed to load offers: " + err.message);
  }
}

function renderOffersTable(offers) {
  const tbody = document.getElementById("offers-tbody");
  tbody.innerHTML = offers.map(o => `
    <tr class="${o.is_best ? "best-row" : ""}">
      <td>${o.platform}${o.is_best ? '<span class="best-badge">Best</span>' : ""}</td>
      <td>${o.interest_rate}%</td>
      <td>${o.tenure_months} mo</td>
      <td>₹${Number(o.emi).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
      <td>${o.processing_fee_pct}%</td>
      <td>₹${Number(o.total_payable).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
      <td>${o.min_credit_score}</td>
    </tr>`).join("");
}

async function addCustomOffer() {
  const platform = document.getElementById("cmp-platform").value.trim();
  const rate     = parseFloat(document.getElementById("cmp-rate").value);
  const tenure   = parseInt(document.getElementById("cmp-tenure").value);
  const fee      = parseFloat(document.getElementById("cmp-fee").value) || 0;
  const score    = parseInt(document.getElementById("cmp-minscore").value) || 300;

  if (!platform || !rate || !tenure) {
    showToast("Please fill platform, rate, and tenure.");
    return;
  }

  try {
    const offers = await API.addCustomOffer(
      { platform, interest_rate: rate, tenure_months: tenure, processing_fee_pct: fee, min_credit_score: score },
      currentLoanAmount
    );
    renderOffersTable(offers);
    // Clear inputs
    ["cmp-platform","cmp-rate","cmp-tenure","cmp-fee","cmp-minscore"]
      .forEach(id => { document.getElementById(id).value = ""; });
    showToast("Custom offer added!");
  } catch (err) {
    showToast("Error: " + err.message);
  }
}
