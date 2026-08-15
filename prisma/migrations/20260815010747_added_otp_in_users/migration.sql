-- AlterTable
ALTER TABLE "users" ADD COLUMN     "otpExpiry" TIMESTAMP(3),
ADD COLUMN     "resetOtp" TEXT;
