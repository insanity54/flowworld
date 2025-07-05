-- CreateTable
CREATE TABLE "Pose" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "difficulty" INTEGER NOT NULL,
    "basePoseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "bookmarkId" TEXT,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowPose" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "poseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,

    CONSTRAINT "FlowPose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DifficultyMap" (
    "id" TEXT NOT NULL,
    "flowPoseId" TEXT NOT NULL,
    "beginnerPose" TEXT,
    "intermediatePose" TEXT,
    "advancedPose" TEXT,

    CONSTRAINT "DifficultyMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moderated" BOOLEAN NOT NULL DEFAULT false,
    "ipHash" TEXT NOT NULL,
    "flowId" TEXT,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFlow" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT NOT NULL,

    CONSTRAINT "UserFlow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flow_bookmarkId_key" ON "Flow"("bookmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "DifficultyMap_flowPoseId_key" ON "DifficultyMap"("flowPoseId");

-- AddForeignKey
ALTER TABLE "Pose" ADD CONSTRAINT "Pose_basePoseId_fkey" FOREIGN KEY ("basePoseId") REFERENCES "Pose"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowPose" ADD CONSTRAINT "FlowPose_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowPose" ADD CONSTRAINT "FlowPose_poseId_fkey" FOREIGN KEY ("poseId") REFERENCES "Pose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DifficultyMap" ADD CONSTRAINT "DifficultyMap_flowPoseId_fkey" FOREIGN KEY ("flowPoseId") REFERENCES "FlowPose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFlow" ADD CONSTRAINT "UserFlow_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
