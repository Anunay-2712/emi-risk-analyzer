function init_risk() {
  const raw = sessionStorage.getItem("lastResult");
  if (raw) {
    const r = JSON.parse(raw);
    document.getElementById("r-income").value = r.monthly_income  || "";
    document.getElementById("r-emis").value   = r.existing_emis   || 0;
    document.getElementById("r-amount").value = r.loan_amount     || "";
    document.getElementById("r-rate").value   = r.interest_rate   || "";
    document.getElementById("r-tenure").value = r.tenure_months   || "";
    document.getElementById("r-score").value  = r.credit_score    || "";
  }
}

async function analyzeRisk(e) {
  e.preventDefault();
  const btn = document.getElementById("risk-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Analyzing…`;

  const payload = {
    monthly_income: parseFloat(document.getElementById("r-income").value),
    existing_emis:  parseFloat(document.getElementById("r-emis").value)  || 0,
    loan_amount:    parseFloat(document.getElementById("r-amount").value),
    interest_rate:  parseFloat(document.getElementById("r-rate").value),
    tenure_months:  parseInt(document.getElementById("r-tenure").value),
    credit_score:   parseInt(document.getElementById("r-score").value),
  };

  try {
    const res = await API.analyzeRisk(payload);
    renderRiskResult(res);
    document.getElementById("risk-result").style.display = "block";
    document.getElementById("risk-result").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    showToast("Error: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Analyze Risk";
  }
}

function renderRiskResult(res) {
  drawGauge(res.risk_score);

  const levelEl = document.getElementById("risk-level-label");
  levelEl.textContent = res.risk_level;
  levelEl.className   = "risk-label " + riskClass(res.risk_level);

  document.getElementById("risk-score-sub").textContent =
    `Score: ${res.risk_score}/100`;
  document.getElementById("risk-emi-stat").textContent =
    "₹" + Number(res.calculated_emi).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  document.getElementById("risk-foir-stat").textContent = res.foir + "%";

  // Disposable income row
  const disp    = res.disposable_income;
  const dispEl  = document.getElementById("risk-disp-stat");
  dispEl.textContent = "₹" + Math.abs(disp).toLocaleString("en-IN", { maximumFractionDigits: 0 })
                       + (disp < 0 ? " (Deficit!)" : "");
  dispEl.style.color = disp < 0 ? "#e53e3e" : "#38a169";

  // Tips
  document.getElementById("risk-tips").innerHTML =
    res.tips.map(t => `<li>${t}</li>`).join("");
}

function riskClass(level) {
  if (level === "Low Risk")  return "risk-low";
  if (level === "High Risk") return "risk-high";
  return "risk-moderate";
}
