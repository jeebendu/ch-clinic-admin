
ALTER TABLE doctor_availability
 DROP COLUMN IF EXISTS branch_id,
 DROP COLUMN IF EXISTS doctor_id,
 ADD COLUMN IF NOT EXISTS doctor_branch_id INTEGER,
 ADD CONSTRAINT fk_doctor_branch FOREIGN KEY (doctor_branch_id) REFERENCES doctor_branch(id);


ALTER TABLE doctor_schedule_break
 DROP COLUMN IF EXISTS branch_id,
 DROP COLUMN IF EXISTS doctor_id,
 ADD COLUMN IF NOT EXISTS doctor_branch_id INTEGER,
 ADD CONSTRAINT fk_doctor_branch FOREIGN KEY (doctor_branch_id) REFERENCES doctor_branch(id);
 
 
 ALTER TABLE doctor_leave
 DROP COLUMN IF EXISTS branch_id,
 DROP COLUMN IF EXISTS doctor_id,
 ADD COLUMN IF NOT EXISTS doctor_branch_id INTEGER,
 ADD CONSTRAINT fk_doctor_branch FOREIGN KEY (doctor_branch_id) REFERENCES doctor_branch(id);
 