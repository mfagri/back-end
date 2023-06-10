/*
  Warnings:

  - You are about to drop the column `envitId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_envitId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_requestId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "envitId",
DROP COLUMN "requestId";

-- CreateTable
CREATE TABLE "_request" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_request_AB_unique" ON "_request"("A", "B");

-- CreateIndex
CREATE INDEX "_request_B_index" ON "_request"("B");

-- AddForeignKey
ALTER TABLE "_request" ADD CONSTRAINT "_request_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_request" ADD CONSTRAINT "_request_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
