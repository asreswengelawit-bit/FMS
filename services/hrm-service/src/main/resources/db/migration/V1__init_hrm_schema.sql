-- ===========================================================================
-- HRM baseline: the schema this service owns.
--
-- Only hrm-service writes here. Cross-module data is read over /api/v1 or
-- consumed from events — never by querying another module's schema
-- (docs/architecture/database-strategy.md).
--
-- Conventions used by every migration in this folder:
--   * singular snake_case table names, surrogate BIGINT identity PK `id`
--   * natural keys (employee_code, position code, …) get a unique constraint
--   * money is NUMERIC(19,4)
--   * every business table carries created_at / created_by / updated_at / updated_by
--   * FKs stay inside hrm_schema; IDs owned by other modules are plain columns
--
-- Migrations are immutable once merged — fix forward with a new version.
-- Next free version: V12.
-- ===========================================================================

CREATE SCHEMA IF NOT EXISTS hrm_schema;
