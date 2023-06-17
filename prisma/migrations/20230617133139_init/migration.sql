-- DropForeignKey
ALTER TABLE "mute" DROP CONSTRAINT "mute_roomId_fkey";

-- AddForeignKey
ALTER TABLE "mute" ADD CONSTRAINT "mute_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
