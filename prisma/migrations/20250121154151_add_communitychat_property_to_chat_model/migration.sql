/*
  Warnings:

  - A unique constraint covering the columns `[communityChat]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "communityChat" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_communityChat_key" ON "Chat"("communityChat");
