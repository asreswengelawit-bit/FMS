-- CRM baseline schema (PostgreSQL)
-- Compatible with existing Neon databases via IF NOT EXISTS

CREATE TABLE IF NOT EXISTS system_metadata (
    id              BIGSERIAL PRIMARY KEY,
    meta_key        VARCHAR(100) NOT NULL UNIQUE,
    meta_value      VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO system_metadata (meta_key, meta_value)
VALUES ('schema_module', 'crm-backend'), ('schema_version', 'V1')
ON CONFLICT (meta_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS crm_users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role            VARCHAR(50)  NOT NULL
                    CHECK (role IN (
                        'ADMIN', 'HR_USER', 'PROCUREMENT_OFFICER', 'INVENTORY_OFFICER',
                        'SALES_OFFICER', 'FINANCE_OFFICER', 'EMPLOYEE'
                    )),
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crm_customers (
    id                      BIGSERIAL PRIMARY KEY,
    version                 INTEGER,
    created_at              TIMESTAMP,
    created_by              VARCHAR(255),
    updated_at              TIMESTAMP,
    updated_by              VARCHAR(255),
    is_deleted              BOOLEAN DEFAULT FALSE,
    customer_number         VARCHAR(255) NOT NULL UNIQUE,
    customer_type           VARCHAR(255)
                            CHECK (customer_type IN (
                                'GOVERNMENT', 'INDIVIDUAL', 'PRIVATE',
                                'ORGANIZATION', 'NGO', 'INTERNATIONAL'
                            )),
    company_name            VARCHAR(255),
    contact_name            VARCHAR(255),
    contact_title           VARCHAR(255),
    email                   VARCHAR(255) UNIQUE,
    phone                   VARCHAR(255),
    mobile                  VARCHAR(255),
    website                 VARCHAR(255),
    address_line1           VARCHAR(255),
    address_line2           VARCHAR(255),
    city                    VARCHAR(255),
    state                   VARCHAR(255),
    country                 VARCHAR(255),
    postal_code             VARCHAR(255),
    industry                VARCHAR(255),
    employee_count          INTEGER,
    annual_revenue          NUMERIC(38, 2),
    credit_limit            NUMERIC(38, 2),
    current_balance         NUMERIC(38, 2),
    payment_terms           VARCHAR(255),
    status                  VARCHAR(255)
                            CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    data_classification     VARCHAR(255),
    security_clearance      VARCHAR(255),
    customer_priority       VARCHAR(255),
    government_entity       BOOLEAN NOT NULL DEFAULT FALSE,
    department              VARCHAR(255),
    parent_customer_id      BIGINT REFERENCES crm_customers (id)
);

CREATE TABLE IF NOT EXISTS crm_customer_contacts (
    id                      BIGSERIAL PRIMARY KEY,
    customer_id             BIGINT REFERENCES crm_customers (id),
    contact_name            VARCHAR(255),
    contact_title           VARCHAR(255),
    department              VARCHAR(255),
    email                   VARCHAR(255),
    phone                   VARCHAR(255),
    mobile                  VARCHAR(255),
    is_primary              BOOLEAN NOT NULL DEFAULT FALSE,
    is_billing_contact      BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_contact_time  VARCHAR(255),
    notes                   VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS crm_customer_addresses (
    id              BIGSERIAL PRIMARY KEY,
    customer_id     BIGINT REFERENCES crm_customers (id),
    address_type    VARCHAR(255),
    address_line1   VARCHAR(255),
    address_line2   VARCHAR(255),
    city            VARCHAR(255),
    state           VARCHAR(255),
    country         VARCHAR(255),
    postal_code     VARCHAR(255),
    is_default      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS crm_leads (
    id                          BIGSERIAL PRIMARY KEY,
    version                     INTEGER,
    created_at                  TIMESTAMP,
    created_by                  VARCHAR(255),
    updated_at                  TIMESTAMP,
    updated_by                  VARCHAR(255),
    is_deleted                  BOOLEAN DEFAULT FALSE,
    first_name                  VARCHAR(255),
    last_name                   VARCHAR(255),
    middle_name                 VARCHAR(255),
    email                       VARCHAR(255) UNIQUE,
    phone                       VARCHAR(255),
    company                     VARCHAR(255),
    company_size                VARCHAR(255),
    industry                    VARCHAR(255),
    job_title                   VARCHAR(255),
    department                  VARCHAR(255),
    source                      VARCHAR(255)
                                CHECK (source IN (
                                    'WEBSITE', 'REFERRAL', 'COLD_CALL',
                                    'SOCIAL_MEDIA', 'EVENT', 'PARTNER'
                                )),
    source_details              VARCHAR(255),
    status                      VARCHAR(255)
                                CHECK (status IN (
                                    'NEW', 'CONTACTED', 'QUALIFIED',
                                    'UNQUALIFIED', 'LOST', 'CONVERTED'
                                )),
    rating                      VARCHAR(255)
                                CHECK (rating IN ('HOT', 'WARM', 'COLD')),
    lead_score                  INTEGER,
    budget                      NUMERIC(38, 2),
    authority                   VARCHAR(255),
    need                        VARCHAR(255),
    timeline                    VARCHAR(255),
    qualification_score         INTEGER,
    assigned_to                 VARCHAR(255),
    assigned_team               VARCHAR(255),
    campaign_id                 BIGINT,
    preferred_contact_method    VARCHAR(255),
    best_time_to_contact        VARCHAR(255),
    notes                       TEXT,
    internal_notes              TEXT,
    converted_customer_id       BIGINT REFERENCES crm_customers (id),
    converted_opportunity_id    BIGINT,
    converted_at                TIMESTAMP,
    conversion_reason           VARCHAR(255),
    data_classification         VARCHAR(255),
    security_clearance          VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS opportunities (
    id                      BIGSERIAL PRIMARY KEY,
    opportunity_number      VARCHAR(255) NOT NULL UNIQUE,
    opportunity_name        VARCHAR(255) NOT NULL,
    description             VARCHAR(2000),
    lead_id                 BIGINT REFERENCES crm_leads (id),
    customer_id             BIGINT REFERENCES crm_customers (id),
    stage                   VARCHAR(255) NOT NULL
                            CHECK (stage IN (
                                'NEW', 'NEEDS_ANALYSIS', 'QUALIFICATION', 'PROPOSAL',
                                'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'
                            )),
    type                    VARCHAR(255) NOT NULL
                            CHECK (type IN (
                                'NEW_BUSINESS', 'EXISTING_CUSTOMER', 'RENEWAL',
                                'UPSELL', 'CROSS_SELL'
                            )),
    source                  VARCHAR(255)
                            CHECK (source IN (
                                'WEBSITE', 'REFERRAL', 'COLD_CALL',
                                'SOCIAL_MEDIA', 'EVENT', 'PARTNER'
                            )),
    expected_revenue        NUMERIC(15, 2),
    probability             INTEGER,
    expected_close_date     DATE,
    actual_close_date       DATE,
    assigned_to             VARCHAR(255),
    next_step               VARCHAR(1000),
    notes                   VARCHAR(2000),
    active                  BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMP NOT NULL,
    updated_at              TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
    id                  BIGSERIAL PRIMARY KEY,
    campaign_number     VARCHAR(255) NOT NULL UNIQUE,
    campaign_name       VARCHAR(255) NOT NULL,
    description         VARCHAR(2000),
    campaign_type       VARCHAR(255) NOT NULL
                        CHECK (campaign_type IN (
                            'EMAIL', 'SMS', 'SOCIAL_MEDIA', 'SEMINAR', 'WEBINAR',
                            'CONFERENCE', 'WEBSITE', 'REFERRAL', 'ADVERTISEMENT', 'OTHER'
                        )),
    status              VARCHAR(255) NOT NULL
                        CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    budget              NUMERIC(15, 2),
    expected_revenue    NUMERIC(15, 2),
    actual_revenue      NUMERIC(15, 2),
    start_date          DATE,
    end_date            DATE,
    expected_leads      INTEGER,
    actual_leads        INTEGER,
    target_audience     VARCHAR(1000),
    notes               VARCHAR(2000),
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_orders (
    id                  BIGSERIAL PRIMARY KEY,
    order_number        VARCHAR(255) NOT NULL UNIQUE,
    customer_id         BIGINT REFERENCES crm_customers (id),
    opportunity_id      BIGINT REFERENCES opportunities (id),
    status              VARCHAR(255)
                        CHECK (status IN (
                            'DRAFT', 'PENDING', 'APPROVED',
                            'PROCESSING', 'COMPLETED', 'CANCELLED'
                        )),
    type                VARCHAR(255)
                        CHECK (type IN ('SALES', 'SERVICE', 'RENEWAL')),
    order_date          DATE,
    delivery_date       DATE,
    subtotal            NUMERIC(15, 2),
    tax_amount          NUMERIC(15, 2),
    discount_amount     NUMERIC(15, 2),
    total_amount        NUMERIC(15, 2),
    currency            VARCHAR(255),
    notes               VARCHAR(2000),
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id                  BIGSERIAL PRIMARY KEY,
    item_name           VARCHAR(255),
    description         VARCHAR(1000),
    quantity            INTEGER,
    unit_price          NUMERIC(15, 2),
    total_price         NUMERIC(15, 2),
    sales_order_id      BIGINT REFERENCES sales_orders (id)
);

CREATE TABLE IF NOT EXISTS quotations (
    id                  BIGSERIAL PRIMARY KEY,
    quotation_number    VARCHAR(255) NOT NULL UNIQUE,
    customer_id         BIGINT REFERENCES crm_customers (id),
    opportunity_id      BIGINT REFERENCES opportunities (id),
    issue_date          DATE,
    expiry_date         DATE,
    subtotal            NUMERIC(15, 2),
    discount            NUMERIC(15, 2),
    tax                 NUMERIC(15, 2),
    total_amount        NUMERIC(15, 2),
    status              VARCHAR(255)
                        CHECK (status IN (
                            'DRAFT', 'SENT', 'ACCEPTED',
                            'REJECTED', 'EXPIRED', 'CANCELLED'
                        )),
    notes               VARCHAR(2000),
    active              BOOLEAN,
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id                  BIGSERIAL PRIMARY KEY,
    invoice_number      VARCHAR(255) NOT NULL UNIQUE,
    sales_order_id      BIGINT REFERENCES sales_orders (id),
    customer_id         BIGINT REFERENCES crm_customers (id),
    status              VARCHAR(255) NOT NULL
                        CHECK (status IN (
                            'DRAFT', 'PENDING', 'SENT',
                            'PAID', 'OVERDUE', 'CANCELLED'
                        )),
    invoice_date        DATE,
    due_date            DATE,
    subtotal            NUMERIC(15, 2),
    tax_amount          NUMERIC(15, 2),
    discount_amount     NUMERIC(15, 2),
    total_amount        NUMERIC(15, 2),
    paid_amount         NUMERIC(15, 2),
    balance_amount      NUMERIC(15, 2),
    currency            VARCHAR(255),
    notes               VARCHAR(2000),
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id                      BIGSERIAL PRIMARY KEY,
    payment_number          VARCHAR(255) NOT NULL UNIQUE,
    invoice_id              BIGINT NOT NULL REFERENCES invoices (id),
    customer_id             BIGINT NOT NULL REFERENCES crm_customers (id),
    payment_method          VARCHAR(255) NOT NULL
                            CHECK (payment_method IN (
                                'CASH', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT_CARD',
                                'DEBIT_CARD', 'MOBILE_MONEY', 'ONLINE_PAYMENT'
                            )),
    status                  VARCHAR(255) NOT NULL
                            CHECK (status IN (
                                'PENDING', 'PROCESSING', 'COMPLETED',
                                'FAILED', 'CANCELLED', 'REFUNDED'
                            )),
    amount                  NUMERIC(15, 2) NOT NULL,
    payment_date            DATE,
    transaction_reference   VARCHAR(255),
    received_by             VARCHAR(255),
    notes                   VARCHAR(2000),
    created_at              TIMESTAMP NOT NULL,
    updated_at              TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interactions (
    id                      BIGSERIAL PRIMARY KEY,
    interaction_number      VARCHAR(255) NOT NULL UNIQUE,
    customer_id             BIGINT REFERENCES crm_customers (id),
    lead_id                 BIGINT REFERENCES crm_leads (id),
    opportunity_id          BIGINT REFERENCES opportunities (id),
    interaction_type        VARCHAR(255) NOT NULL
                            CHECK (interaction_type IN (
                                'PHONE_CALL', 'EMAIL', 'MEETING', 'VIDEO_CALL', 'SMS',
                                'WHATSAPP', 'FOLLOW_UP', 'SUPPORT', 'DEMO', 'OTHER'
                            )),
    subject                 VARCHAR(255) NOT NULL,
    description             VARCHAR(3000),
    conducted_by            VARCHAR(255),
    contact_person          VARCHAR(255),
    interaction_date        TIMESTAMP,
    next_follow_up_date     TIMESTAMP,
    outcome                 VARCHAR(2000),
    completed               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMP,
    updated_at              TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_segments (
    id                  BIGSERIAL PRIMARY KEY,
    segment_number      VARCHAR(255) NOT NULL UNIQUE,
    segment_name        VARCHAR(255) NOT NULL,
    description         VARCHAR(2000),
    criteria_type       VARCHAR(255) NOT NULL
                        CHECK (criteria_type IN (
                            'CUSTOMER_TYPE', 'INDUSTRY', 'STATUS', 'REGION', 'CAMPAIGN',
                            'REVENUE', 'PURCHASE_FREQUENCY', 'LAST_PURCHASE',
                            'CUSTOMER_VALUE', 'CUSTOM'
                        )),
    criteria_value      VARCHAR(1000),
    active              BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

CREATE TABLE IF NOT EXISTS segment_members (
    id              BIGSERIAL PRIMARY KEY,
    segment_id      BIGINT NOT NULL REFERENCES customer_segments (id),
    customer_id     BIGINT NOT NULL REFERENCES crm_customers (id),
    joined_at       TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_trails (
    id              BIGSERIAL PRIMARY KEY,
    module          VARCHAR(255) NOT NULL
                    CHECK (module IN (
                        'CUSTOMER', 'LEAD', 'OPPORTUNITY', 'INTERACTION', 'CAMPAIGN',
                        'QUOTATION', 'SALES_ORDER', 'INVOICE', 'PAYMENT', 'REPORT',
                        'DASHBOARD', 'ANALYTICS', 'SEGMENT'
                    )),
    action          VARCHAR(255) NOT NULL
                    CHECK (action IN (
                        'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN',
                        'LOGOUT', 'APPROVE', 'REJECT', 'EXPORT'
                    )),
    entity_id       BIGINT NOT NULL,
    entity_name     VARCHAR(100) NOT NULL,
    performed_by    VARCHAR(100) NOT NULL,
    performed_at    TIMESTAMP NOT NULL,
    description     VARCHAR(500),
    ip_address      VARCHAR(45)
);

CREATE INDEX IF NOT EXISTS idx_crm_customers_email ON crm_customers (email);
CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON crm_leads (email);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads (status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON sales_orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices (customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments (invoice_id);
CREATE INDEX IF NOT EXISTS idx_interactions_customer ON interactions (customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_trails_module ON audit_trails (module);
