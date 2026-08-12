-- CRM no longer owns users; Auth Service owns auth_users.
-- Drop the temporary bootstrap table created in V1.

DROP TABLE IF EXISTS crm_users;
