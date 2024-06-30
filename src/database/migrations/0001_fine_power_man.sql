DO $$ BEGIN
 ALTER TABLE "Members" ADD CONSTRAINT "Members_organizationID_Organizations_id_fk" FOREIGN KEY ("organizationID") REFERENCES "public"."Organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
