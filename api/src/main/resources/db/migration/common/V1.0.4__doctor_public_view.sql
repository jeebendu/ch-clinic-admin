
CREATE OR REPLACE VIEW doctor_clinic_map_view AS
SELECT 
     d.id AS doctor_id,
    CONCAT(d.firstname, ' ', d.lastname) AS doctor_name,
    c.id AS clinic_id,
    c.name AS clinic_name,
    d.gender AS gender,
    d.exp_year AS experience_years,
    d.city AS city,
    CAST(STRING_AGG(DISTINCT CONCAT( s.name), ', ') AS TEXT) AS specialties, -- Explicitly cast to TEXT
    CAST(STRING_AGG(DISTINCT CONCAT( l.name), ', ') AS TEXT) AS languages,   -- Explicitly cast to TEXT
    AVG(DISTINCT dr.rating) AS average_rating,
    COUNT(DISTINCT dr.id) AS review_count,
    COALESCE(500) AS price,
    d.image AS image_src
FROM doctor_clinic dc
JOIN doctor d ON dc.doctor_id = d.id
JOIN clinic c ON dc.clinic_id = c.id
LEFT JOIN doctor_specialization ds ON d.id = ds.doctor_id
LEFT JOIN specialization s ON ds.specialization_id = s.id
LEFT JOIN doctor_language dl ON d.id = dl.doctor_id
LEFT JOIN language l ON dl.language_id = l.id
LEFT JOIN doctor_review dr ON dr.doctor_id = d.id
GROUP BY d.id, c.id, d.firstname, d.lastname, d.gender, d.exp_year, d.city, d.image;