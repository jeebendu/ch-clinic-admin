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

-- 1. Add the column
ALTER TABLE patient_schedule ADD COLUMN branch_id BIGINT NOT NULL;


-- 2. Add the foreign key constraint
ALTER TABLE patient_schedule ADD CONSTRAINT fk_patient_schedule_branch FOREIGN KEY (branch_id) REFERENCES branch(id) ON UPDATE NO ACTION ON DELETE RESTRICT;



ALTER TABLE visit_lab_order ADD COLUMN labtest_id INTEGER;
ALTER TABLE visit_lab_order ADD CONSTRAINT visit_lab_order_labtest_fkey FOREIGN KEY (labtest_id) REFERENCES labtest (id) ON UPDATE NO ACTION ON DELETE SET NULL;