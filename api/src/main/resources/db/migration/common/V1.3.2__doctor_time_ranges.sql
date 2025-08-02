
-- Add release_time column to doctor_availability table
ALTER TABLE doctor_availability ADD COLUMN IF NOT EXISTS release_time TIME DEFAULT '09:00:00';

-- Create doctor_time_ranges table
CREATE TABLE IF NOT EXISTS doctor_time_ranges (
    id SERIAL PRIMARY KEY,
    availability_id INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration INTEGER NOT NULL DEFAULT 15,
    slot_quantity INTEGER NOT NULL DEFAULT 1,
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255) NULL,
    modified_time TIMESTAMP NULL,
    CONSTRAINT doctor_time_ranges_availability_id_fkey 
        FOREIGN KEY (availability_id) 
        REFERENCES doctor_availability (id) 
        ON UPDATE CASCADE ON DELETE CASCADE
);


-- Remove old columns from doctor_availability (commented out for safety - uncomment after testing)
ALTER TABLE doctor_availability DROP COLUMN IF EXISTS start_time;
ALTER TABLE doctor_availability DROP COLUMN IF EXISTS end_time;  
ALTER TABLE doctor_availability DROP COLUMN IF EXISTS slot_duration;
ALTER TABLE doctor_availability DROP COLUMN IF EXISTS slot_quantity;
