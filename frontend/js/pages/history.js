async function init_history() {
  await loadHistory();
}

async function loadHistory(search = "") {
  const tbody = document.getElementById("history-tbody");
  tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:24px;color:#718096;">Loading…</td></tr>`;
  try {
    const records = await API.getHistory(search);
    if (!records.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:24px;color:#718096;">No records found.</td></tr>`;
      return;
    }
    tbody.innerHTML = records.map(r => `
      <tr>
        <td class="id-cell">${r.id.slice(0, 8)}…</td>
        <td>${r.applicant_name}</td>
        <td>₹${Number(r.loan_amount).toLocaleString("en-IN")}</td>
        <td>₹${Number(r.calculated_emi).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
        <td>${r.foir}%</td>
        <td><span class="risk-inline-badge ${riskBadgeClass(r.risk_level)}" style="font-size:11px;">${r.risk_level || "—"}</span></td>
        <td><span class="decision-badge ${r.decision === "Approve" ? "badge-approve" : "badge-reject"}" style="font-size:12px;padding:2px 12px;">${r.decision}</span></td>
        <td>${new Date(r.created_at).toLocaleDateString("en-IN")}</td>
      </tr>`).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#e53e3e;padding:24px;">${err.message}</td></tr>`;
  }
}

function riskBadgeClass(level) {
  if (level === "Low Risk")  return "risk-badge-low";
  if (level === "High Risk") return "risk-badge-high";
  return "risk-badge-medium";
}

function onHistorySearch(e) {
  loadHistory(e.target.value.trim());
}
