from services.emi_calculator import calculate_emi

def build_offer_results(offers: list[dict], loan_amount: float) -> list[dict]:
    """Given a list of offer records from DB, compute EMI and total payable for each."""
    results = []
    for o in offers:
        emi = calculate_emi(loan_amount, o["interest_rate"], o["tenure_months"])
        total = round(emi * o["tenure_months"], 2)
        results.append({
            "platform": o["platform"],
            "interest_rate": o["interest_rate"],
            "tenure_months": o["tenure_months"],
            "processing_fee_pct": o["processing_fee_pct"],
            "min_credit_score": o["min_credit_score"],
            "emi": emi,
            "total_payable": total,
            "is_best": False,
        })

    # Mark the one with the lowest total payable as "Best"
    if results:
        best = min(results, key=lambda x: x["total_payable"])
        best["is_best"] = True

    return results
