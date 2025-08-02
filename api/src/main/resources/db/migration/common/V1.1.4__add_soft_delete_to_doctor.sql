
-- Add soft delete and globalDoctorId columns to doctor table

ALTER TABLE doctor
ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS global_doctor_id UUID;


-- Create index for deleted column for performance
CREATE INDEX IF NOT EXISTS idx_doctor_deleted ON doctor (deleted);

-- Populate global_doctor_id for existing records
UPDATE doctor SET global_doctor_id = gen_random_uuid() WHERE global_doctor_id IS NULL;



ALTER TABLE appointment
ADD COLUMN IF NOT EXISTS global_appointment_id UUID;
