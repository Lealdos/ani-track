-- AlterTable
ALTER TABLE "current_watching" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "finished_anime_list" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "user_favorites_list" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_list_items" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "plan_to_watch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "picture" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_to_watch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "plan_to_watch" ADD CONSTRAINT "plan_to_watch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
