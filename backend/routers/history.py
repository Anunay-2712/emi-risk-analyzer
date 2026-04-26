from fastapi import APIRouter, Query
from database import get_db

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/")
def get_history(search: str = Query(default="")):
    db = get_db()
    res = (
        db.table("loan_applications")
        .select("id, applicant_name, loan_amount, calculated_emi, foir, risk_level, decision, created_at")
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    records = res.data or []
    if search:
        s = search.lower()
        records = [r for r in records if s in r["applicant_name"].lower() or s in r["id"].lower()]
    return records
