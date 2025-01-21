/*
  Warnings:

  - The `profileImage` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profileImage` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "profileImage",
ADD COLUMN     "profileImage" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileImage",
ADD COLUMN     "profileImage" INTEGER;
