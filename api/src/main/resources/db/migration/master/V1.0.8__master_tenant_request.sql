ALTER TABLE tenant_request ADD COLUMN approval_stage VARCHAR(50);
ALTER TABLE tenant_request ADD COLUMN last_error VARCHAR(255);