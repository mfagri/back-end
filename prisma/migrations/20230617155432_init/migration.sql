-- CreateTable
CREATE TABLE "_banUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_banUsers_AB_unique" ON "_banUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_banUsers_B_index" ON "_banUsers"("B");

-- AddForeignKey
ALTER TABLE "_banUsers" ADD CONSTRAINT "_banUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banUsers" ADD CONSTRAINT "_banUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
