/*
  Warnings:

  - You are about to drop the column `access_token` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[session/-mfagri]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `session/-mfagri` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_access_token_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "access_token",
ADD COLUMN     "session/-mfagri" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_session/-mfagri_key" ON "Session"("session/-mfagri");
