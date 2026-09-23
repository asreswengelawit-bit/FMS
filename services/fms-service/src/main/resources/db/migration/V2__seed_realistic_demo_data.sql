-- =============================================================================
-- V2: Realistic demo data for the FMS module
--
-- Produces a coherent set of books:
--   * A full chart of accounts where Assets = Liabilities + Equity
--   * A 2025/2026 fiscal history with one OPEN period (2026-09)
--   * Vendors, customers, AP/AR invoices, payments, bank accounts and
--     statement lines, posted journal entries, budgets, and audit logs.
-- All journal entries are balanced (debits = credits).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Chart of Accounts — expand V1's starter set into a full, coherent chart.
-- Balances are chosen so the balance sheet verifies:
--   Assets (4,295,000) = Liabilities (1,310,000) + Equity (2,985,000)
-- ---------------------------------------------------------------------------
-- Bring the V1 bank account into the ASSET family so the balance sheet and
-- the frontend type filter (ASSET/LIABILITY/EQUITY/REVENUE/EXPENSE) include it.
UPDATE coa_accounts
SET type = 'ASSET',
    name = 'Bank - Operating',
    normal_balance = 'DEBIT',
    balance = 1450000.00,
    description = 'Main operating bank account (Commercial Bank of Ethiopia)',
    updated_at = '2026-09-23T10:00:00Z',
    updated_by = 'system'
WHERE id = 'AC-1010';

INSERT INTO coa_accounts (id, code, name, type, normal_balance, posting_allowed, status, balance, created_at, created_by, description)
VALUES
    ('AC-1020',  '1020',  'Bank - Payroll',           'ASSET',     'DEBIT',  TRUE, 'ACTIVE', 320000.00,  '2025-06-01T00:00:00Z', 'system', 'Payroll funding account (Awash Bank)'),
    ('AC-1100',  '1100',  'Inventory',                'ASSET',     'DEBIT',  TRUE, 'ACTIVE', 685000.00,  '2025-06-01T00:00:00Z', 'system', 'Raw materials and finished goods'),
    ('AC-1200',  '1200',  'Prepaid Expenses',         'ASSET',     'DEBIT',  TRUE, 'ACTIVE', 90000.00,   '2025-06-01T00:00:00Z', 'system', 'Prepaid rent, insurance and licenses'),
    ('AC-1300',  '1300',  'Office Equipment',         'ASSET',     'DEBIT',  TRUE, 'ACTIVE', 960000.00,  '2025-06-01T00:00:00Z', 'system', 'Computers, furniture and fixtures'),
    -- Liabilities
    ('AC-2200',  '2200',  'Accrued Expenses',          'LIABILITY', 'CREDIT', TRUE, 'ACTIVE', 145000.00, '2025-06-01T00:00:00Z', 'system', 'Accrued salaries, interest and services'),
    ('AC-2300',  '2300',  'Sales Tax Payable (VAT)',   'LIABILITY', 'CREDIT', TRUE, 'ACTIVE', 120000.00, '2025-06-01T00:00:00Z', 'system', 'VAT collected on taxable sales'),
    ('AC-2400',  '2400',  'Withholding Tax Payable',   'LIABILITY', 'CREDIT', TRUE, 'ACTIVE', 75000.00,  '2025-06-01T00:00:00Z', 'system', 'Withholding tax due to tax authority'),
    ('AC-2500',  '2500',  'Short-term Loan',           'LIABILITY', 'CREDIT', TRUE, 'ACTIVE', 590000.00, '2025-06-01T00:00:00Z', 'system', 'Commercial bank working capital loan'),
    -- Equity
    ('AC-3100',  '3100',  'Owner''s Capital',          'EQUITY',    'CREDIT', TRUE, 'ACTIVE', 1860000.00, '2025-06-01T00:00:00Z', 'system', 'Shareholder contributed capital'),
    -- Revenue
    ('AC-4100',  '4100',  'Service Revenue',           'REVENUE',   'CREDIT', TRUE, 'ACTIVE', 860000.00,  '2025-06-01T00:00:00Z', 'system', 'Consulting and service income'),
    ('AC-4200',  '4200',  'Interest Revenue',          'REVENUE',   'CREDIT', TRUE, 'ACTIVE', 35000.00,   '2025-06-01T00:00:00Z', 'system', 'Interest earned on bank deposits'),
    -- Expenses
    ('AC-5200',  '5200',  'Salaries Expense',          'EXPENSE',   'DEBIT',  TRUE, 'ACTIVE', 640000.00,  '2025-06-01T00:00:00Z', 'system', 'Gross salaries and wages'),
    ('AC-5300',  '5300',  'Rent Expense',              'EXPENSE',   'DEBIT',  TRUE, 'ACTIVE', 260000.00,  '2025-06-01T00:00:00Z', 'system', 'Office and warehouse rent'),
    ('AC-5400',  '5400',  'Utilities Expense',         'EXPENSE',   'DEBIT',  TRUE, 'ACTIVE', 145000.00,  '2025-06-01T00:00:00Z', 'system', 'Electricity, water and internet'),
    ('AC-5500',  '5500',  'Office Supplies Expense',   'EXPENSE',   'DEBIT',  TRUE, 'ACTIVE', 85000.00,   '2025-06-01T00:00:00Z', 'system', 'Stationery and consumables'),
    ('AC-5600',  '5600',  'Marketing Expense',         'EXPENSE',   'DEBIT',  TRUE, 'ACTIVE', 175000.00,  '2025-06-01T00:00:00Z', 'system', 'Advertising and promotion'),
    ('AC-5700',  '5700',  'Depreciation Expense',      'EXPENSE',   'DEBIT',  TRUE, 'ACTIVE', 60000.00,   '2025-06-01T00:00:00Z', 'system', 'Depreciation on office equipment');

-- Retained earnings closing balance now reflects prior-year earnings
-- (it is part of the balanced equity block above).
UPDATE coa_accounts
SET balance = 1125000.00, updated_at = '2026-09-23T10:00:00Z', updated_by = 'system'
WHERE id = 'AC-3000';

-- Cash and Accounts Receivable close out the asset block so that
-- Assets (4,295,000) = Liabilities (1,310,000) + Equity (2,985,000).
UPDATE coa_accounts
SET balance = 250000.00, updated_at = '2026-09-23T10:00:00Z', updated_by = 'system'
WHERE id = 'AC-1000';

UPDATE coa_accounts
SET balance = 540000.00, updated_at = '2026-09-23T10:00:00Z', updated_by = 'system'
WHERE id = 'AC-2100';

-- AP control account closes out the liability block and revenue/expense
-- accounts carry their YTD income-statement balances.
UPDATE coa_accounts
SET name = 'Accounts Payable', updated_at = '2026-09-23T10:00:00Z', updated_by = 'system'
WHERE id = 'AC-2000';

UPDATE coa_accounts
SET balance = 380000.00, updated_at = '2026-09-23T10:00:00Z', updated_by = 'system'
WHERE id = 'AC-2000';

UPDATE coa_accounts
SET name = 'Sales Revenue', balance = 2450000.00, updated_at = '2026-09-23T10:00:00Z', updated_by = 'system'
WHERE id = 'AC-4000';

UPDATE coa_accounts
SET balance = 1190000.00, updated_at = '2026-09-23T10:00:00Z', updated_by = 'system'
WHERE id = 'AC-5100';

-- ---------------------------------------------------------------------------
-- Accounting Periods — historical FY2025 + FY2026 YTD, 2026-09 is OPEN.
-- ---------------------------------------------------------------------------
UPDATE accounting_periods
SET status = 'CLOSED', closed_by = 'finance_manager', closed_at = '2026-02-05T17:00:00Z',
    updated_at = '2026-02-05T17:05:00Z'
WHERE id = 'PER-2026-001';

INSERT INTO accounting_periods (id, period_name, start_date, end_date, status, opened_by, closed_by, opened_at, closed_at, created_at, updated_at)
VALUES
    ('PER-2025-006', '2025-06', DATE '2025-06-01', DATE '2025-06-30', 'CLOSED', 'system', 'finance_manager', '2025-05-25T08:00:00Z', '2025-07-05T17:00:00Z', '2025-05-25T08:00:00Z', '2025-07-05T17:05:00Z'),
    ('PER-2025-007', '2025-07', DATE '2025-07-01', DATE '2025-07-31', 'CLOSED', 'system', 'finance_manager', '2025-06-25T08:00:00Z', '2025-08-05T17:00:00Z', '2025-06-25T08:00:00Z', '2025-08-05T17:05:00Z'),
    ('PER-2025-008', '2025-08', DATE '2025-08-01', DATE '2025-08-31', 'CLOSED', 'system', 'finance_manager', '2025-07-25T08:00:00Z', '2025-09-05T17:00:00Z', '2025-07-25T08:00:00Z', '2025-09-05T17:05:00Z'),
    ('PER-2025-009', '2025-09', DATE '2025-09-01', DATE '2025-09-30', 'CLOSED', 'system', 'finance_manager', '2025-08-25T08:00:00Z', '2025-10-05T17:00:00Z', '2025-08-25T08:00:00Z', '2025-10-05T17:05:00Z'),
    ('PER-2025-010', '2025-10', DATE '2025-10-01', DATE '2025-10-31', 'CLOSED', 'system', 'finance_manager', '2025-09-25T08:00:00Z', '2025-11-05T17:00:00Z', '2025-09-25T08:00:00Z', '2025-11-05T17:05:00Z'),
    ('PER-2025-011', '2025-11', DATE '2025-11-01', DATE '2025-11-30', 'CLOSED', 'system', 'finance_manager', '2025-10-25T08:00:00Z', '2025-12-05T17:00:00Z', '2025-10-25T08:00:00Z', '2025-12-05T17:05:00Z'),
    ('PER-2025-012', '2025-12', DATE '2025-12-01', DATE '2025-12-31', 'CLOSED', 'system', 'finance_manager', '2025-11-25T08:00:00Z', '2026-01-05T17:00:00Z', '2025-11-25T08:00:00Z', '2026-01-05T17:05:00Z'),
    ('PER-2026-002', '2026-02', DATE '2026-02-01', DATE '2026-02-28', 'CLOSED', 'system', NULL, '2026-01-25T08:00:00Z', NULL, '2026-01-25T08:00:00Z', NULL),
    ('PER-2026-003', '2026-03', DATE '2026-03-01', DATE '2026-03-31', 'CLOSED', 'system', NULL, '2026-02-25T08:00:00Z', NULL, '2026-02-25T08:00:00Z', NULL),
    ('PER-2026-004', '2026-04', DATE '2026-04-01', DATE '2026-04-30', 'CLOSED', 'system', NULL, '2026-03-25T08:00:00Z', NULL, '2026-03-25T08:00:00Z', NULL),
    ('PER-2026-005', '2026-05', DATE '2026-05-01', DATE '2026-05-31', 'CLOSED', 'system', NULL, '2026-04-25T08:00:00Z', NULL, '2026-04-25T08:00:00Z', NULL),
    ('PER-2026-006', '2026-06', DATE '2026-06-01', DATE '2026-06-30', 'CLOSED', 'system', NULL, '2026-05-25T08:00:00Z', NULL, '2026-05-25T08:00:00Z', NULL),
    ('PER-2026-007', '2026-07', DATE '2026-07-01', DATE '2026-07-31', 'CLOSED', 'system', NULL, '2026-06-25T08:00:00Z', NULL, '2026-06-25T08:00:00Z', NULL),
    ('PER-2026-008', '2026-08', DATE '2026-08-01', DATE '2026-08-31', 'CLOSED', 'system', NULL, '2026-07-25T08:00:00Z', NULL, '2026-07-25T08:00:00Z', NULL),
    ('PER-2026-009', '2026-09', DATE '2026-09-01', DATE '2026-09-30', 'OPEN',   'general_accountant', NULL, '2026-08-25T08:00:00Z', NULL, '2026-08-25T08:00:00Z', NULL);

-- ---------------------------------------------------------------------------
-- Vendors (AP balances exhaust the AP control account, 380,000)
-- ---------------------------------------------------------------------------
INSERT INTO vendors (id, vendor_code, vendor_name, contact_name, email, phone, address, tax_id, payment_terms, currency, status, ap_balance, created_by, created_at, updated_at)
VALUES
    ('VND-001', 'VND-001', 'Acme Supplies Ltd',          'Abebe Kebede',  'abebe.k@acmesupplies.et',   '+251-11-555-1200', 'Bole, Addis Ababa',     'TIN-1001',  'NET 30',  'USD', 'ACTIVE',  95000.00,  'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z'),
    ('VND-002', 'VND-002', 'Global Tech Solutions',      'Hanna Mekonnen', 'hanna@globaltech.et',      '+251-91-222-3344', 'Kazanchis, Addis Ababa', 'TIN-1002', 'NET 45',  'USD', 'ACTIVE',  80000.00,  'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z'),
    ('VND-003', 'VND-003', 'Addis Construction PLC',     'Dawit Tadesse',  'dawit@addisconst.et',      '+251-11-663-7788', 'Kirkos, Addis Ababa',   'TIN-1003', 'NET 60',  'USD', 'ACTIVE',  105000.00, 'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z'),
    ('VND-004', 'VND-004', 'Nile Textile Traders',       'Sara Ahmed',     'sara@niletextile.et',      '+251-91-444-5566', 'Mekelle, Tigray',       'TIN-1004', 'NET 30',  'USD', 'ACTIVE',  55000.00,  'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z'),
    ('VND-005', 'VND-005', 'Green Agro Farms',           'Gebre Haile',    'gebre@greenagro.et',       '+251-11-778-9900', 'Debre Zeit, Oromia',    'TIN-1005', 'NET 15',  'USD', 'ACTIVE',  45000.00,  'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z');

-- ---------------------------------------------------------------------------
-- Customers (AR balances exhaust the AR control account, 540,000)
-- ---------------------------------------------------------------------------
INSERT INTO customers (id, customer_code, customer_name, contact_name, email, phone, address, tax_id, payment_terms, currency, status, ar_balance, created_by, created_at, updated_at)
VALUES
    ('CST-001', 'CST-001', 'Ethio Telecom',               'Marta Bekele',    'procurement@ethiotelecom.et', '+251-11-830-0000', '4th Floor, Tele Building', 'TIN-2001', 'NET 30', 'USD', 'ACTIVE', 150000.00, 'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z'),
    ('CST-002', 'CST-002', 'Sheba Steel Industries',      'Yonas Worku',     'accounts@shebasteel.et',     '+251-91-113-2200', 'Akaki, Addis Ababa',       'TIN-2002', 'NET 30', 'USD', 'ACTIVE', 120000.00, 'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z'),
    ('CST-003', 'CST-003', 'Addis Bank S.C.',             'Liya Solomon',    'finance@addisbank.et',       '+251-11-552-1000', 'Churchill Ave, Addis Ababa','TIN-2003', 'NET 45', 'USD', 'ACTIVE', 95000.00,  'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z'),
    ('CST-004', 'CST-004', 'Horizon Hotels & Resorts',    'Tigist Alemu',    'purchasing@horizonhotels.et', '+251-91-900-5544','Bole Road, Addis Ababa',    'TIN-2004', 'NET 30', 'USD', 'ACTIVE', 80000.00,  'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z'),
    ('CST-005', 'CST-005', 'Tena Health PLC',             'Biruk Tesfaye',   'buyer@tenahealth.et',        '+251-11-320-8877', 'Piassa, Addis Ababa',      'TIN-2005', 'NET 15', 'USD', 'ACTIVE', 95000.00,  'system', '2025-06-01T00:00:00Z', '2026-09-23T09:00:00Z');

-- ---------------------------------------------------------------------------
-- AP Invoices
-- ---------------------------------------------------------------------------
INSERT INTO invoices (id, invoice_number, invoice_type, party_name, period_id, period_name, issue_date, due_date, status, total_amount, paid_amount, remaining_balance, control_account_id, control_account_code, control_account_name, vendor_id, vendor_code, created_by, created_at, updated_at)
VALUES
    ('INV-2026-101', 'INV-2026-101', 'PAYABLE', 'Acme Supplies Ltd',       'PER-2026-009', '2026-09', DATE '2026-09-04', DATE '2026-10-04', 'POSTED',        60000.00, 0.00,      60000.00, 'AC-2000', '2000', 'Accounts Payable', 'VND-001', 'VND-001', 'ap_officer', '2026-09-04T10:00:00Z', '2026-09-05T12:00:00Z'),
    ('INV-2026-102', 'INV-2026-102', 'PAYABLE', 'Global Tech Solutions',   'PER-2026-009', '2026-09', DATE '2026-09-08', DATE '2026-10-08', 'APPROVED',      78500.00, 0.00,      78500.00, 'AC-2000', '2000', 'Accounts Payable', 'VND-002', 'VND-002', 'ap_officer', '2026-09-08T09:00:00Z', '2026-09-09T11:00:00Z'),
    ('INV-2026-103', 'INV-2026-103', 'PAYABLE', 'Addis Construction PLC',  'PER-2026-009', '2026-09', DATE '2026-09-12', DATE '2026-10-12', 'POSTED',        105000.00, 0.00,     105000.00, 'AC-2000', '2000', 'Accounts Payable', 'VND-003', 'VND-003', 'ap_officer', '2026-09-12T15:00:00Z', '2026-09-13T09:00:00Z'),
    ('INV-2026-104', 'INV-2026-104', 'PAYABLE', 'Nile Textile Traders',    'PER-2026-008', '2026-08', DATE '2026-08-18', DATE '2026-09-18', 'PAID',          55000.00, 55000.00, 0.00,       'AC-2000', '2000', 'Accounts Payable', 'VND-004', 'VND-004', 'ap_officer', '2026-08-18T10:00:00Z', '2026-09-05T14:00:00Z'),
    ('INV-2026-105', 'INV-2026-105', 'PAYABLE', 'Green Agro Farms',        'PER-2026-008', '2026-08', DATE '2026-08-22', DATE '2026-09-22', 'PARTIALLY_PAID',45000.00, 20000.00, 25000.00, 'AC-2000', '2000', 'Accounts Payable', 'VND-005', 'VND-005', 'ap_officer', '2026-08-22T13:00:00Z', '2026-09-10T16:00:00Z');

INSERT INTO invoice_lines (id, invoice_id, account_id, account_code, account_name, description, quantity, unit_price, total_price)
VALUES
    ('INV-2026-101-L1', 'INV-2026-101', 'AC-1100', '1100', 'Inventory',             'Office furniture restock',    1, 60000.00, 60000.00),
    ('INV-2026-102-L1', 'INV-2026-102', 'AC-5500', '5500', 'Office Supplies Expense', 'IT consumables and stationery', 1, 78500.00, 78500.00),
    ('INV-2026-103-L1', 'INV-2026-103', 'AC-1300', '1300', 'Office Equipment',      'Warehouse fit-out',            1, 105000.00, 105000.00),
    ('INV-2026-104-L1', 'INV-2026-104', 'AC-1100', '1100', 'Inventory',             'Uniform fabric roll',          100, 550.00, 55000.00),
    ('INV-2026-105-L1', 'INV-2026-105', 'AC-1100', '1100', 'Inventory',             'Fresh produce supply',         90, 500.00, 45000.00);

-- ---------------------------------------------------------------------------
-- AR Invoices
-- ---------------------------------------------------------------------------
INSERT INTO invoices (id, invoice_number, invoice_type, party_name, period_id, period_name, issue_date, due_date, status, total_amount, paid_amount, remaining_balance, control_account_id, control_account_code, control_account_name, customer_id, customer_code, created_by, created_at, updated_at)
VALUES
    ('INV-2026-201', 'INV-2026-201', 'RECEIVABLE', 'Ethio Telecom',          'PER-2026-009', '2026-09', DATE '2026-09-06', DATE '2026-10-06', 'POSTED',       150000.00, 0.00,      150000.00, 'AC-2100', '2100', 'Accounts Receivable', 'CST-001', 'CST-001', 'ar_officer', '2026-09-06T09:00:00Z', '2026-09-07T10:00:00Z'),
    ('INV-2026-202', 'INV-2026-202', 'RECEIVABLE', 'Sheba Steel Industries', 'PER-2026-009', '2026-09', DATE '2026-09-10', DATE '2026-10-10', 'APPROVED',     82000.00, 0.00,      82000.00,  'AC-2100', '2100', 'Accounts Receivable', 'CST-002', 'CST-002', 'ar_officer', '2026-09-10T14:00:00Z', '2026-09-11T09:00:00Z'),
    ('INV-2026-203', 'INV-2026-203', 'RECEIVABLE', 'Addis Bank S.C.',        'PER-2026-008', '2026-08', DATE '2026-08-15', DATE '2026-09-15', 'PAID',         95000.00,  95000.00, 0.00,       'AC-2100', '2100', 'Accounts Receivable', 'CST-003', 'CST-003', 'ar_officer', '2026-08-15T09:00:00Z', '2026-09-02T15:00:00Z'),
    ('INV-2026-204', 'INV-2026-204', 'RECEIVABLE', 'Horizon Hotels & Resorts','PER-2026-008', '2026-08', DATE '2026-08-20', DATE '2026-09-20', 'SUBMITTED',    80000.00,  0.00,      80000.00,  'AC-2100', '2100', 'Accounts Receivable', 'CST-004', 'CST-004', 'ar_officer', '2026-08-20T11:00:00Z', '2026-08-21T13:00:00Z'),
    ('INV-2026-205', 'INV-2026-205', 'RECEIVABLE', 'Tena Health PLC',        'PER-2026-009', '2026-09', DATE '2026-09-18', DATE '2026-10-18', 'DRAFT',        95000.00,  0.00,      95000.00,  'AC-2100', '2100', 'Accounts Receivable', 'CST-005', 'CST-005', 'ar_officer', '2026-09-18T10:00:00Z', '2026-09-18T10:00:00Z');

INSERT INTO invoice_lines (id, invoice_id, account_id, account_code, account_name, description, quantity, unit_price, total_price)
VALUES
    ('INV-2026-201-L1', 'INV-2026-201', 'AC-4000', '4000', 'Sales Revenue',        'Network equipment supply', 1, 150000.00, 150000.00),
    ('INV-2026-202-L1', 'INV-2026-202', 'AC-4100', '4100', 'Service Revenue',       'Industrial consultancy',   1, 82000.00,  82000.00),
    ('INV-2026-203-L1', 'INV-2026-203', 'AC-4100', '4100', 'Service Revenue',       'Branch security services', 1, 95000.00,  95000.00),
    ('INV-2026-204-L1', 'INV-2026-204', 'AC-4000', '4000', 'Sales Revenue',        'Furniture and fixtures',   1, 80000.00,  80000.00),
    ('INV-2026-205-L1', 'INV-2026-205', 'AC-4100', '4100', 'Service Revenue',       'Facility management',      1, 95000.00,  95000.00);

-- ---------------------------------------------------------------------------
-- Payments (bank-backed; control account is the operating bank GL)
-- ---------------------------------------------------------------------------
INSERT INTO payments (id, payment_number, payment_type, party_name, period_id, period_name, payment_date, amount, status, payment_method, reference_number, control_account_id, control_account_code, control_account_name, invoice_id, invoice_number, related_entity_id, related_entity_code, notes, created_by, approved_by, created_at, updated_at)
VALUES
    ('PMT-2026-001', 'PMT-2026-001', 'RECEIPT',       'Ethio Telecom',        'PER-2026-009', '2026-09', DATE '2026-09-14', 60000.00, 'COMPLETED', 'BANK_TRANSFER', 'REF-ET-9001', 'AC-1010', '1010', 'Bank - Operating', 'INV-2026-201', 'INV-2026-201', 'CST-001', 'CST-001', 'Partial collection on INV-2026-201', 'ar_officer', 'finance_manager', '2026-09-14T11:00:00Z', '2026-09-14T12:00:00Z'),
    ('PMT-2026-002', 'PMT-2026-002', 'DISBURSEMENT',  'Nile Textile Traders', 'PER-2026-009', '2026-09', DATE '2026-09-05', 55000.00, 'COMPLETED', 'BANK_TRANSFER', 'CHK-99812',     'AC-1010', '1010', 'Bank - Operating', 'INV-2026-104', 'INV-2026-104', 'VND-004', 'VND-004', 'Full settlement of INV-2026-104',    'ap_officer', 'finance_manager', '2026-09-05T14:00:00Z', '2026-09-05T15:00:00Z'),
    ('PMT-2026-003', 'PMT-2026-003', 'RECEIPT',       'Addis Bank S.C.',      'PER-2026-009', '2026-09', DATE '2026-09-02', 95000.00, 'COMPLETED', 'BANK_TRANSFER', 'REF-BK-1002',  'AC-1010', '1010', 'Bank - Operating', 'INV-2026-203', 'INV-2026-203', 'CST-003', 'CST-003', 'Full collection on INV-2026-203',    'ar_officer', 'finance_manager', '2026-09-02T15:00:00Z', '2026-09-02T16:00:00Z'),
    ('PMT-2026-004', 'PMT-2026-004', 'DISBURSEMENT',  'Green Agro Farms',     'PER-2026-009', '2026-09', DATE '2026-09-10', 20000.00, 'COMPLETED', 'BANK_TRANSFER', 'CHK-99854',     'AC-1010', '1010', 'Bank - Operating', 'INV-2026-105', 'INV-2026-105', 'VND-005', 'VND-005', 'Partial payment on INV-2026-105',    'ap_officer', 'finance_manager', '2026-09-10T10:00:00Z', '2026-09-10T11:00:00Z'),
    ('PMT-2026-005', 'PMT-2026-005', 'RECEIPT',       'Sheba Steel Industries', 'PER-2026-009', '2026-09', DATE '2026-09-16', 40000.00, 'COMPLETED', 'BANK_TRANSFER', 'REF-SS-2204',  'AC-1010', '1010', 'Bank - Operating', 'INV-2026-202', 'INV-2026-202', 'CST-002', 'CST-002', 'Partial collection on INV-2026-202', 'ar_officer', 'finance_manager', '2026-09-16T09:00:00Z', '2026-09-16T10:00:00Z');

-- ---------------------------------------------------------------------------
-- Bank Accounts: refresh V1 demo account, add payroll + tax accounts
-- ---------------------------------------------------------------------------
UPDATE bank_accounts
SET account_name = 'Operating Account', bank_name = 'Commercial Bank of Ethiopia',
    branch = 'Head Office, Addis Ababa', currency = 'USD', opening_balance = 1350000.00,
    current_balance = 1450000.00, updated_at = '2026-09-23T10:00:00Z'
WHERE id = 'BK-0001';

INSERT INTO bank_accounts (id, account_name, account_number, bank_name, branch, currency, opening_balance, current_balance, is_active, created_by, created_at, updated_at)
VALUES
    ('BK-0002', 'Payroll Account',     '1020-0002-777', 'Awash Bank',                  'Bole, Addis Ababa',     'USD', 300000.00, 320000.00, TRUE, 'system', '2025-06-01T00:00:00Z', '2026-09-23T10:00:00Z'),
    ('BK-0003', 'Tax Clearance Account', '1030-0003-101', 'Commercial Bank of Ethiopia', 'Head Office, Addis Ababa', 'USD', 90000.00, 90000.00,  TRUE, 'system', '2025-06-01T00:00:00Z', '2026-09-23T10:00:00Z');

-- ---------------------------------------------------------------------------
-- Bank Statement Lines (reconciliation ready)
-- ---------------------------------------------------------------------------
INSERT INTO bank_statement_lines (id, bank_account_id, transaction_date, description, amount, type, reference, reconciliation_status, matched_payment_id, created_at)
VALUES
    ('BS-2026-001', 'BK-0001', DATE '2026-09-02',  'Addis Bank collection',       95000.00, 'CREDIT', 'REF-BK-1002', 'MATCHED',   'PMT-2026-003', '2026-09-02T16:00:00Z'),
    ('BS-2026-002', 'BK-0001', DATE '2026-09-05',  'Nile Textile disbursement',    55000.00, 'DEBIT',  'CHK-99812',   'MATCHED',   'PMT-2026-002', '2026-09-05T15:00:00Z'),
    ('BS-2026-003', 'BK-0001', DATE '2026-09-10',  'Green Agro disbursement',      20000.00, 'DEBIT',  'CHK-99854',   'MATCHED',   'PMT-2026-004', '2026-09-10T11:00:00Z'),
    ('BS-2026-004', 'BK-0001', DATE '2026-09-14',  'Ethio Telecom collection',     60000.00, 'CREDIT', 'REF-ET-9001', 'MATCHED',   'PMT-2026-001', '2026-09-14T12:00:00Z'),
    ('BS-2026-005', 'BK-0001', DATE '2026-09-16',  'Sheba Steel collection',       40000.00, 'CREDIT', 'REF-SS-2204', 'MATCHED',   'PMT-2026-005', '2026-09-16T10:00:00Z'),
    ('BS-2026-006', 'BK-0001', DATE '2026-09-18',  'Interest income',               2500.00, 'CREDIT', 'INT-SEP',     'UNMATCHED', NULL,            '2026-09-18T08:00:00Z'),
    ('BS-2026-007', 'BK-0001', DATE '2026-09-20',  'Unknown transfer - verify',     18000.00, 'CREDIT', NULL,          'EXCEPTION', NULL,            '2026-09-20T09:00:00Z');

-- ---------------------------------------------------------------------------
-- Posted Journal Entries (each entry is internally balanced)
-- ---------------------------------------------------------------------------
INSERT INTO journal_entries (id, period_id, period_name, description, status, created_by, approved_by, posted_at, created_at, updated_at, total_debit, total_credit, is_reversal)
VALUES
    ('JE-2026-08-001', 'PER-2026-008', '2026-08', 'August sales recorded on credit',         'POSTED', 'general_accountant', 'finance_manager', '2026-08-31T17:00:00Z', '2026-08-31T16:30:00Z', '2026-08-31T17:05:00Z', 120000.00, 120000.00, FALSE),
    ('JE-2026-08-002', 'PER-2026-008', '2026-08', 'August vendor payments',                  'POSTED', 'general_accountant', 'finance_manager', '2026-08-20T17:00:00Z', '2026-08-20T16:30:00Z', '2026-08-20T17:05:00Z', 85000.00,  85000.00,  FALSE),
    ('JE-2026-09-001', 'PER-2026-009', '2026-09', 'Customer receipt - Ethio Telecom',        'POSTED', 'general_accountant', 'finance_manager', '2026-09-14T12:00:00Z', '2026-09-14T11:30:00Z', '2026-09-14T12:05:00Z', 60000.00,  60000.00,  FALSE),
    ('JE-2026-09-002', 'PER-2026-009', '2026-09', 'Vendor payment - Acme Supplies',          'POSTED', 'general_accountant', 'finance_manager', '2026-09-06T15:00:00Z', '2026-09-06T14:30:00Z', '2026-09-06T15:05:00Z', 60000.00,  60000.00,  FALSE),
    ('JE-2026-09-003', 'PER-2026-009', '2026-09', 'September sales recorded on credit',      'POSTED', 'general_accountant', 'finance_manager', '2026-09-30T17:00:00Z', '2026-09-30T16:30:00Z', '2026-09-30T17:05:00Z', 150000.00, 150000.00, FALSE),
    ('JE-2026-09-004', 'PER-2026-009', '2026-09', 'September payroll run',                   'POSTED', 'general_accountant', 'finance_manager', '2026-09-25T17:00:00Z', '2026-09-25T16:30:00Z', '2026-09-25T17:05:00Z', 54000.00,  54000.00,  FALSE),
    ('JE-2026-09-005', 'PER-2026-009', '2026-09', 'September office rent',                   'POSTED', 'general_accountant', 'finance_manager', '2026-09-01T10:00:00Z', '2026-09-01T09:30:00Z', '2026-09-01T10:05:00Z', 22000.00,  22000.00,  FALSE),
    ('JE-2026-09-006', 'PER-2026-009', '2026-09', 'September marketing campaign',            'POSTED', 'general_accountant', 'finance_manager', '2026-09-15T17:00:00Z', '2026-09-15T16:30:00Z', '2026-09-15T17:05:00Z', 15000.00,  15000.00,  FALSE);

INSERT INTO journal_lines (id, journal_id, account_id, account_code, account_name, debit_amount, credit_amount, description)
VALUES
    -- JE-2026-08-001: Dr AR 120,000 / Cr Sales Revenue 120,000
    ('JL-2026-08-001-D', 'JE-2026-08-001', 'AC-2100', '2100', 'Accounts Receivable',   120000.00, 0.00,      'August credit sales'),
    ('JL-2026-08-001-C', 'JE-2026-08-001', 'AC-4000', '4000', 'Sales Revenue',          0.00,     120000.00, 'August credit sales'),
    -- JE-2026-08-002: Dr AP 85,000 / Cr Bank 85,000
    ('JL-2026-08-002-D', 'JE-2026-08-002', 'AC-2000', '2000', 'Accounts Payable',       85000.00, 0.00,      'August vendor payments'),
    ('JL-2026-08-002-C', 'JE-2026-08-002', 'AC-1010', '1010', 'Bank - Operating',       0.00,     85000.00,  'August vendor payments'),
    -- JE-2026-09-001: Dr Bank 60,000 / Cr AR 60,000
    ('JL-2026-09-001-D', 'JE-2026-09-001', 'AC-1010', '1010', 'Bank - Operating',       60000.00, 0.00,      'Ethio Telecom collection'),
    ('JL-2026-09-001-C', 'JE-2026-09-001', 'AC-2100', '2100', 'Accounts Receivable',    0.00,     60000.00,  'Ethio Telecom collection'),
    -- JE-2026-09-002: Dr AP 60,000 / Cr Bank 60,000
    ('JL-2026-09-002-D', 'JE-2026-09-002', 'AC-2000', '2000', 'Accounts Payable',       60000.00, 0.00,      'Acme Supplies payment'),
    ('JL-2026-09-002-C', 'JE-2026-09-002', 'AC-1010', '1010', 'Bank - Operating',       0.00,     60000.00,  'Acme Supplies payment'),
    -- JE-2026-09-003: Dr AR 150,000 / Cr Sales Revenue 150,000
    ('JL-2026-09-003-D', 'JE-2026-09-003', 'AC-2100', '2100', 'Accounts Receivable',   150000.00, 0.00,      'September credit sales'),
    ('JL-2026-09-003-C', 'JE-2026-09-003', 'AC-4000', '4000', 'Sales Revenue',          0.00,     150000.00, 'September credit sales'),
    -- JE-2026-09-004: Dr Salaries 54,000 / Cr Payroll Bank 54,000
    ('JL-2026-09-004-D', 'JE-2026-09-004', 'AC-5200', '5200', 'Salaries Expense',       54000.00, 0.00,      'September payroll'),
    ('JL-2026-09-004-C', 'JE-2026-09-004', 'AC-1020', '1020', 'Bank - Payroll',         0.00,     54000.00,  'September payroll'),
    -- JE-2026-09-005: Dr Rent 22,000 / Cr Bank 22,000
    ('JL-2026-09-005-D', 'JE-2026-09-005', 'AC-5300', '5300', 'Rent Expense',           22000.00, 0.00,      'September rent'),
    ('JL-2026-09-005-C', 'JE-2026-09-005', 'AC-1010', '1010', 'Bank - Operating',       0.00,     22000.00,  'September rent'),
    -- JE-2026-09-006: Dr Marketing 15,000 / Cr Bank 15,000
    ('JL-2026-09-006-D', 'JE-2026-09-006', 'AC-5600', '5600', 'Marketing Expense',      15000.00, 0.00,      'September marketing'),
    ('JL-2026-09-006-C', 'JE-2026-09-006', 'AC-1010', '1010', 'Bank - Operating',       0.00,     15000.00,  'September marketing');

-- ---------------------------------------------------------------------------
-- Budgets (FY2026 operating + closed FY2025)
-- ---------------------------------------------------------------------------
INSERT INTO budgets (id, name, budget_period, type, description, category, status, total_budget_amount, start_date, end_date, owner, created_by, created_at, updated_at)
VALUES
    ('BUD-2026-001', 'FY2026 Operating Budget', '2026', 'OPERATING', 'Annual operating plan for fiscal year 2026', 'Operating', 'APPROVED', 2660000.00, DATE '2026-01-01', DATE '2026-12-31', 'Finance Department', 'general_accountant', '2026-01-01T09:00:00Z', '2026-01-05T10:00:00Z'),
    ('BUD-2025-001', 'FY2025 Operating Budget', '2025', 'OPERATING', 'Annual operating plan for fiscal year 2025', 'Operating', 'CLOSED',   2200000.00, DATE '2025-01-01', DATE '2025-12-31', 'Finance Department', 'general_accountant', '2025-01-01T09:00:00Z', '2025-12-31T17:00:00Z');

INSERT INTO budget_lines (id, budget_id, account_id, account_code, account_name, allocated_amount, draft_amount, posted_amount, paid_amount)
VALUES
    -- FY2026
    ('BL-2026-001', 'BUD-2026-001', 'AC-5100', '5100', 'Cost of Goods Sold',        1200000.00, 0.00,  1080000.00, 900000.00),
    ('BL-2026-002', 'BUD-2026-001', 'AC-5200', '5200', 'Salaries Expense',           680000.00, 0.00,   590000.00, 590000.00),
    ('BL-2026-003', 'BUD-2026-001', 'AC-5300', '5300', 'Rent Expense',               280000.00, 0.00,   245000.00, 245000.00),
    ('BL-2026-004', 'BUD-2026-001', 'AC-5400', '5400', 'Utilities Expense',          150000.00, 0.00,   132000.00, 132000.00),
    ('BL-2026-005', 'BUD-2026-001', 'AC-5500', '5500', 'Office Supplies Expense',     90000.00, 0.00,    76000.00,  76000.00),
    ('BL-2026-006', 'BUD-2026-001', 'AC-5600', '5600', 'Marketing Expense',          200000.00, 0.00,   165000.00, 150000.00),
    ('BL-2026-007', 'BUD-2026-001', 'AC-5700', '5700', 'Depreciation Expense',        60000.00, 0.00,    54000.00,     0.00),
    -- FY2025 (closed)
    ('BL-2025-001', 'BUD-2025-001', 'AC-5100', '5100', 'Cost of Goods Sold',        1000000.00, 0.00,   950000.00, 950000.00),
    ('BL-2025-002', 'BUD-2025-001', 'AC-5200', '5200', 'Salaries Expense',           580000.00, 0.00,   560000.00, 560000.00),
    ('BL-2025-003', 'BUD-2025-001', 'AC-5300', '5300', 'Rent Expense',               230000.00, 0.00,   230000.00, 230000.00),
    ('BL-2025-004', 'BUD-2025-001', 'AC-5400', '5400', 'Utilities Expense',          120000.00, 0.00,   118000.00, 118000.00),
    ('BL-2025-005', 'BUD-2025-001', 'AC-5500', '5500', 'Office Supplies Expense',     70000.00, 0.00,    68000.00,  68000.00),
    ('BL-2025-006', 'BUD-2025-001', 'AC-5600', '5600', 'Marketing Expense',          150000.00, 0.00,   145000.00, 140000.00),
    ('BL-2025-007', 'BUD-2025-001', 'AC-5700', '5700', 'Depreciation Expense',        50000.00, 0.00,    48000.00,     0.00);

-- ---------------------------------------------------------------------------
-- Audit Logs
-- ---------------------------------------------------------------------------
INSERT INTO audit_logs (id, entity_type, entity_id, action, performed_by, performed_at, ip_address)
VALUES
    ('AUD-2026-001', 'ACCOUNTING_PERIOD', 'PER-2026-009', 'CREATE', 'general_accountant', '2026-08-25T08:00:00Z', '10.0.0.12'),
    ('AUD-2026-002', 'BUDGET',            'BUD-2026-001', 'CREATE', 'general_accountant', '2026-01-01T09:00:00Z', '10.0.0.12'),
    ('AUD-2026-003', 'BUDGET',            'BUD-2026-001', 'POST',   'finance_manager',    '2026-01-05T10:00:00Z', '10.0.0.15'),
    ('AUD-2026-004', 'JOURNAL',           'JE-2026-09-001', 'POST', 'finance_manager',    '2026-09-14T12:05:00Z', '10.0.0.15'),
    ('AUD-2026-005', 'INVOICE',           'INV-2026-201', 'CREATE', 'ar_officer',        '2026-09-06T09:00:00Z', '10.0.0.22'),
    ('AUD-2026-006', 'INVOICE',           'INV-2026-201', 'APPROVE', 'finance_manager',  '2026-09-07T10:00:00Z', '10.0.0.15'),
    ('AUD-2026-007', 'PAYMENT',           'PMT-2026-001', 'CREATE', 'ar_officer',        '2026-09-14T11:00:00Z', '10.0.0.22'),
    ('AUD-2026-008', 'BANK_ACCOUNT',      'BK-0001',      'UPDATE', 'finance_manager',    '2026-09-23T10:00:00Z', '10.0.0.15'),
    ('AUD-2026-009', 'ACCOUNTING_PERIOD', 'PER-2026-008', 'CLOSE',  'finance_manager',    '2026-09-01T09:00:00Z', '10.0.0.15');

INSERT INTO audit_log_changes (audit_log_id, field_name, change_value)
VALUES
    ('AUD-2026-001', 'period_name', '2026-09'),
    ('AUD-2026-002', 'budget_name', 'FY2026 Operating Budget'),
    ('AUD-2026-005', 'invoice_number', 'INV-2026-201'),
    ('AUD-2026-008', 'current_balance', '1450000.00');