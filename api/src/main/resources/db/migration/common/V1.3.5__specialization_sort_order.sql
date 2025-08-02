ALTER TABLE specialization
ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE specialization
ADD COLUMN IF NOT EXISTS global_id UUID NOT NULL DEFAULT gen_random_uuid();

-- Most popular to less popular
UPDATE specialization SET sort_order = 1 WHERE name = 'General Surgery';
UPDATE specialization SET sort_order = 2 WHERE name = 'Cardiology';
UPDATE specialization SET sort_order = 3 WHERE name = 'Pediatrics';
UPDATE specialization SET sort_order = 4 WHERE name = 'Orthopedics';
UPDATE specialization SET sort_order = 5 WHERE name = 'Dermatology';
UPDATE specialization SET sort_order = 6 WHERE name = 'Gynecology';
UPDATE specialization SET sort_order = 7 WHERE name = 'Obstetrics & Gynecology';
UPDATE specialization SET sort_order = 8 WHERE name = 'Neurology';
UPDATE specialization SET sort_order = 9 WHERE name = 'Gastroenterology';
UPDATE specialization SET sort_order = 10 WHERE name = 'Psychiatry';
UPDATE specialization SET sort_order = 11 WHERE name = 'Pulmonology';
UPDATE specialization SET sort_order = 12 WHERE name = 'Radiology';
UPDATE specialization SET sort_order = 13 WHERE name = 'Endocrinology';
UPDATE specialization SET sort_order = 14 WHERE name = 'Urology';
UPDATE specialization SET sort_order = 15 WHERE name = 'Ophthalmology';
UPDATE specialization SET sort_order = 16 WHERE name = 'Oncology';
UPDATE specialization SET sort_order = 17 WHERE name = 'Anesthesiology';
UPDATE specialization SET sort_order = 18 WHERE name = 'Nephrology';
UPDATE specialization SET sort_order = 19 WHERE name = 'Allergy & Immunology';
UPDATE specialization SET sort_order = 20 WHERE name = 'Emergency Medicine';
UPDATE specialization SET sort_order = 21 WHERE name = 'Pain Management';
UPDATE specialization SET sort_order = 22 WHERE name = 'Hematology';
UPDATE specialization SET sort_order = 23 WHERE name = 'Rheumatology';
UPDATE specialization SET sort_order = 24 WHERE name = 'Geriatrics';
UPDATE specialization SET sort_order = 25 WHERE name = 'Pathology';
UPDATE specialization SET sort_order = 26 WHERE name = 'Plastic Surgery';
UPDATE specialization SET sort_order = 27 WHERE name = 'Plastic & Reconstructive Surgery';
UPDATE specialization SET sort_order = 28 WHERE name = 'Sports Medicine';
UPDATE specialization SET sort_order = 29 WHERE name = 'Infectious Disease';
UPDATE specialization SET sort_order = 30 WHERE name = 'Chiropractic';
UPDATE specialization SET sort_order = 31 WHERE name = 'Sleep Medicine';
UPDATE specialization SET sort_order = 32 WHERE name = 'Hospitalist';
UPDATE specialization SET sort_order = 33 WHERE name = 'Nutrition/Dietetics';
UPDATE specialization SET sort_order = 34 WHERE name = 'Palliative Care';
UPDATE specialization SET sort_order = 35 WHERE name = 'Addiction Medicine';
UPDATE specialization SET sort_order = 36 WHERE name = 'Genetics';
UPDATE specialization SET sort_order = 37 WHERE name = 'Speech Therapy';
UPDATE specialization SET sort_order = 38 WHERE name = 'Occupational Therapy';
UPDATE specialization SET sort_order = 39 WHERE name = 'Vascular Surgery';
 