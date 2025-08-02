-- Active: 1744056660070@@127.0.0.1@5432@clinichub_care@master

INSERT INTO "core_modules" ("id", "name", "parent_id", "created_by", "created_time") VALUES
	(1, 'Dashboard', '0', 'system', current_timestamp),
	(2, 'Dashboard 1', '1', 'system', current_timestamp),
	(3, 'Dashboard 2', '1', 'system', current_timestamp),
	(4, 'dashboard-patient', '0', 'system', current_timestamp),
	(5, 'dashboard-doctor', '0', 'system', current_timestamp),
	(6, 'appointment', '0', 'system', current_timestamp),
	(7, 'patients', '0', 'system', current_timestamp),
	(8, 'users', '0', 'system', current_timestamp),
	(9, 'branch', '0', 'system', current_timestamp),
	(10, 'doctor', '0', 'system', current_timestamp),
	(11, 'catalog', '0', 'system', current_timestamp),
	(12, 'expense', '0', 'system', current_timestamp),
	(13, 'payment', '0', 'system', current_timestamp),
	(14, 'config', '0', 'system', current_timestamp),
	(15, 'sales', '0', 'system', current_timestamp),
	(16, 'dashboard-staff', '0', 'system', current_timestamp),
	(17, 'purchase', '0', 'system', current_timestamp),
	(18, 'sequense', '0', 'system', current_timestamp),
	(19, 'audiogram', '7', 'system', current_timestamp),
    (20, 'Enquiry', '7', 'system', current_timestamp);



INSERT INTO "payment_type" ("id", "name", "created_by", "created_time") VALUES
	(1, 'Cash', 'system', current_timestamp),
	(2, 'UPI', 'system', current_timestamp),
	(3, 'Cheque', 'system', current_timestamp),
	(4, 'Bank Transfer', 'system', current_timestamp);


INSERT INTO "role" ("id", "name", "is_active", "is_display", "is_default", "description", "created_by", "created_time" ) VALUES
	(1, 'Admin', TRUE, TRUE, TRUE, 'Admin', 'system', current_timestamp),
	(2, 'Doctor', TRUE, TRUE, TRUE, 'Doctor', 'system', current_timestamp),
	(3, 'Patient', TRUE, FALSE, TRUE, 'Patient','system', current_timestamp),
	(4, 'Staff', TRUE, TRUE, TRUE, 'Staff', 'system', current_timestamp),
	(5, 'LabAssistance', TRUE, TRUE, TRUE, 'Staff', 'system', current_timestamp);

INSERT INTO "role_permission" ("id", "role_id", "module_id", "_read", "_write", "upload", "print", "created_by", "created_time") VALUES
	(1, 1, 1, TRUE, TRUE, TRUE, TRUE,'system', current_timestamp),
	(2, 1, 2, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(3, 1, 3, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(4, 1, 9, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(5, 1, 10, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(6, 1, 11, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(7, 1, 12, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(8, 1, 13, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(9, 1, 8, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(10, 1, 7, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(11, 1, 14, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(12, 4, 1, FALSE, FALSE, FALSE, TRUE, 'system', current_timestamp),
	(13, 4, 12, TRUE, FALSE, FALSE, TRUE, 'system', current_timestamp),
	(14, 4, 7, TRUE, FALSE, FALSE, TRUE, 'system', current_timestamp),
	(15, 2, 5, TRUE, FALSE, FALSE, FALSE, 'system', current_timestamp),
	(16, 2, 7, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(18, 1, 15, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(19, 4, 16, TRUE, FALSE, FALSE, TRUE, 'system', current_timestamp),
	(20, 1, 17, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp),
	(21, 1, 18, TRUE, TRUE, TRUE, TRUE, 'system', current_timestamp);


INSERT INTO "core_relationship" ("id", "name", "created_by", "created_time" ) VALUES
	(1, 'Wife', 'system', current_timestamp),
	(2, 'Son', 'system', current_timestamp),
	(3, 'Other', 'system', current_timestamp),
	(4, 'Self', 'system', current_timestamp),
	(5, 'Father', 'system', current_timestamp),
	(6, 'Mother', 'system', current_timestamp),
	(7, 'Daughter', 'system', current_timestamp),
	(8, 'Uncle', 'system', current_timestamp),
	(9, 'Relative', 'system', current_timestamp);



INSERT INTO "core_source" ( "name", "created_by", "created_time") VALUES
	( 'PATIENT REFFERAL', 'system', current_timestamp),
	( 'Hoarding', 'system', current_timestamp),
	( 'DR REFFERAL', 'system', current_timestamp),
	( 'HOSPITAL', 'system', current_timestamp),
	( 'JUSTDIAL', 'system', current_timestamp),
	( 'GOOGLE', 'system', current_timestamp),
	( 'HEAR.COM', 'system', current_timestamp),
	( 'Self', 'system', current_timestamp),
	( 'Other', 'system', current_timestamp);
	

INSERT INTO "appointment_visit_type" ( "name", "created_by", "created_time") VALUES
( 'General', 'system', CURRENT_TIMESTAMP),
( 'Follow-up', 'system', CURRENT_TIMESTAMP),
( 'Direct visit', 'system', CURRENT_TIMESTAMP),
( 'Consultation', 'system', CURRENT_TIMESTAMP);


INSERT INTO "appointment_type" ( "name", "created_by", "created_time") VALUES
( 'Video Call', 'system', CURRENT_TIMESTAMP),
( 'Audio Call', 'system', CURRENT_TIMESTAMP),
( 'Chat', 'system', CURRENT_TIMESTAMP),
( 'Direct visit', 'system', CURRENT_TIMESTAMP);



INSERT INTO "specialization" ("name", "icon", "created_by", "created_time", "is_active")
VALUES
('Cardiology', 'fa-heart', 'system', CURRENT_TIMESTAMP, TRUE),
('Dermatology', 'fa-skin', 'system', CURRENT_TIMESTAMP, TRUE),
('Neurology', 'fa-brain', 'system', CURRENT_TIMESTAMP, TRUE),
('Orthopedics', 'fa-bone', 'system', CURRENT_TIMESTAMP, TRUE),
('Pediatrics', 'fa-baby', 'system', CURRENT_TIMESTAMP, TRUE),
('Radiology', 'fa-x-ray', 'system', CURRENT_TIMESTAMP, TRUE),
('Psychiatry', 'fa-head-side-brain', 'system', CURRENT_TIMESTAMP, TRUE),
('Gastroenterology', 'fa-tooth', 'system', CURRENT_TIMESTAMP, TRUE),
('Urology', 'fa-blind', 'system', CURRENT_TIMESTAMP, TRUE),
('Obstetrics & Gynecology', 'fa-female', 'system', CURRENT_TIMESTAMP, TRUE),
('Ophthalmology', 'fa-eye', 'system', CURRENT_TIMESTAMP, TRUE),
('Anesthesiology', 'fa-heartbeat', 'system', CURRENT_TIMESTAMP, TRUE),
('Endocrinology', 'fa-cogs', 'system', CURRENT_TIMESTAMP, TRUE),
('Oncology', 'fa-ribbon', 'system', CURRENT_TIMESTAMP, TRUE),
('General Surgery', 'fa-scalpel', 'system', CURRENT_TIMESTAMP, TRUE),
('Allergy & Immunology', 'fa-allergies', 'system', CURRENT_TIMESTAMP, TRUE),
('Hematology', 'fa-blood-drop', 'system', CURRENT_TIMESTAMP, TRUE),
('Infectious Disease', 'fa-virus', 'system', CURRENT_TIMESTAMP, TRUE),
('Pulmonology', 'fa-lungs', 'system', CURRENT_TIMESTAMP, TRUE),
('Rheumatology', 'fa-handshake', 'system', CURRENT_TIMESTAMP, TRUE),
('Geriatrics', 'fa-elderly', 'system', CURRENT_TIMESTAMP, TRUE),
('Chiropractic', 'fa-spine', 'system', CURRENT_TIMESTAMP, TRUE),
('Plastic Surgery', 'fa-cogs', 'system', CURRENT_TIMESTAMP, TRUE),
('Sports Medicine', 'fa-basketball-ball', 'system', CURRENT_TIMESTAMP, TRUE),
('Nephrology', 'fa-kidney', 'system', CURRENT_TIMESTAMP, TRUE),
('Emergency Medicine', 'fa-ambulance', 'system', CURRENT_TIMESTAMP, TRUE),
('Pathology', 'fa-vials', 'system', CURRENT_TIMESTAMP, TRUE),
('Pain Management', 'fa-syringe', 'system', CURRENT_TIMESTAMP, TRUE),
('Vascular Surgery', 'fa-heartbeat', 'system', CURRENT_TIMESTAMP, TRUE),
('Plastic & Reconstructive Surgery', 'fa-wrench', 'system', CURRENT_TIMESTAMP, TRUE),
('Nutrition/Dietetics', 'fa-apple-alt', 'system', CURRENT_TIMESTAMP, TRUE),
('Speech Therapy', 'fa-volume-up', 'system', CURRENT_TIMESTAMP, TRUE),
('Occupational Therapy', 'fa-hand-paper', 'system', CURRENT_TIMESTAMP, TRUE),
('Palliative Care', 'fa-clipboard-list', 'system', CURRENT_TIMESTAMP, TRUE),
('Genetics', 'fa-dna', 'system', CURRENT_TIMESTAMP, TRUE),
('Addiction Medicine', 'fa-prescription-bottle-alt', 'system', CURRENT_TIMESTAMP, TRUE),
('Hospitalist', 'fa-hospital', 'system', CURRENT_TIMESTAMP, TRUE),
('Sleep Medicine', 'fa-bed', 'system', CURRENT_TIMESTAMP, TRUE);



INSERT INTO "medical_council" ("name", "created_by", "created_time")
VALUES
('Andhra Pradesh Medical Council', 'system', CURRENT_TIMESTAMP),
('Arunachal Pradesh Medical Council', 'system', CURRENT_TIMESTAMP),
('Assam Medical Council', 'system', CURRENT_TIMESTAMP),
('Bihar Medical Council', 'system', CURRENT_TIMESTAMP),
('Chhattisgarh Medical Council', 'system', CURRENT_TIMESTAMP),
('Delhi Medical Council', 'system', CURRENT_TIMESTAMP),
('Goa Medical Council', 'system', CURRENT_TIMESTAMP),
('Gujarat Medical Council', 'system', CURRENT_TIMESTAMP),
('Haryana Medical Council', 'system', CURRENT_TIMESTAMP),
('Himachal Pradesh Medical Council', 'system', CURRENT_TIMESTAMP),
('J&K Medical Council', 'system', CURRENT_TIMESTAMP),
('Jharkhand Medical Council', 'system', CURRENT_TIMESTAMP),
('Karnataka Medical Council', 'system', CURRENT_TIMESTAMP),
('Travancore-Cochin Medical Councils', 'system', CURRENT_TIMESTAMP),
('Madhya Pradesh Medical Council', 'system', CURRENT_TIMESTAMP),
('Maharashtra Medical Council', 'system', CURRENT_TIMESTAMP),
('Manipur Medical Council', 'system', CURRENT_TIMESTAMP),
('Meghalaya Medical Council', 'system', CURRENT_TIMESTAMP),
('Mizoram Medical Council', 'system', CURRENT_TIMESTAMP),
('Nagaland Medical Council', 'system', CURRENT_TIMESTAMP),
('Odisha Council of Medical Registration', 'system', CURRENT_TIMESTAMP),
('Punjab Medical Council', 'system', CURRENT_TIMESTAMP),
('Rajasthan Medical Council', 'system', CURRENT_TIMESTAMP),
('Sikkim Medical Council', 'system', CURRENT_TIMESTAMP),
('Tamil Nadu Medical Council', 'system', CURRENT_TIMESTAMP),
('Telangana State Medical Council', 'system', CURRENT_TIMESTAMP),
('Tripura State Medical Council', 'system', CURRENT_TIMESTAMP),
('Uttar Pradesh Medical Council', 'system', CURRENT_TIMESTAMP),
('Uttarakhand Medical Council', 'system', CURRENT_TIMESTAMP),
('West Bengal Medical Council', 'system', CURRENT_TIMESTAMP),
('Pondicherry Medical Council', 'system', CURRENT_TIMESTAMP);


	