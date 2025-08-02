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

	-- Removed: COUNT(DISTINCT db.branch_id) AS branch_count
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

GROUP BY 
	d.id, d.firstname, d.lastname, d.gender, d.exp_year, d.city, d.image, d.slug;

 