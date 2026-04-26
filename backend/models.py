from pydantic import BaseModel, Field
from typing import Optional

class LoanApplicationIn(BaseModel):
    applicant_name: str
    monthly_income: float = Field(gt=0)
    existing_emis: float = Field(ge=0, default=0)
    loan_amount: float = Field(gt=0)
    interest_rate: float = Field(gt=0)
    tenure_months: int = Field(gt=0)
    credit_score: int = Field(ge=300, le=900)

class LoanApplicationOut(LoanApplicationIn):
    id: str
    calculated_emi: float
    foir: float
    disposable_income: float
    decision: str
    risk_level: str
    created_at: str

class RiskAnalysisIn(BaseModel):
    monthly_income: float = Field(gt=0)
    existing_emis: float = Field(ge=0, default=0)
    loan_amount: float = Field(gt=0)
    interest_rate: float = Field(gt=0)
    tenure_months: int = Field(gt=0)
    credit_score: int = Field(ge=300, le=900)

class RiskAnalysisOut(RiskAnalysisIn):
    risk_score: int
    risk_level: str
    calculated_emi: float
    foir: float
    disposable_income: float
    tips: list[str]

class CustomOfferIn(BaseModel):
    platform: str
    interest_rate: float = Field(gt=0)
    tenure_months: int = Field(gt=0)
    processing_fee_pct: float = Field(ge=0, default=0)
    min_credit_score: int = Field(ge=300, le=900, default=300)

class OfferResult(BaseModel):
    platform: str
    interest_rate: float
    tenure_months: int
    processing_fee_pct: float
    min_credit_score: int
    emi: float
    total_payable: float
    is_best: bool = False
