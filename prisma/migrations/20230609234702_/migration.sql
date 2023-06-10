-- AlterTable
ALTER TABLE "User" ADD COLUMN     "envitId" INTEGER,
ADD COLUMN     "requestId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_envitId_fkey" FOREIGN KEY ("envitId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
