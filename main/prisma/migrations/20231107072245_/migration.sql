/*
  Warnings:

  - Added the required column `organizationId` to the `UserSchoolClass` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SchoolClass" DROP CONSTRAINT "SchoolClass_organizationId_fkey";

-- AlterTable
ALTER TABLE "UserSchoolClass" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSchoolClass" ADD CONSTRAINT "UserSchoolClass_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
