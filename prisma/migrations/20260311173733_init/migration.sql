/*
  Warnings:

  - You are about to drop the column `deskription` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "deskription",
ADD COLUMN     "description" TEXT;
