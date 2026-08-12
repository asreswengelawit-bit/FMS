-- Territory mapping on leads and customers
ALTER TABLE crm_leads
    ADD COLUMN IF NOT EXISTS territory_id BIGINT;

ALTER TABLE crm_customers
    ADD COLUMN IF NOT EXISTS territory_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_crm_leads_territory'
    ) THEN
        ALTER TABLE crm_leads
            ADD CONSTRAINT fk_crm_leads_territory
                FOREIGN KEY (territory_id) REFERENCES territories (id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_crm_customers_territory'
    ) THEN
        ALTER TABLE crm_customers
            ADD CONSTRAINT fk_crm_customers_territory
                FOREIGN KEY (territory_id) REFERENCES territories (id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_crm_leads_territory_id ON crm_leads (territory_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_territory_id ON crm_customers (territory_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to ON crm_leads (assigned_to);

-- Round-robin cursor for lead assignment
CREATE TABLE IF NOT EXISTS lead_assignment_cursor (
    id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    next_index      BIGINT NOT NULL DEFAULT 0,
    updated_at      TIMESTAMP
);
