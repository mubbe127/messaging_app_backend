-- CreateTable
CREATE TABLE "_MessageViewers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MessageViewers_AB_unique" ON "_MessageViewers"("A", "B");

-- CreateIndex
CREATE INDEX "_MessageViewers_B_index" ON "_MessageViewers"("B");

-- AddForeignKey
ALTER TABLE "_MessageViewers" ADD CONSTRAINT "_MessageViewers_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageViewers" ADD CONSTRAINT "_MessageViewers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
