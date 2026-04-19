-- TelegramSession: stores multi-step wizard state per chat
CREATE TABLE IF NOT EXISTS "TelegramSession" (
  "chatId"    TEXT NOT NULL PRIMARY KEY,
  "step"      TEXT NOT NULL,
  "data"      TEXT NOT NULL DEFAULT '{}',
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
