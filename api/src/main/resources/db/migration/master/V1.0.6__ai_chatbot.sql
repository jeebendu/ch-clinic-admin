-- AI Chat Module Database Schema
-- PostgreSQL Migration Script

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT,
    user_name VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_by VARCHAR(255) NOT NULL,
    created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_time TIMESTAMP,
    CONSTRAINT chk_chat_session_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED'))
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL,
    message TEXT,
    response TEXT,
    message_type VARCHAR(20) NOT NULL,
    query_category VARCHAR(50),
    context_data TEXT,
    created_by VARCHAR(255) NOT NULL,
    created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_time TIMESTAMP,
    CONSTRAINT fk_chat_message_session FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    CONSTRAINT chk_message_type CHECK (message_type IN ('USER', 'AI')),
    CONSTRAINT chk_query_category CHECK (query_category IN (
        'DOCTOR_SEARCH', 'CLINIC_INFO', 'APPOINTMENT_BOOKING', 'SPECIALIZATION_INFO',
        'SYMPTOM_ANALYSIS', 'LOCATION_SEARCH', 'ADDRESS_QUERY', 'DOCTOR_AVAILABILITY',
        'SLOT_AVAILABILITY', 'APPOINTMENT_BOOKING_INTENT', 'DOCTOR_SCHEDULE_QUERY',
        'GENERAL_MEDICAL','LOCATION_SEARCH', 'GENERAL'
    ))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_token ON chat_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_time ON chat_sessions(created_time);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_message_type ON chat_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_query_category ON chat_messages(query_category);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_time ON chat_messages(created_time);

-- Comments for documentation
COMMENT ON TABLE chat_sessions IS 'Stores AI chat sessions for users';
COMMENT ON COLUMN chat_sessions.session_token IS 'Unique token to identify chat session';
COMMENT ON COLUMN chat_sessions.user_id IS 'Reference to user who owns the session';
COMMENT ON COLUMN chat_sessions.user_name IS 'Name of the user for quick access';
COMMENT ON COLUMN chat_sessions.status IS 'Session status: ACTIVE, INACTIVE, or ARCHIVED';

COMMENT ON TABLE chat_messages IS 'Stores individual messages and AI responses in chat sessions';
COMMENT ON COLUMN chat_messages.session_id IS 'Reference to the chat session';
COMMENT ON COLUMN chat_messages.message IS 'User input message';
COMMENT ON COLUMN chat_messages.response IS 'AI generated response';
COMMENT ON COLUMN chat_messages.message_type IS 'Type of message: USER or AI';
COMMENT ON COLUMN chat_messages.query_category IS 'Category of the query for analytics';
COMMENT ON COLUMN chat_messages.context_data IS 'Additional context data used for the response';




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
