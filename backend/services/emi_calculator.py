import math

def calculate_emi(principal: float, annual_rate: float, months: int) -> float:
    """Standard EMI formula per RFP Section 4.1: P*r*(1+r)^n / ((1+r)^n - 1)"""
    if annual_rate == 0:
        return round(principal / months, 2)
    r = annual_rate / 12 / 100
    emi = principal * r * math.pow(1 + r, months) / (math.pow(1 + r, months) - 1)
    return round(emi, 2)

def calculate_foir(monthly_income: float, existing_emis: float, new_emi: float) -> float:
    """FOIR = (Fixed Monthly Obligations) / Monthly Income  (as %)"""
    total_obligations = existing_emis + new_emi
    return round((total_obligations / monthly_income) * 100, 2)

def disposable_income(monthly_income: float, existing_emis: float, new_emi: float) -> float:
    """Remaining income after all EMI obligations (negative = high risk warning)."""
    return round(monthly_income - existing_emis - new_emi, 2)

def approve_or_reject(foir: float, credit_score: int) -> str:
    """
    RFP Section 4.1 credit decision:
      High Risk  : FOIR > 50% OR credit score < 600  → Reject
      Medium Risk: FOIR 31–50% AND score 600–699     → Approve (with caution)
      Low Risk   : FOIR ≤ 30% AND score ≥ 700        → Approve
    """
    if foir > 50 or credit_score < 600:
        return "Reject"
    return "Approve"
