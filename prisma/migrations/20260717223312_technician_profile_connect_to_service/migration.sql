-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_technicianId_fkey";

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
