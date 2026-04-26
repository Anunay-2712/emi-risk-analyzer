const BASE_URL = "http://127.0.0.1:8000";

async function request(method, path, body = null, params = {}) {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "API error");
  return data;
}

const API = {
  applyLoan: (payload) => request("POST", "/loans/apply", payload),
  getHistory: (search = "") => request("GET", "/history/", null, search ? { search } : {}),
  analyzeRisk: (payload) => request("POST", "/analysis/risk", payload),
  compareOffers: (loan_amount) => request("GET", "/analysis/compare", null, { loan_amount }),
  addCustomOffer: (payload, loan_amount) => request("POST", "/analysis/compare/custom", payload, { loan_amount }),
};
