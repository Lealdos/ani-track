/*
  Warnings:

  - A unique constraint covering the columns `[userId,animeId]` on the table `user_favorites_list` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_list_userId_animeId_key" ON "user_favorites_list"("userId", "animeId");
