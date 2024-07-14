DO $$ BEGIN
 CREATE TYPE "public"."AttachmentType" AS ENUM('link', 'file');
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
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'parent', 'student', 'teacher');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."SubmissionStatus" AS ENUM('progress', 'submitted', 'redo', 'graded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Absence" (
	"id" serial PRIMARY KEY NOT NULL,
	"excused" boolean DEFAULT false NOT NULL,
	"reason" text,
	"date" timestamp NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"studentID" integer NOT NULL,
	"teacherID" integer NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Attachment" (
	"id" serial PRIMARY KEY NOT NULL,
	"attachmentType" "AttachmentType" NOT NULL,
	"source" text NOT NULL,
	"submissionID" integer NOT NULL,
	"studentID" integer NOT NULL
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
	"date" timestamp NOT NULL,
	"studentID" integer NOT NULL,
	"teacherID" integer NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organization" (
	"id" serial PRIMARY KEY NOT NULL,
	"ownerID" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Parent" (
	"memberID" integer PRIMARY KEY NOT NULL,
	"studentID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostComment" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"updated" timestamp NOT NULL,
	"userID" integer NOT NULL,
	"postID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostSection" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subjectID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostSubmission" (
	"postID" integer NOT NULL,
	"studentID" integer NOT NULL,
	"submissionStatus" "SubmissionStatus" NOT NULL,
	"gradeID" integer,
	"comment" text,
	"timestamp" timestamp,
	CONSTRAINT "PostSubmission_postID_studentID_pk" PRIMARY KEY("postID","studentID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"dueDate" timestamp,
	"postType" "post_type" NOT NULL,
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
	"studentID" integer NOT NULL,
	"schoolClassID" integer NOT NULL,
	CONSTRAINT "StudentToSchoolClass_studentID_schoolClassID_pk" PRIMARY KEY("studentID","schoolClassID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudentToSubject" (
	"studentID" integer NOT NULL,
	"subjectID" integer NOT NULL,
	CONSTRAINT "StudentToSubject_studentID_subjectID_pk" PRIMARY KEY("studentID","subjectID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SubjectToSchoolClass" (
	"schoolClassID" integer NOT NULL,
	"subjectID" integer NOT NULL,
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
	"teacherID" integer NOT NULL,
	"subjectID" integer NOT NULL,
	CONSTRAINT "TeacherToSubject_teacherID_subjectID_pk" PRIMARY KEY("teacherID","subjectID")
);
