-- EMI Risk Analyzer - Seed Data
-- Run after schema.sql

INSERT INTO loan_offers (platform, interest_rate, tenure_months, processing_fee_pct, min_credit_score, is_preset) VALUES
('Mpokket', 18.00, 12, 3.00, 600, TRUE),
('Slice',   15.00, 36, 2.00, 650, TRUE),
('Olyv',    12.00, 48, 1.50, 700, TRUE);
