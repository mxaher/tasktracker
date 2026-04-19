-- TelegramSession: multi-step wizard state per chat
-- This table was scaffolded in 0007 but this migration ensures
-- it is formally tracked in the migration sequence.
CREATE TABLE IF NOT EXISTS "TelegramSession" (
  "chatId"    TEXT NOT NULL PRIMARY KEY,
  "step"      TEXT NOT NULL,
  -- step values: 'await_title' | 'await_assignee' | 'await_due_date'
  "data"      TEXT NOT NULL DEFAULT '{}',
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
