/*
  Warnings:

  - A unique constraint covering the columns `[Userid]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_token]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_Userid_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "Userid" INTEGER,
ADD COLUMN     "access_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_Userid_key" ON "Session"("Userid");

-- CreateIndex
CREATE UNIQUE INDEX "Session_access_token_key" ON "Session"("access_token");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_Userid_fkey" FOREIGN KEY ("Userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_Userid_fkey" FOREIGN KEY ("Userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
