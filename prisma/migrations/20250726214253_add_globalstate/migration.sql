-- CreateTable
CREATE TABLE "GlobalState" (
    "id" TEXT NOT NULL,
    "poseName" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalState_pkey" PRIMARY KEY ("id")
);
