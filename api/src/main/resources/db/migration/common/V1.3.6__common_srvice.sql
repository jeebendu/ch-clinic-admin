-- Revert for doctor_availability
ALTER TABLE clinic_service_map
  DROP COLUMN IF EXISTS price;


ALTER TABLE service_type 
ADD COLUMN IF NOT EXISTS global_id UUID DEFAULT gen_random_uuid();
