/*
  Warnings:

  - You are about to drop the column `questionAudio1` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the column `questionAudio2` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `questionAudio1URL` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionAudio2URL` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "questionAudio1",
DROP COLUMN "questionAudio2",
ADD COLUMN     "questionAudio1URL" TEXT NOT NULL,
ADD COLUMN     "questionAudio2URL" TEXT NOT NULL;
