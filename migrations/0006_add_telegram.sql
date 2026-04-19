-- CreateTable TelegramUser
CREATE TABLE IF NOT EXISTS "TelegramUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TelegramUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable TelegramLog
CREATE TABLE IF NOT EXISTS "TelegramLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT NOT NULL,
    "rawMessage" TEXT NOT NULL,
    "parsed" BOOLEAN NOT NULL DEFAULT false,
    "parseError" TEXT,
    "taskId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "TelegramUser_chatId_key" ON "TelegramUser"("chatId");
CREATE UNIQUE INDEX IF NOT EXISTS "TelegramUser_userId_key" ON "TelegramUser"("userId");

-- CreateIndex for TelegramLog
CREATE INDEX IF NOT EXISTS "TelegramLog_chatId_createdAt_idx" ON "TelegramLog"("chatId", "createdAt" DESC);
