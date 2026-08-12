-- Link sales orders to quotations; add SKU on order lines; quotation line items

ALTER TABLE sales_orders
    ADD COLUMN IF NOT EXISTS quotation_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_sales_orders_quotation'
    ) THEN
        ALTER TABLE sales_orders
            ADD CONSTRAINT fk_sales_orders_quotation
                FOREIGN KEY (quotation_id) REFERENCES quotations (id);
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_sales_orders_quotation_id
    ON sales_orders (quotation_id)
    WHERE quotation_id IS NOT NULL;

ALTER TABLE order_items
    ADD COLUMN IF NOT EXISTS sku VARCHAR(100);

CREATE TABLE IF NOT EXISTS quotation_items (
    id              BIGSERIAL PRIMARY KEY,
    item_name       VARCHAR(255) NOT NULL,
    sku             VARCHAR(100),
    description     VARCHAR(1000),
    quantity        INTEGER NOT NULL,
    unit_price      NUMERIC(15, 2) NOT NULL,
    total_price     NUMERIC(15, 2) NOT NULL,
    quotation_id    BIGINT NOT NULL REFERENCES quotations (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON quotation_items (quotation_id);
