from fastapi import APIRouter, HTTPException
from models import LoanApplicationIn, LoanApplicationOut
from database import get_db
from services.emi_calculator import calculate_emi, calculate_foir, disposable_income, approve_or_reject
from services.risk_scorer import compute_risk

router = APIRouter(prefix="/loans", tags=["loans"])


@router.post("/apply", response_model=LoanApplicationOut)
def apply_for_loan(payload: LoanApplicationIn):
    emi      = calculate_emi(payload.loan_amount, payload.interest_rate, payload.tenure_months)
    foir     = calculate_foir(payload.monthly_income, payload.existing_emis, emi)
    disp     = disposable_income(payload.monthly_income, payload.existing_emis, emi)
    decision = approve_or_reject(foir, payload.credit_score)
    risk     = compute_risk(foir, payload.credit_score)

    record = {
        **payload.model_dump(),
        "calculated_emi": emi,
        "foir": foir,
        "disposable_income": disp,
        "decision": decision,
        "risk_level": risk["risk_level"],
    }

    db = get_db()
    res = db.table("loan_applications").insert(record).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to save application")

    return res.data[0]
