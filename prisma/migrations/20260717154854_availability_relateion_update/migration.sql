/*
  Warnings:

  - You are about to drop the column `technicianProfileId` on the `availabilities` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_technicianProfileId_fkey";

-- AlterTable
ALTER TABLE "availabilities" DROP COLUMN "technicianProfileId";

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
