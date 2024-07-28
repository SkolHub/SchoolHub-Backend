CREATE TABLE IF NOT EXISTS "QuizCraft" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" jsonb NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "Observation" DROP COLUMN IF EXISTS "date";