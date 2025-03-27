-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questionAudio1" BYTEA NOT NULL,
    "questionAudio2" BYTEA NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);
