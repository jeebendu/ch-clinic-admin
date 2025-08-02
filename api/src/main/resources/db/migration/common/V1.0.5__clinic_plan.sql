ALTER TABLE "clinic" ADD COLUMN "plan_id" integer,
ADD CONSTRAINT "fk_clinic_plan_id" FOREIGN KEY ("plan_id") REFERENCES "plan" ("id");