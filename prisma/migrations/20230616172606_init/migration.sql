/*
  Warnings:

  - You are about to drop the `_mutedusers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_mutedusers" DROP CONSTRAINT "_mutedusers_A_fkey";

-- DropForeignKey
ALTER TABLE "_mutedusers" DROP CONSTRAINT "_mutedusers_B_fkey";

-- DropTable
DROP TABLE "_mutedusers";

-- CreateTable
CREATE TABLE "mute" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "muteduntil" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mute" ADD CONSTRAINT "mute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mute" ADD CONSTRAINT "mute_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
