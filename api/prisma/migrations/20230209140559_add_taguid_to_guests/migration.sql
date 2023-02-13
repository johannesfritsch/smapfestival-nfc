/*
  Warnings:

  - A unique constraint covering the columns `[tagUid]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagUid` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "tagUid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Guest_tagUid_key" ON "Guest"("tagUid");
