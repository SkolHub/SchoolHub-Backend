DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('assignment', 'announcement', 'test');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Timetables" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"organizationID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" integer,
	"organizationID" integer NOT NULL,
	"user" text,
	"email" text,
	"password" text,
	CONSTRAINT "Admins_user_unique" UNIQUE("user"),
	CONSTRAINT "Admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Members" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" integer,
	"organizationID" integer NOT NULL,
	"tags" text[] DEFAULT  NOT NULL,
	"name" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"user" text,
	"email" text,
	"password" text,
	CONSTRAINT "Members_user_unique" UNIQUE("user"),
	CONSTRAINT "Members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Parents" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" integer,
	"organizationID" integer NOT NULL,
	"studentID" integer NOT NULL,
	"user" text,
	"email" text,
	"password" text,
	CONSTRAINT "Parents_user_unique" UNIQUE("user"),
	CONSTRAINT "Parents_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Exemptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"startTimestamp" timestamp NOT NULL,
	"endTimestamp" timestamp NOT NULL,
	"reason" text NOT NULL,
	"schoolClassID" integer NOT NULL,
	"studentID" integer NOT NULL,
	"teacherID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SchoolClassesToSubjects" (
	"schoolClassID" integer NOT NULL,
	"subjectID" integer NOT NULL,
	CONSTRAINT "SchoolClassesToSubjects_schoolClassID_subjectID_pk" PRIMARY KEY("schoolClassID","subjectID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SchoolClasses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tags" text[] DEFAULT  NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"tags" text[] DEFAULT  NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Absences" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp,
	"date" timestamp DEFAULT now(),
	"excused" boolean DEFAULT null,
	"reason" text DEFAULT null,
	"studentID" integer,
	"teacherID" integer,
	"subjectID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Grades" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"reason" text NOT NULL,
	"value" text NOT NULL,
	"studentID" integer NOT NULL,
	"teacherID" integer NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Observations" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"message" text NOT NULL,
	"studentID" integer NOT NULL,
	"teacherID" integer NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"type" "type" NOT NULL,
	"authorID" integer NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"admin" boolean DEFAULT false NOT NULL,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
