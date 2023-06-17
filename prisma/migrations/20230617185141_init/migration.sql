/*
  Warnings:

  - You are about to drop the `_RoomTobane` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomId` to the `bane` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoomTobane" DROP CONSTRAINT "_RoomTobane_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomTobane" DROP CONSTRAINT "_RoomTobane_B_fkey";

-- AlterTable
ALTER TABLE "bane" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_RoomTobane";

-- AddForeignKey
ALTER TABLE "bane" ADD CONSTRAINT "bane_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
