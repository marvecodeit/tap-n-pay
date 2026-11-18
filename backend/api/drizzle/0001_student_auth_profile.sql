ALTER TABLE "student" ADD COLUMN IF NOT EXISTS "department" text;
--> statement-breakpoint
UPDATE "student" SET "department" = 'Not provided' WHERE "department" IS NULL;
--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "department" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN IF NOT EXISTS "faculty" text;
--> statement-breakpoint
UPDATE "student" SET "faculty" = 'Not provided' WHERE "faculty" IS NULL;
--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "faculty" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN IF NOT EXISTS "phone-number" text;
--> statement-breakpoint
UPDATE "student" SET "phone-number" = '' WHERE "phone-number" IS NULL;
--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "phone-number" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN IF NOT EXISTS "level" text;
--> statement-breakpoint
UPDATE "student" SET "level" = 'Not provided' WHERE "level" IS NULL;
--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "level" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "refresh_token_hash" TYPE text USING "refresh_token_hash"::text;
--> statement-breakpoint
ALTER TABLE "student" DROP CONSTRAINT IF EXISTS "student_fullname_unique";
