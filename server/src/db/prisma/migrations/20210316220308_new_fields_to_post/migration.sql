-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "text" TEXT,
ALTER COLUMN "link" DROP NOT NULL,
ALTER COLUMN "domain" DROP NOT NULL;