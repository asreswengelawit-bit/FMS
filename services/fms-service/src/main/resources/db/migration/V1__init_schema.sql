-- FMS Service initial schema
-- Postgres dialect; keys are VARCHAR(50) UUIDs created at the application layer.

-- Chart of Accounts
CREATE TABLE coa_accounts (
    id                VARCHAR(50)  PRIMARY KEY,
    code              VARCHAR(255) NOT NULL UNIQUE,
    name              VARCHAR(255) NOT NULL,
    type              VARCHAR(20)  NOT NULL,
    normal_balance    VARCHAR(10)  NOT NULL,
    parent_account_id VARCHAR(50),
    posting_allowed   BOOLEAN      NOT NULL DEFAULT TRUE,
    description       VARCHAR(255),
    status            VARCHAR(20)  NOT NULL,
    balance           NUMERIC(20,2) NOT NULL DEFAULT 0,
    created_at        TIMESTAMP    NOT NULL,
    created_by        VARCHAR(100),
    updated_at        TIMESTAMP,
    updated_by        VARCHAR(100)
);

-- Accounting Periods
CREATE TABLE accounting_periods (
    id          VARCHAR(50) PRIMARY KEY,
    period_name VARCHAR(20)  NOT NULL UNIQUE,
    start_date  DATE         NOT NULL,
    end_date    DATE         NOT NULL,
    status      VARCHAR(20)  NOT NULL,
    opened_by   VARCHAR(100),
    closed_by   VARCHAR(100),
    opened_at   TIMESTAMP    NOT NULL,
    closed_at   TIMESTAMP,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP
);

-- Journal Entries
CREATE TABLE journal_entries (
    id                    VARCHAR(50)  PRIMARY KEY,
    period_id             VARCHAR(50)  NOT NULL,
    period_name           VARCHAR(20),
    description           VARCHAR(255) NOT NULL,
    status                VARCHAR(20)  NOT NULL,
    created_by            VARCHAR(100),
    approved_by           VARCHAR(100),
    posted_at             TIMESTAMP,
    created_at            TIMESTAMP    NOT NULL,
    updated_at            TIMESTAMP,
    total_debit           NUMERIC(20,2) NOT NULL DEFAULT 0,
    total_credit          NUMERIC(20,2) NOT NULL DEFAULT 0,
    reversal_of_journal_id VARCHAR(50),
    is_reversal           BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE journal_lines (
    id            VARCHAR(50)  PRIMARY KEY,
    journal_id    VARCHAR(50)  NOT NULL REFERENCES journal_entries(id),
    account_id    VARCHAR(50)  NOT NULL,
    account_code  VARCHAR(50),
    account_name  VARCHAR(255),
    debit_amount  NUMERIC(20,2) NOT NULL DEFAULT 0,
    credit_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
    description   VARCHAR(255)
);
CREATE INDEX idx_journal_lines_journal ON journal_lines(journal_id);
CREATE INDEX idx_journal_lines_account ON journal_lines(account_id);

-- Invoices (AP and AR)
CREATE TABLE invoices (
    id                    VARCHAR(50)  PRIMARY KEY,
    invoice_number        VARCHAR(255) NOT NULL UNIQUE,
    invoice_type          VARCHAR(20)  NOT NULL,
    party_name            VARCHAR(255) NOT NULL,
    period_id             VARCHAR(50)  NOT NULL,
    period_name           VARCHAR(20),
    issue_date            DATE         NOT NULL,
    due_date              DATE,
    status                VARCHAR(20)  NOT NULL,
    total_amount          NUMERIC(20,2) NOT NULL DEFAULT 0,
    paid_amount           NUMERIC(20,2) NOT NULL DEFAULT 0,
    remaining_balance     NUMERIC(20,2) NOT NULL DEFAULT 0,
    control_account_id    VARCHAR(50),
    control_account_code  VARCHAR(50),
    control_account_name  VARCHAR(255),
    vendor_id             VARCHAR(50),
    vendor_code           VARCHAR(50),
    customer_id           VARCHAR(50),
    customer_code         VARCHAR(50),
    journal_entry_id      VARCHAR(50),
    created_by            VARCHAR(100),
    approved_by           VARCHAR(100),
    created_at            TIMESTAMP    NOT NULL,
    updated_at            TIMESTAMP
);
CREATE INDEX idx_invoices_period ON invoices(period_id);
CREATE INDEX idx_invoices_vendor ON invoices(vendor_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);

CREATE TABLE invoice_lines (
    id           VARCHAR(50)  PRIMARY KEY,
    invoice_id   VARCHAR(50)  NOT NULL REFERENCES invoices(id),
    account_id   VARCHAR(50)  NOT NULL,
    account_code VARCHAR(50),
    account_name VARCHAR(255),
    description  VARCHAR(255),
    quantity     NUMERIC(19,2) NOT NULL DEFAULT 1,
    unit_price   NUMERIC(20,2) NOT NULL DEFAULT 0,
    total_price  NUMERIC(20,2) NOT NULL DEFAULT 0
);
CREATE INDEX idx_invoice_lines_invoice ON invoice_lines(invoice_id);

-- Payments / Receipts
CREATE TABLE payments (
    id                    VARCHAR(50)  PRIMARY KEY,
    payment_number        VARCHAR(255) NOT NULL UNIQUE,
    payment_type          VARCHAR(20)  NOT NULL,
    party_name            VARCHAR(255),
    period_id             VARCHAR(50)  NOT NULL,
    period_name           VARCHAR(20),
    payment_date          DATE         NOT NULL,
    amount                NUMERIC(20,2) NOT NULL DEFAULT 0,
    status                VARCHAR(20)  NOT NULL,
    payment_method        VARCHAR(50),
    reference_number      VARCHAR(100),
    control_account_id    VARCHAR(50),
    control_account_code  VARCHAR(50),
    control_account_name  VARCHAR(255),
    invoice_id            VARCHAR(50),
    invoice_number        VARCHAR(100),
    journal_entry_id      VARCHAR(50),
    related_entity_id     VARCHAR(50),
    related_entity_code   VARCHAR(50),
    notes                 VARCHAR(500),
    created_by            VARCHAR(100),
    approved_by           VARCHAR(100),
    created_at            TIMESTAMP    NOT NULL,
    updated_at            TIMESTAMP
);
CREATE INDEX idx_payments_period ON payments(period_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);

-- Budgets
CREATE TABLE budgets (
    id                   VARCHAR(50)  PRIMARY KEY,
    name                 VARCHAR(255) NOT NULL,
    budget_period        VARCHAR(20),
    type                 VARCHAR(20),
    description          VARCHAR(255),
    category             VARCHAR(255),
    status               VARCHAR(20)  NOT NULL,
    total_budget_amount  NUMERIC(20,2) NOT NULL DEFAULT 0,
    start_date           DATE,
    end_date             DATE,
    owner                VARCHAR(255),
    created_by           VARCHAR(100),
    created_at           TIMESTAMP    NOT NULL,
    updated_at           TIMESTAMP
);

CREATE TABLE budget_lines (
    id               VARCHAR(50)  PRIMARY KEY,
    budget_id        VARCHAR(50)  NOT NULL REFERENCES budgets(id),
    account_id       VARCHAR(50)  NOT NULL,
    account_code     VARCHAR(50),
    account_name     VARCHAR(255),
    allocated_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
    draft_amount     NUMERIC(20,2) NOT NULL DEFAULT 0,
    posted_amount    NUMERIC(20,2) NOT NULL DEFAULT 0,
    paid_amount      NUMERIC(20,2) NOT NULL DEFAULT 0
);
CREATE INDEX idx_budget_lines_budget ON budget_lines(budget_id);

-- Vendors
CREATE TABLE vendors (
    id             VARCHAR(50)  PRIMARY KEY,
    vendor_code    VARCHAR(50)  NOT NULL UNIQUE,
    vendor_name    VARCHAR(255) NOT NULL,
    contact_name   VARCHAR(255),
    email          VARCHAR(255),
    phone          VARCHAR(100),
    address        VARCHAR(500),
    tax_id         VARCHAR(100),
    payment_terms  VARCHAR(255),
    currency       VARCHAR(10),
    status         VARCHAR(20)  NOT NULL,
    ap_balance     NUMERIC(20,2) NOT NULL DEFAULT 0,
    created_by     VARCHAR(100),
    created_at     TIMESTAMP    NOT NULL,
    updated_at     TIMESTAMP
);

-- Customers
CREATE TABLE customers (
    id             VARCHAR(50)  PRIMARY KEY,
    customer_code  VARCHAR(50)  NOT NULL UNIQUE,
    customer_name  VARCHAR(255) NOT NULL,
    contact_name   VARCHAR(255),
    email          VARCHAR(255),
    phone          VARCHAR(100),
    address        VARCHAR(500),
    tax_id         VARCHAR(100),
    payment_terms  VARCHAR(255),
    currency       VARCHAR(10),
    status         VARCHAR(20)  NOT NULL,
    ar_balance     NUMERIC(20,2) NOT NULL DEFAULT 0,
    created_by     VARCHAR(100),
    created_at     TIMESTAMP    NOT NULL,
    updated_at     TIMESTAMP
);

-- Bank Accounts
CREATE TABLE bank_accounts (
    id              VARCHAR(50)  PRIMARY KEY,
    account_name    VARCHAR(255) NOT NULL,
    account_number  VARCHAR(255) NOT NULL,
    bank_name       VARCHAR(255),
    branch          VARCHAR(255),
    currency        VARCHAR(10),
    opening_balance NUMERIC(20,2) NOT NULL DEFAULT 0,
    current_balance NUMERIC(20,2) NOT NULL DEFAULT 0,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_by      VARCHAR(100),
    created_at      TIMESTAMP    NOT NULL,
    updated_at      TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
    id           VARCHAR(50)  PRIMARY KEY,
    entity_type  VARCHAR(255) NOT NULL,
    entity_id    VARCHAR(50)  NOT NULL,
    action       VARCHAR(20)  NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    performed_at TIMESTAMP    NOT NULL,
    ip_address   VARCHAR(45)
);

CREATE TABLE audit_log_changes (
    audit_log_id VARCHAR(50) NOT NULL REFERENCES audit_logs(id),
    field_name   VARCHAR(255) NOT NULL,
    change_value VARCHAR(2000)
);
CREATE INDEX idx_audit_changes_log ON audit_log_changes(audit_log_id);

-- Bank Statement Lines (reconciliation)
CREATE TABLE bank_statement_lines (
    id                    VARCHAR(50)    PRIMARY KEY,
    bank_account_id       VARCHAR(50)    NOT NULL,
    transaction_date      DATE           NOT NULL,
    description           VARCHAR(255)   NOT NULL,
    amount                NUMERIC(20,2)  NOT NULL DEFAULT 0,
    type                  VARCHAR(10)    NOT NULL,
    reference             VARCHAR(255),
    reconciliation_status VARCHAR(20)    NOT NULL DEFAULT 'UNMATCHED',
    matched_payment_id    VARCHAR(50),
    created_at            TIMESTAMP      NOT NULL
);
CREATE INDEX idx_bank_statement_lines_bank ON bank_statement_lines(bank_account_id);

-- =============================================================================
-- Seed data: a default open accounting period and a starter chart of accounts.
-- =============================================================================
INSERT INTO accounting_periods (id, period_name, start_date, end_date, status, opened_by, opened_at, created_at)
VALUES ('PER-2026-001', '2026-01', DATE '2026-01-01', DATE '2026-01-31', 'OPEN', 'system', NOW(), NOW());

-- Bank / Cash / AP / AR accounts so payment & invoice posting works out of the box.
INSERT INTO coa_accounts (id, code, name, type, normal_balance, posting_allowed, status, balance, created_at, created_by)
VALUES
    ('AC-1000',  '1000',  'Cash',                'ASSET',     'DEBIT',  TRUE,  'ACTIVE', 0, NOW(), 'system'),
    ('AC-1010',  '1010',  'Bank - Operating',    'BANK',      'DEBIT',  TRUE,  'ACTIVE', 0, NOW(), 'system'),
    ('AC-2000',  '2000',  'Accounts Payable',    'LIABILITY', 'CREDIT', TRUE,  'ACTIVE', 0, NOW(), 'system'),
    ('AC-2100',  '2100',  'Accounts Receivable', 'ASSET',     'DEBIT',  TRUE,  'ACTIVE', 0, NOW(), 'system'),
    ('AC-3000',  '3000',  'Retained Earnings',   'EQUITY',    'CREDIT', FALSE, 'ACTIVE', 0, NOW(), 'system'),
    ('AC-4000',  '4000',  'Revenue',             'REVENUE',   'CREDIT', TRUE,  'ACTIVE', 0, NOW(), 'system'),
    ('AC-5100',  '5100',  'Cost of Goods Sold',  'EXPENSE',   'DEBIT',  TRUE,  'ACTIVE', 0, NOW(), 'system');

INSERT INTO bank_accounts (id, account_name, account_number, bank_name, branch, currency, opening_balance, current_balance, is_active, created_at)
VALUES ('BK-0001', 'Operating Account', '1010-000-0001', 'Demo Bank', 'Main', 'USD', 0, 0, TRUE, NOW());
