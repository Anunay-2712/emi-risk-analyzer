function init_apply() {
  // nothing to pre-load
}

async function submitApplication(e) {
  e.preventDefault();
  const btn = document.getElementById("apply-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Submitting…`;

  const payload = {
    applicant_name:  document.getElementById("a-name").value.trim(),
    monthly_income:  parseFloat(document.getElementById("a-income").value),
    existing_emis:   parseFloat(document.getElementById("a-emis").value) || 0,
    loan_amount:     parseFloat(document.getElementById("a-amount").value),
    interest_rate:   parseFloat(document.getElementById("a-rate").value),
    tenure_months:   parseInt(document.getElementById("a-tenure").value),
    credit_score:    parseInt(document.getElementById("a-score").value),
  };

  try {
    const result = await API.applyLoan(payload);
    // Store result for result page
    sessionStorage.setItem("lastResult", JSON.stringify(result));
    navigate("result");
  } catch (err) {
    showToast("Error: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit Application";
  }
}
