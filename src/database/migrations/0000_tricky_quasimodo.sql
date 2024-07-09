DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'parent', 'student', 'teacher');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."attachment_type" AS ENUM('link', 'file');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."submission_status" AS ENUM('progress', 'submitted', 'redo', 'graded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."post_type" AS ENUM('announcement', 'assignment', 'test', 'material');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Absence" (
	"id" serial PRIMARY KEY NOT NULL,
	"excused" boolean DEFAULT false NOT NULL,
	"reason" text NOT NULL,
	"date" timestamp NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"studentID" integer NOT NULL,
	"teacherID" integer NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Grade" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"reason" text NOT NULL,
	"date" timestamp NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"studentID" integer NOT NULL,
	"teacherID" integer NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Member" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" text NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"role" "role" NOT NULL,
	"organizationID" integer,
	CONSTRAINT "Member_user_unique" UNIQUE("user")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Observation" (
	"id" serial PRIMARY KEY NOT NULL,
	"reason" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"studentID" integer NOT NULL,
	"teacherID" integer NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organization" (
	"id" serial PRIMARY KEY NOT NULL,
	"ownerID" integer NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Parent" (
	"memberID" integer PRIMARY KEY NOT NULL,
	"studentID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostAttachment" (
	"id" serial PRIMARY KEY NOT NULL,
	"attachment_type" "attachment_type" NOT NULL,
	"source" text NOT NULL,
	"submissionID" integer NOT NULL,
	"studentID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostComment" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" text,
	"timestamp" timestamp DEFAULT now(),
	"updated" timestamp,
	"userID" integer,
	"postID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostSection" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"subjectID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostSubmissionAttachment" (
	"id" serial PRIMARY KEY NOT NULL,
	"attachment_type" "attachment_type" NOT NULL,
	"source" text NOT NULL,
	"submissionID" integer NOT NULL,
	"studentID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostSubmission" (
	"postID" integer NOT NULL,
	"studentID" integer NOT NULL,
	"submission_status" "submission_status" NOT NULL,
	"gradeID" integer,
	"comment" text,
	CONSTRAINT "PostSubmission_postID_studentID_pk" PRIMARY KEY("postID","studentID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"dueDate" timestamp,
	"post_type" "post_type" NOT NULL,
	"updated" timestamp,
	"sectionID" integer,
	"memberID" integer NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SchoolClass" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"classMasterID" integer,
	"organizationID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudentToSchoolClass" (
	"studentID" integer,
	"schoolClassID" integer,
	CONSTRAINT "StudentToSchoolClass_studentID_schoolClassID_pk" PRIMARY KEY("studentID","schoolClassID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudentToSubject" (
	"studentID" integer,
	"subjectID" integer,
	CONSTRAINT "StudentToSubject_studentID_subjectID_pk" PRIMARY KEY("studentID","subjectID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SubjectToSchoolClass" (
	"schoolClassID" integer,
	"subjectID" integer,
	CONSTRAINT "SubjectToSchoolClass_schoolClassID_subjectID_pk" PRIMARY KEY("schoolClassID","subjectID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Subject" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"organizationID" integer NOT NULL,
	"metadata" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TeacherToSubject" (
	"teacherID" integer,
	"subjectID" integer,
	CONSTRAINT "TeacherToSubject_teacherID_subjectID_pk" PRIMARY KEY("teacherID","subjectID")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Member" ADD CONSTRAINT "Member_organizationID_Organization_id_fk" FOREIGN KEY ("organizationID") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SchoolClass" ADD CONSTRAINT "SchoolClass_organizationID_Organization_id_fk" FOREIGN KEY ("organizationID") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StudentToSchoolClass" ADD CONSTRAINT "StudentToSchoolClass_studentID_Member_id_fk" FOREIGN KEY ("studentID") REFERENCES "public"."Member"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StudentToSchoolClass" ADD CONSTRAINT "StudentToSchoolClass_schoolClassID_SchoolClass_id_fk" FOREIGN KEY ("schoolClassID") REFERENCES "public"."SchoolClass"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StudentToSubject" ADD CONSTRAINT "StudentToSubject_studentID_Member_id_fk" FOREIGN KEY ("studentID") REFERENCES "public"."Member"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StudentToSubject" ADD CONSTRAINT "StudentToSubject_subjectID_Subject_id_fk" FOREIGN KEY ("subjectID") REFERENCES "public"."Subject"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SubjectToSchoolClass" ADD CONSTRAINT "SubjectToSchoolClass_schoolClassID_SchoolClass_id_fk" FOREIGN KEY ("schoolClassID") REFERENCES "public"."SchoolClass"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SubjectToSchoolClass" ADD CONSTRAINT "SubjectToSchoolClass_subjectID_Subject_id_fk" FOREIGN KEY ("subjectID") REFERENCES "public"."Subject"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Subject" ADD CONSTRAINT "Subject_organizationID_Organization_id_fk" FOREIGN KEY ("organizationID") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TeacherToSubject" ADD CONSTRAINT "TeacherToSubject_teacherID_Member_id_fk" FOREIGN KEY ("teacherID") REFERENCES "public"."Member"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TeacherToSubject" ADD CONSTRAINT "TeacherToSubject_subjectID_Subject_id_fk" FOREIGN KEY ("subjectID") REFERENCES "public"."Subject"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
