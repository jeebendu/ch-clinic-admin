    ALTER TABLE doctor_additional 
	 ADD COLUMN IF NOT EXISTS medical_course_id INTEGER,
	 ADD COLUMN IF NOT EXISTS medical_university_id INTEGER,
	 ADD COLUMN IF NOT EXISTS college_id INTEGER,
	 ADD CONSTRAINT fk_medical_course FOREIGN KEY (medical_course_id) REFERENCES medical_course(id),
     ADD CONSTRAINT fk_medical_university FOREIGN KEY (medical_university_id) REFERENCES medical_university(id),
     ADD CONSTRAINT fk_medical_college FOREIGN KEY (college_id) REFERENCES medical_college(id);


INSERT INTO "core_state" ("id",  "name","code","country_id", "created_by", "created_time" ) VALUES
(36, 'Telangana','TG', 103,'system', current_timestamp),
(37, 'Uttarakhand', 'UK', 103,'system', CURRENT_TIMESTAMP);

ALTER TABLE medical_college DROP COLUMN IF EXISTS course_id,
DROP COLUMN IF EXISTS state,
ADD COLUMN IF NOT EXISTS state_id INTEGER ,
ADD CONSTRAINT fk_state FOREIGN KEY(state_id) REFERENCES core_state(id); 


