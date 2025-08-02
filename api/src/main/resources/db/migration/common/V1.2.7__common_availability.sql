ALTER TABLE doctor_availability ADD COLUMN IF NOT EXISTS release_before INT NOT NULL DEFAULT 0;
