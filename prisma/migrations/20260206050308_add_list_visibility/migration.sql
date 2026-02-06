-- CreateEnum
CREATE TYPE "ListVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "user_lists" ADD COLUMN     "visibility" "ListVisibility" NOT NULL DEFAULT 'PRIVATE';
