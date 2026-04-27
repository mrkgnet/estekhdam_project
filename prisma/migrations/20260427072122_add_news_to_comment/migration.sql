-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "governmentNewsId" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_governmentNewsId_fkey" FOREIGN KEY ("governmentNewsId") REFERENCES "GovernmentNews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
