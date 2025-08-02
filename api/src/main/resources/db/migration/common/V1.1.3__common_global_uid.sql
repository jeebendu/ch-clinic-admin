-- Enable UUID generation if not already done
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Alter the branch table to add global and tenant references
ALTER TABLE branch
ADD COLUMN global_branch_id UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT uq_global_branch_id UNIQUE (global_branch_id);


