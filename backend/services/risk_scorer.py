def compute_risk(foir: float, credit_score: int) -> dict:
    """
    RFP-aligned risk scorer.
    FOIR thresholds (per Section 4.1 of RFP):
        ≤ 30%  → Low Risk
        31–50% → Medium Risk
        > 50%  → High Risk

    Composite score (0–100, higher = safer):
        FOIR contribution  : 0–60 pts
        Credit score contri: 0–40 pts
    """
    # --- FOIR component (60 pts max) ---
    if foir <= 30:
        foir_pts = 60          # Low Risk zone
    elif foir <= 50:
        foir_pts = 30          # Medium Risk zone
    else:
        foir_pts = 0           # High Risk zone

    # --- Credit score component (40 pts max) ---
    # Normalise 300–900 range to 0–1
    credit_pts = round(max(0, credit_score - 300) / 600 * 40)

    total_score = foir_pts + credit_pts

    # --- Risk level (FOIR is primary classifier per RFP Section 4.1) ---
    if foir <= 30:
        level = "Low Risk"
    elif foir <= 50:
        level = "Medium Risk"
    else:
        level = "High Risk"

    # --- Actionable tips ---
    tips = []
    if foir > 50:
        tips.append(
            "High Risk: Your FOIR exceeds 50%. Reduce existing EMIs or increase income "
            "before applying. Disposable income may turn negative."
        )
    elif foir > 30:
        tips.append(
            "Medium Risk: FOIR is between 31–50%. Consider a longer tenure or a higher "
            "down payment to bring EMI obligations within the safe 30% threshold."
        )
    if credit_score < 650:
        tips.append(
            "Credit score below 650 significantly reduces approval chances. "
            "Clear outstanding dues and avoid new credit enquiries to improve it."
        )
    elif credit_score < 750:
        tips.append(
            "A score above 750 unlocks lower interest rates. "
            "Maintain timely repayments to reach that bracket."
        )
    if not tips:
        tips.append(
            "Low Risk: Your FOIR is within the safe limit and credit score is strong. "
            "You are well-positioned for loan approval."
        )

    return {"risk_score": total_score, "risk_level": level, "tips": tips}
