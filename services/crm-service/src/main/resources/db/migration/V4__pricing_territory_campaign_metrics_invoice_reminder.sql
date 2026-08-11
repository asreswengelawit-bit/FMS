-- Pricing rules (idempotent for shared Neon DBs that may already have a stub table)
CREATE TABLE IF NOT EXISTS pricing_rules (
    id                  BIGSERIAL PRIMARY KEY,
    code                VARCHAR(50)  NOT NULL UNIQUE,
    name                VARCHAR(200) NOT NULL,
    rule_type           VARCHAR(40)  NOT NULL,
    value               NUMERIC(15, 4) NOT NULL,
    min_order_amount    NUMERIC(15, 2),
    max_adjustment      NUMERIC(15, 2),
    product_sku         VARCHAR(100),
    priority            INTEGER NOT NULL DEFAULT 100,
    active              BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from          DATE,
    valid_to            DATE,
    description         VARCHAR(1000),
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS name VARCHAR(200);
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS rule_type VARCHAR(40);
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS value NUMERIC(15, 4);
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS min_order_amount NUMERIC(15, 2);
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS max_adjustment NUMERIC(15, 2);
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS product_sku VARCHAR(100);
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 100;
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS valid_from DATE;
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS valid_to DATE;
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS description VARCHAR(1000);
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;
ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

UPDATE pricing_rules SET active = TRUE WHERE active IS NULL;
UPDATE pricing_rules SET priority = 100 WHERE priority IS NULL;

CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON pricing_rules (active);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_sku ON pricing_rules (product_sku);

-- Sales territories
CREATE TABLE IF NOT EXISTS territories (
    id                  BIGSERIAL PRIMARY KEY,
    code                VARCHAR(50)  NOT NULL UNIQUE,
    name                VARCHAR(200) NOT NULL,
    region              VARCHAR(100),
    description         VARCHAR(1000),
    manager_username    VARCHAR(100),
    active              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

ALTER TABLE territories ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE territories ADD COLUMN IF NOT EXISTS name VARCHAR(200);
ALTER TABLE territories ADD COLUMN IF NOT EXISTS region VARCHAR(100);
ALTER TABLE territories ADD COLUMN IF NOT EXISTS description VARCHAR(1000);
ALTER TABLE territories ADD COLUMN IF NOT EXISTS manager_username VARCHAR(100);
ALTER TABLE territories ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE territories ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;
ALTER TABLE territories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

UPDATE territories SET active = TRUE WHERE active IS NULL;

CREATE INDEX IF NOT EXISTS idx_territories_active ON territories (active);
CREATE INDEX IF NOT EXISTS idx_territories_region ON territories (region);

-- Campaign metrics snapshots
CREATE TABLE IF NOT EXISTS campaign_metrics (
    id                  BIGSERIAL PRIMARY KEY,
    campaign_id         BIGINT NOT NULL REFERENCES campaigns (id) ON DELETE CASCADE,
    recorded_at         TIMESTAMP NOT NULL,
    status_snapshot     VARCHAR(40),
    budget              NUMERIC(15, 2),
    expected_revenue    NUMERIC(15, 2),
    actual_revenue      NUMERIC(15, 2),
    expected_leads      INTEGER,
    actual_leads        INTEGER,
    notes               VARCHAR(1000)
);

CREATE INDEX IF NOT EXISTS idx_campaign_metrics_campaign_id ON campaign_metrics (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_recorded_at ON campaign_metrics (recorded_at);

-- Invoice reminder tracking
ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMP;
