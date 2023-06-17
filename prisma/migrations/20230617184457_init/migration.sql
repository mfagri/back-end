/*
  Warnings:

  - You are about to drop the `_banUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_banUsers" DROP CONSTRAINT "_banUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_banUsers" DROP CONSTRAINT "_banUsers_B_fkey";

-- DropTable
DROP TABLE "_banUsers";

-- CreateTable
CREATE TABLE "bane" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "banedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoomTobane" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoomTobane_AB_unique" ON "_RoomTobane"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomTobane_B_index" ON "_RoomTobane"("B");

-- AddForeignKey
ALTER TABLE "bane" ADD CONSTRAINT "bane_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomTobane" ADD CONSTRAINT "_RoomTobane_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomTobane" ADD CONSTRAINT "_RoomTobane_B_fkey" FOREIGN KEY ("B") REFERENCES "bane"("id") ON DELETE CASCADE ON UPDATE CASCADE;
