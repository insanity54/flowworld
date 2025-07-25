/*
  Warnings:

  - You are about to drop the column `ipHash` on the `ChatMessage` table. All the data in the column will be lost.
  - Added the required column `ipHmac` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "ipHash",
ADD COLUMN     "ipHmac" TEXT NOT NULL;
