-- DropForeignKey
ALTER TABLE "mute" DROP CONSTRAINT "mute_userId_fkey";

-- AddForeignKey
ALTER TABLE "mute" ADD CONSTRAINT "mute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
