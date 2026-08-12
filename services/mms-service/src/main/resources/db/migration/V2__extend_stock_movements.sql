-- Transfers are recorded as two TR rows, one per warehouse. counterparty_warehouse_id
-- links each leg to the other side so a single row says where the stock came from or
-- went to. reversal_of_id points a correction row at the movement it cancels.
--
-- Columns and their constraints are added as separate statements: H2 in PostgreSQL
-- mode, which the test profile runs on, does not reliably accept an inline REFERENCES
-- clause inside ALTER TABLE ... ADD COLUMN.

ALTER TABLE stock_movements ADD COLUMN counterparty_warehouse_id VARCHAR(50);

ALTER TABLE stock_movements ADD COLUMN reversal_of_id VARCHAR(50);

ALTER TABLE stock_movements
    ADD CONSTRAINT fk_movements_counterparty_warehouse
    FOREIGN KEY (counterparty_warehouse_id) REFERENCES warehouses(id);

ALTER TABLE stock_movements
    ADD CONSTRAINT fk_movements_reversal_of
    FOREIGN KEY (reversal_of_id) REFERENCES stock_movements(id);

-- A movement may be reversed at most once. Enforced by the database rather than by a
-- read-then-write check, which two concurrent reversals could both pass.
CREATE UNIQUE INDEX uk_movements_reversal_of ON stock_movements(reversal_of_id);

CREATE INDEX idx_movements_warehouse_date ON stock_movements(warehouse_id, movement_date);
