-- EMI Risk Analyzer - Supabase Schema (RFP-aligned)
-- Run this in the Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Loan applications table
CREATE TABLE IF NOT EXISTS loan_applications (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_name     TEXT NOT NULL,
    monthly_income     NUMERIC(15,2) NOT NULL,
    existing_emis      NUMERIC(15,2) DEFAULT 0,
    loan_amount        NUMERIC(15,2) NOT NULL,
    interest_rate      NUMERIC(5,2)  NOT NULL,
    tenure_months      INTEGER       NOT NULL,
    credit_score       INTEGER       NOT NULL CHECK (credit_score BETWEEN 300 AND 900),
    calculated_emi     NUMERIC(15,2),
    foir               NUMERIC(6,2),
    disposable_income  NUMERIC(15,2),          -- RFP Section 4.0: remaining income after EMI
    decision           TEXT CHECK (decision IN ('Approve', 'Reject')),
    risk_level         TEXT CHECK (risk_level IN ('Low Risk', 'Medium Risk', 'High Risk')),
    created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Risk analyses table
CREATE TABLE IF NOT EXISTS risk_analyses (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    monthly_income     NUMERIC(15,2) NOT NULL,
    existing_emis      NUMERIC(15,2) DEFAULT 0,
    loan_amount        NUMERIC(15,2) NOT NULL,
    interest_rate      NUMERIC(5,2)  NOT NULL,
    tenure_months      INTEGER       NOT NULL,
    credit_score       INTEGER       NOT NULL,
    risk_score         INTEGER,
    risk_level         TEXT,
    calculated_emi     NUMERIC(15,2),
    foir               NUMERIC(6,2),
    disposable_income  NUMERIC(15,2),
    tips               JSONB,
    created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Loan offers table (preset + custom)
CREATE TABLE IF NOT EXISTS loan_offers (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform           TEXT NOT NULL,
    interest_rate      NUMERIC(5,2) NOT NULL,
    tenure_months      INTEGER      NOT NULL,
    processing_fee_pct NUMERIC(5,2) DEFAULT 0,
    min_credit_score   INTEGER      DEFAULT 300,
    is_preset          BOOLEAN      DEFAULT TRUE,
    created_at         TIMESTAMPTZ  DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_analyses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_offers       ENABLE ROW LEVEL SECURITY;

-- Open policies (tighten in production with auth.uid())
CREATE POLICY "Allow all on loan_applications" ON loan_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on risk_analyses"     ON risk_analyses     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on loan_offers"       ON loan_offers       FOR ALL USING (true) WITH CHECK (true);
