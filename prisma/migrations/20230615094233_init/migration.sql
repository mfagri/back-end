/*
  Warnings:

  - You are about to drop the `_RoomToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_B_fkey";

-- DropTable
DROP TABLE "_RoomToUser";

-- CreateTable
CREATE TABLE "_whojoined" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_mutedusers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_whojoined_AB_unique" ON "_whojoined"("A", "B");

-- CreateIndex
CREATE INDEX "_whojoined_B_index" ON "_whojoined"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_mutedusers_AB_unique" ON "_mutedusers"("A", "B");

-- CreateIndex
CREATE INDEX "_mutedusers_B_index" ON "_mutedusers"("B");

-- AddForeignKey
ALTER TABLE "_whojoined" ADD CONSTRAINT "_whojoined_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_whojoined" ADD CONSTRAINT "_whojoined_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedusers" ADD CONSTRAINT "_mutedusers_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedusers" ADD CONSTRAINT "_mutedusers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
