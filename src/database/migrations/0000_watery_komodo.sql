DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'teacher', 'student', 'parent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Members" (
	"id" serial PRIMARY KEY NOT NULL,
	"organizationID" integer NOT NULL,
	"userID" integer,
	"role" "role" NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "Members_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creatorID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
