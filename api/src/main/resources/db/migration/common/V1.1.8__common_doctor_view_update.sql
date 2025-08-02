-- Drop and create view doctor_branch_map_view
DROP VIEW IF EXISTS doctor_branch_map_view;

CREATE OR REPLACE VIEW doctor_branch_map_view AS
SELECT 
    d.id AS id,
    CONCAT(d.firstname, ' ', d.lastname) AS doctor_name,
    d.gender,
    d.slug,
    d.exp_year AS experience_years,
    d.city,
    d.image,

    -- Add specialization and language IDs
    ARRAY_AGG(DISTINCT s.id) AS specialization_ids,
    ARRAY_AGG(DISTINCT l.id) AS language_ids,

    STRING_AGG(DISTINCT s.name, ', ') AS specialties,
    STRING_AGG(DISTINCT l.name, ', ') AS languages,
    STRING_AGG(DISTINCT c.name, ', ' ORDER BY c.name) AS clinic_names,

    -- Add a search_text field for filtering
    to_tsvector('simple',
        COALESCE(d.firstname, '') || ' ' ||
        COALESCE(d.lastname, '') || ' ' ||
        COALESCE(d.city, '') || ' ' ||
        COALESCE(STRING_AGG(DISTINCT s.name, ' '), '') || ' ' ||
        COALESCE(STRING_AGG(DISTINCT l.name, ' '), '') || ' ' ||
        COALESCE(STRING_AGG(DISTINCT c.name, ' '), '')
    ) AS search_vector,

    (SELECT c2.name
     FROM doctor_branch db2
     JOIN branch b2 ON db2.branch_id = b2.id
     JOIN clinic c2 ON b2.clinic_id = c2.id
     WHERE db2.doctor_id = d.id
     ORDER BY c2.name
     LIMIT 1) AS primary_clinic,

    (COUNT(DISTINCT c.id) - 1) AS additional_clinics_count,

    STRING_AGG(DISTINCT b.name, ', ' ORDER BY b.name) AS all_branches,
    ROUND(AVG(DISTINCT dr.rating), 2) AS average_rating,
    COUNT(DISTINCT dr.id) AS review_count,
    MIN(COALESCE(db.consultation_fee, 500)) AS min_price,
    MAX(COALESCE(db.consultation_fee, 500)) AS max_price,

    d.image AS profile_image,

    COUNT(DISTINCT b.clinic_id) AS clinic_count

FROM doctor d
JOIN doctor_branch db ON d.id = db.doctor_id
JOIN branch b ON db.branch_id = b.id
JOIN clinic c ON b.clinic_id = c.id

LEFT JOIN doctor_specialization ds ON d.id = ds.doctor_id
LEFT JOIN specialization s ON ds.specialization_id = s.id

LEFT JOIN doctor_language dl ON d.id = dl.doctor_id
LEFT JOIN language l ON dl.language_id = l.id

LEFT JOIN doctor_review dr ON d.id = dr.doctor_id

-- Filter only the doctors who are verified, published, and not deleted
WHERE d.is_verified = true
  AND d.is_published_online = true
  AND d.deleted = false

GROUP BY 
    d.id, d.firstname, d.lastname, d.gender, d.exp_year, d.city, d.image, d.slug;





INSERT INTO clinic_facility (name, created_by, created_time)

VALUES 
('Waiting Lounge', 'system', CURRENT_TIMESTAMP),
('Pharmacy In-House', 'system', CURRENT_TIMESTAMP),
('Lab Services', 'system', CURRENT_TIMESTAMP),
('Parking Available', 'system', CURRENT_TIMESTAMP),
('Wheelchair Access', 'system', CURRENT_TIMESTAMP),
('Air Conditioning', 'system', CURRENT_TIMESTAMP),
('Online Consultation Available', 'system', CURRENT_TIMESTAMP),
('Walk-in Consultation Allowed', 'system', CURRENT_TIMESTAMP),
('Drinking Water Facility', 'system', CURRENT_TIMESTAMP),
('Washroom Facility', 'system', CURRENT_TIMESTAMP),
('Baby Care Room', 'system', CURRENT_TIMESTAMP),
('Lift / Elevator Access', 'system', CURRENT_TIMESTAMP),
('CCTV Surveillance', 'system', CURRENT_TIMESTAMP),
('Fire Safety Equipment', 'system', CURRENT_TIMESTAMP),
('Generator / Power Backup', 'system', CURRENT_TIMESTAMP),
('Free Wi-Fi Access', 'system', CURRENT_TIMESTAMP),
('Reception / Helpdesk', 'system', CURRENT_TIMESTAMP),
('Token/Queue Management System', 'system', CURRENT_TIMESTAMP),
('Mobile App / Online Booking', 'system', CURRENT_TIMESTAMP),
('Digital Payment Accepted', 'system', CURRENT_TIMESTAMP),
('TV / Entertainment in Waiting Area', 'system', CURRENT_TIMESTAMP),
('Patient Feedback System', 'system', CURRENT_TIMESTAMP),
('Ambulance Support', 'system', CURRENT_TIMESTAMP),
('Separate Waiting Area for Women', 'system', CURRENT_TIMESTAMP),
('Medical Waste Disposal System', 'system', CURRENT_TIMESTAMP),
('Covid-19 Safety Measures', 'system', CURRENT_TIMESTAMP),
('In-house Nursing Staff', 'system', CURRENT_TIMESTAMP),
('Dedicated Counselling Room', 'system', CURRENT_TIMESTAMP),
('Separate Consultation Rooms', 'system', CURRENT_TIMESTAMP),
('24/7 Security Staff', 'system', CURRENT_TIMESTAMP);

 