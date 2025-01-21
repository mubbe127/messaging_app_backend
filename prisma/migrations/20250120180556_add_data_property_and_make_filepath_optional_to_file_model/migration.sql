-- AlterTable
ALTER TABLE "File" ADD COLUMN     "data" BYTEA,
ALTER COLUMN "filePath" DROP NOT NULL;
