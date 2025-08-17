DROP VIEW IF EXISTS live_visit_queue;

CREATE OR REPLACE VIEW live_visit_queue AS
WITH appointments AS (
    SELECT 
        a.id AS appointment_id,
        a.patient_id,
        a.slot_id,
        ROW_NUMBER() OVER (
            PARTITION BY a.slot_id 
            ORDER BY a.created_time
        ) AS planned_sequence
    FROM appointment a
    JOIN doctor_slot s ON s.id = a.slot_id
    WHERE a.status NOT IN ('CANCELLED', 'NO_SHOW')
),
schedules AS (
    SELECT 
        ps.id AS patient_schedule_id,
        ps.patient_id,
        ps.consulting_doctor_id,
        ps.branch_id,
        ps.appointment_id,
        ps.created_time AS checkin_time
    FROM patient_schedule ps
),
queue AS (
    SELECT 
        sc.consulting_doctor_id,
        sc.branch_id,
        sc.patient_schedule_id,
        sc.patient_id,
        sc.checkin_time,
        COALESCE(
            ap.planned_sequence, 
            ROW_NUMBER() OVER (
                PARTITION BY sc.consulting_doctor_id, sc.branch_id, DATE(sc.checkin_time) 
                ORDER BY sc.checkin_time
            )
        ) AS planned_sequence,
        ROW_NUMBER() OVER (
            PARTITION BY sc.consulting_doctor_id, sc.branch_id, DATE(sc.checkin_time) 
            ORDER BY sc.checkin_time
        ) AS actual_sequence
    FROM schedules sc
    LEFT JOIN appointments ap ON ap.appointment_id = sc.appointment_id
),
chained AS (
    SELECT 
        q.consulting_doctor_id,
        q.branch_id,
        q.patient_schedule_id,
        q.patient_id,
        q.checkin_time,
        q.planned_sequence,
        q.actual_sequence,
        INTERVAL '15 minutes' AS consult_duration
    FROM queue q
)
SELECT 
    c.consulting_doctor_id,
    c.branch_id,
    c.patient_schedule_id,
    c.patient_id,
    CONCAT(p.firstname, ' ', COALESCE(p.lastname, '')) AS patient_name,
    COALESCE(EXTRACT(YEAR FROM age(current_date, p.dob)), p.age) AS patient_age,
    p.gender AS patient_gender,
    COALESCE(u.phone, p.alternative_contact, p.whatsapp_no) AS patient_mobile,
    c.checkin_time,
    c.planned_sequence,
    c.actual_sequence,
    (
        c.checkin_time + (c.actual_sequence - 1) * c.consult_duration
    )::timestamp AS estimated_consultation_time
FROM chained c
JOIN patient p ON p.id = c.patient_id
LEFT JOIN users u ON u.id = p.user_id
ORDER BY c.consulting_doctor_id, c.branch_id, c.actual_sequence;
