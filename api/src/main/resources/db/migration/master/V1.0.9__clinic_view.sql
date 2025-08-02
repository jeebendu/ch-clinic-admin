DROP VIEW IF EXISTS  clinic_public_view;

CREATE OR REPLACE VIEW clinic_public_view AS
SELECT
    c.id,
    c.name AS clinic_name,
    c.slug,
    c.logo,
    c.banner,
    ct.name AS clinic_type_name,
    COUNT(DISTINCT b.id) AS branch_count,
    STRING_AGG(DISTINCT CONCAT(b.city, '(', b.location, ')'), ', ') AS branches,
    ROUND(AVG(r.rating)::numeric, 1) AS clinic_rating,
    COUNT(DISTINCT r.id) AS review_count
FROM clinic c
LEFT JOIN clinic_type ct ON c.clinic_type_id = ct.id
LEFT JOIN branch b ON b.id IN (
    SELECT br.id
    FROM branch br
    WHERE br.is_active = true
    AND br.clinic_id = c.id
)
LEFT JOIN clinic_review r ON r.clinic_id = c.id
GROUP BY c.id, c.name, c.slug, c.logo, c.banner, ct.name;


