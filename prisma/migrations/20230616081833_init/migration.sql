-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Adminisrator" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_member" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "role_roomId_key" ON "role"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "role_userId_key" ON "role"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_Adminisrator_AB_unique" ON "_Adminisrator"("A", "B");

-- CreateIndex
CREATE INDEX "_Adminisrator_B_index" ON "_Adminisrator"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_member_AB_unique" ON "_member"("A", "B");

-- CreateIndex
CREATE INDEX "_member_B_index" ON "_member"("B");

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Adminisrator" ADD CONSTRAINT "_Adminisrator_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Adminisrator" ADD CONSTRAINT "_Adminisrator_B_fkey" FOREIGN KEY ("B") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_member" ADD CONSTRAINT "_member_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_member" ADD CONSTRAINT "_member_B_fkey" FOREIGN KEY ("B") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
