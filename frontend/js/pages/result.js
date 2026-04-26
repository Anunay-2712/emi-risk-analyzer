function init_result() {
  const raw = sessionStorage.getItem("lastResult");
  if (!raw) { navigate("apply"); return; }
  const r = JSON.parse(raw);

  const isApprove = r.decision === "Approve";
  document.getElementById("res-decision-badge").textContent = r.decision;
  document.getElementById("res-decision-badge").className =
    "decision-badge " + (isApprove ? "badge-approve" : "badge-reject");

  document.getElementById("res-emi").textContent  = fmtINR(r.calculated_emi);
  document.getElementById("res-foir").textContent = `FOIR: ${r.foir}%`;

  // Risk level badge
  const riskBadge = document.getElementById("res-risk-badge");
  riskBadge.textContent = r.risk_level;
  riskBadge.className   = "risk-inline-badge " + riskBadgeClass(r.risk_level);

  // Disposable income indicator
  const disp = r.disposable_income;
  const dispEl = document.getElementById("res-disposable");
  dispEl.textContent = fmtINR(Math.abs(disp)) + (disp < 0 ? " (Deficit)" : " remaining");
  dispEl.style.color = disp < 0 ? "#e53e3e" : "#38a169";

  // Summary
  document.getElementById("res-name").textContent   = r.applicant_name;
  document.getElementById("res-income").textContent = fmtINR(r.monthly_income);
  document.getElementById("res-exist").textContent  = fmtINR(r.existing_emis);
  document.getElementById("res-loan").textContent   = fmtINR(r.loan_amount);
  document.getElementById("res-rate").textContent   = r.interest_rate + "%";
  document.getElementById("res-tenure").textContent = r.tenure_months + " months";
  document.getElementById("res-cscore").textContent = r.credit_score;
}

function riskBadgeClass(level) {
  if (level === "Low Risk")    return "risk-badge-low";
  if (level === "High Risk")   return "risk-badge-high";
  return "risk-badge-medium";
}

function fmtINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}
