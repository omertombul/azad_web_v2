-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description_fr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_fr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "description_fr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_fr" TEXT NOT NULL DEFAULT '';
