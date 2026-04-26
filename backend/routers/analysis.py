from fastapi import APIRouter, HTTPException
from models import RiskAnalysisIn, RiskAnalysisOut, CustomOfferIn
from database import get_db
from services.emi_calculator import calculate_emi, calculate_foir, disposable_income
from services.risk_scorer import compute_risk
from services.loan_offers import build_offer_results

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/risk", response_model=RiskAnalysisOut)
def analyze_risk(payload: RiskAnalysisIn):
    emi  = calculate_emi(payload.loan_amount, payload.interest_rate, payload.tenure_months)
    foir = calculate_foir(payload.monthly_income, payload.existing_emis, emi)
    disp = disposable_income(payload.monthly_income, payload.existing_emis, emi)
    risk = compute_risk(foir, payload.credit_score)

    record = {
        **payload.model_dump(),
        "calculated_emi": emi,
        "foir": foir,
        "disposable_income": disp,
        **risk,
    }

    db = get_db()
    db.table("risk_analyses").insert(record).execute()

    return record


@router.get("/compare")
def compare_offers(loan_amount: float):
    db = get_db()
    res = db.table("loan_offers").select("*").eq("is_preset", True).execute()
    return build_offer_results(res.data or [], loan_amount)


@router.post("/compare/custom")
def add_custom_offer(payload: CustomOfferIn, loan_amount: float):
    db = get_db()
    res = db.table("loan_offers").insert({**payload.model_dump(), "is_preset": False}).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to save custom offer")
    all_res = db.table("loan_offers").select("*").execute()
    return build_offer_results(all_res.data or [], loan_amount)
