DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'teacher', 'student', 'parent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Members" (
	"id" serial PRIMARY KEY NOT NULL,
	"organizationID" integer,
	"userID" integer,
	"role" "role" NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "Members_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Parents" (
	"memberID" integer PRIMARY KEY NOT NULL,
	"studentID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tagged" (
	"memberID" integer PRIMARY KEY NOT NULL,
	"tags" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ownerID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Members" ADD CONSTRAINT "Members_organizationID_Organizations_id_fk" FOREIGN KEY ("organizationID") REFERENCES "public"."Organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Parents" ADD CONSTRAINT "Parents_memberID_Members_id_fk" FOREIGN KEY ("memberID") REFERENCES "public"."Members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Tagged" ADD CONSTRAINT "Tagged_memberID_Members_id_fk" FOREIGN KEY ("memberID") REFERENCES "public"."Members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
