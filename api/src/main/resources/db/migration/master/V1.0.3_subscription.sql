ALTER TABLE IF EXISTS subscription_payment_history RENAME TO tenant_subscription;

ALTER TABLE tenant_subscription 
ADD COLUMN end_date TIMESTAMP  NOT NULL DEFAULT NULL,
ADD COLUMN  trail_end_date TIMESTAMP ,
ADD COLUMN  cencelled_date TIMESTAMP ,
ADD COLUMN  start_date TIMESTAMP NOT NULL DEFAULT NULL,
ADD COLUMN  next_billing_date TIMESTAMP  NOT NULL DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tenant_id INTEGER,
ADD CONSTRAINT tenant_subscription_tenant_id  FOREIGN KEY (tenant_id) REFERENCES tenant( id );
