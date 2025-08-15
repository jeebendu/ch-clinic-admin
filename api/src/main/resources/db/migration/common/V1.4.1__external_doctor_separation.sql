ALTER TABLE core_sequence ADD CONSTRAINT uq_core_sequence_branch_module UNIQUE (branch_id,module_id);

CREATE TABLE doctor_external (
    id INTEGER NOT NULL,
    global_doctor_id UUID NOT NULL,
    uid VARCHAR(50) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255),
    gender INTEGER NOT NULL DEFAULT 0,
    email VARCHAR(255),
    phone VARCHAR(12),
    created_by VARCHAR(255),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);