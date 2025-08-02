ALTER TABLE tenant_request
  ALTER COLUMN email TYPE VARCHAR(150),
  ALTER COLUMN contact TYPE VARCHAR(15),
  ALTER COLUMN address TYPE VARCHAR(300),
  ALTER COLUMN landmark TYPE VARCHAR(200),
  ALTER COLUMN last_error TYPE VARCHAR(1000);
  
ALTER TABLE tenant
  ALTER COLUMN email TYPE VARCHAR(100),
  ALTER COLUMN contact TYPE VARCHAR(15),
  ALTER COLUMN name TYPE VARCHAR(100),
  ALTER COLUMN title TYPE VARCHAR(100),
  ALTER COLUMN client_url TYPE VARCHAR(2083);  -- max URL length
 
    -- Drop and create view doctor_branch_map_view
DROP VIEW IF EXISTS ai_doctor_search_view;
  -- Drop and create view doctor_branch_map_view
DROP VIEW IF EXISTS ai_clinic_location_view;
  -- Drop and create view doctor_branch_map_view
DROP VIEW IF EXISTS ai_doctor_availability_view;

DROP VIEW IF EXISTS "doctor_clinic_map_view";
  
ALTER TABLE clinic
  ALTER COLUMN email TYPE VARCHAR(100),
  ALTER COLUMN contact TYPE VARCHAR(15),
  ALTER COLUMN alternate_phone TYPE VARCHAR(15),
  ALTER COLUMN emergency_contact TYPE VARCHAR(15),
  ALTER COLUMN address TYPE VARCHAR(300),
  ALTER COLUMN gst TYPE VARCHAR(100),
  ALTER COLUMN pan TYPE VARCHAR(20),
  ALTER COLUMN owner_name TYPE VARCHAR(100),
  ALTER COLUMN license_number TYPE VARCHAR(100),
  ALTER COLUMN license_authority TYPE VARCHAR(100);
  
  
   
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



-- Views

-- AI Doctor Search View (without unsupported indexes)
CREATE OR REPLACE VIEW ai_doctor_search_view AS
SELECT 
    d.id AS doctor_id,
    d.uid AS doctor_uid,
    CONCAT(d.firstname, ' ', d.lastname) AS doctor_name,
    d.firstname,
    d.lastname,
    d.gender,
    d.exp_year,
    d.qualification,
    d.image,
    d.about,
    d.slug,
    d.city AS doctor_city,
    d.pincode AS doctor_pincode,
    b.id AS branch_id,
    b.name AS branch_name,
    b.location AS branch_location,
    b.city AS branch_city,
    b.pincode AS branch_pincode,
    b.latitude,
    b.longitude,
    b.mapurl,
    c.id AS clinic_id,
    c.name AS clinic_name,
    c.email AS clinic_email,
    c.contact AS clinic_contact,
    c.address AS clinic_address,
    cd.name AS district_name,
    COUNT(CASE WHEN ds.status = 'AVAILABLE' AND ds.available_slots > 0 AND ds.date >= CURRENT_DATE THEN 1 END) AS available_slots_count,
    MIN(CASE WHEN ds.status = 'AVAILABLE' AND ds.available_slots > 0 AND ds.date >= CURRENT_DATE THEN ds.date END) AS next_available_date,
    MIN(CASE WHEN ds.status = 'AVAILABLE' AND ds.available_slots > 0 AND ds.date >= CURRENT_DATE THEN ds.start_time END) AS next_available_time,
    db.consultation_fee,
    MIN(COALESCE(dsm.price, 500)) AS min_service_price,
    MAX(COALESCE(dsm.price, 500)) AS max_service_price,
    ARRAY_AGG(DISTINCT s.id) FILTER (WHERE s.id IS NOT NULL) AS specialization_ids,
    STRING_AGG(DISTINCT s.name, ', ') FILTER (WHERE s.name IS NOT NULL) AS specializations,
    ARRAY_AGG(DISTINCT l.id) FILTER (WHERE l.id IS NOT NULL) AS language_ids,
    STRING_AGG(DISTINCT l.name, ', ') FILTER (WHERE l.name IS NOT NULL) AS languages,
    ROUND(AVG(dr.rating), 2) AS avg_rating,
    COUNT(DISTINCT dr.id) AS review_count,
    CASE WHEN COUNT(CASE WHEN ds.status = 'AVAILABLE' AND ds.available_slots > 0 AND ds.date >= CURRENT_DATE THEN 1 END) > 0 THEN TRUE ELSE FALSE END AS is_available
FROM doctor d
JOIN doctor_branch db ON d.id = db.doctor_id
JOIN branch b ON db.branch_id = b.id
JOIN clinic c ON b.clinic_id = c.id
LEFT JOIN core_district cd ON b.district_id = cd.id
LEFT JOIN doctor_slot ds ON db.id = ds.doctor_branch_id
LEFT JOIN doctor_specialization dsp ON d.id = dsp.doctor_id
LEFT JOIN specialization s ON dsp.specialization_id = s.id
LEFT JOIN doctor_language dl ON d.id = dl.doctor_id
LEFT JOIN language l ON dl.language_id = l.id
LEFT JOIN doctor_review dr ON d.id = dr.doctor_id
LEFT JOIN doctor_service_map dsm ON db.id = dsm.doctor_branch_id
WHERE d.is_published_online = TRUE
GROUP BY d.id, d.firstname, d.lastname, d.gender, d.exp_year, d.city, d.image, d.slug,
         b.id, b.name, b.location, b.city, b.pincode, b.latitude, b.longitude, b.mapurl,
         c.id, c.name, c.email, c.contact, c.address, cd.name, db.consultation_fee;

         
         
-- AI Clinic Location View
CREATE OR REPLACE VIEW ai_clinic_location_view AS
SELECT 
    c.id AS clinic_id,
    c.name AS clinic_name,
    c.email AS clinic_email,
    c.contact AS clinic_contact,
    c.address AS clinic_address,
    b.id AS branch_id,
    b.name AS branch_name,
    b.location AS branch_location,
    b.city AS branch_city,
    b.pincode AS branch_pincode,
    b.latitude,
    b.longitude,
    b.mapurl,
    cd.name AS district_name,
    COUNT(DISTINCT csm.service_type_id) AS services_count,
    STRING_AGG(DISTINCT st.name, ', ') AS available_services,
    COUNT(DISTINCT db.doctor_id) AS doctors_count
FROM clinic c
JOIN branch b ON c.id = b.clinic_id
LEFT JOIN core_district cd ON b.district_id = cd.id
LEFT JOIN clinic_service_map csm ON b.id = csm.branch_id
LEFT JOIN service_type st ON csm.service_type_id = st.id
LEFT JOIN doctor_branch db ON b.id = db.branch_id
WHERE b.is_active = TRUE
GROUP BY c.id, c.name, c.email, c.contact, c.address,
         b.id, b.name, b.location, b.city, b.pincode, b.latitude, b.longitude, b.mapurl,
         cd.name;

         
         
-- AI Doctor Availability View
CREATE OR REPLACE VIEW ai_doctor_availability_view AS
SELECT 
    d.id AS doctor_id,
    CONCAT(d.firstname, ' ', d.lastname) AS doctor_name,
    b.id AS branch_id,
    b.name AS branch_name,
    b.city AS branch_city,
    b.location AS branch_location,
    c.name AS clinic_name,
    ds.id AS slot_id,
    ds.date AS slot_date,
    ds.start_time,
    ds.end_time,
    ds.available_slots,
    ds.duration,
    ds.status AS slot_status,
    ds.slot_type,
    db.consultation_fee,
    EXTRACT(DOW FROM ds.date) AS day_of_week,
    CASE WHEN ds.date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' THEN TRUE ELSE FALSE END AS is_next_week
FROM doctor d
JOIN doctor_branch db ON d.id = db.doctor_id
JOIN branch b ON db.branch_id = b.id
JOIN clinic c ON b.clinic_id = c.id
JOIN doctor_slot ds ON db.id = ds.doctor_branch_id
WHERE d.is_published_online = TRUE
  AND ds.status = 'AVAILABLE'
  AND ds.available_slots > 0
  AND ds.date >= CURRENT_DATE
ORDER BY d.id, b.id, ds.date, ds.start_time;