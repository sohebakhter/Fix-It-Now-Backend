/*
  Warnings:

  - The values [PAID] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [IN_PROGRESS,ACCEPT,DECLINE,COMPLETED] on the enum `ServiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `content` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `review` on the `reviews` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[bookingId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('REQUESTED', 'ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."bookings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'REQUESTED';
COMMIT;

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- AlterEnum
BEGIN;
CREATE TYPE "ServiceStatus_new" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'CANCELLED');
ALTER TABLE "public"."services" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "services" ALTER COLUMN "status" TYPE "ServiceStatus_new" USING ("status"::text::"ServiceStatus_new");
ALTER TYPE "ServiceStatus" RENAME TO "ServiceStatus_old";
ALTER TYPE "ServiceStatus_new" RENAME TO "ServiceStatus";
DROP TYPE "public"."ServiceStatus_old";
ALTER TABLE "services" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "content",
DROP COLUMN "review",
ADD COLUMN     "bookingId" TEXT NOT NULL,
ADD COLUMN     "comment" TEXT NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
