/*
  Warnings:

  - The values [PENDING] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isBooked` on the `availabilities` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('REQUESTED', 'ACCEPTED', 'DECLINED', 'PAID', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE "public"."bookings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'REQUESTED';
COMMIT;

-- AlterTable
ALTER TABLE "availabilities" DROP COLUMN "isBooked";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'REQUESTED';
