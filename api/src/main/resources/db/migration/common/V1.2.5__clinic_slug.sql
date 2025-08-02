ALTER TABLE clinic
ADD COLUMN IF NOT EXISTS "slug" VARCHAR(255) UNIQUE;

UPDATE clinic
SET slug = TRIM(BOTH '-' FROM LOWER(
        REGEXP_REPLACE(CONCAT(name, '-'), '[^a-zA-Z0-9]+', '-', 'g')
    )) || '-' || SUBSTRING(gen_random_uuid()::text, 1, 8);



