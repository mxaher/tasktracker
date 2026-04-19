-- Add composite index on TaskAuditLog for efficient history queries
CREATE INDEX IF NOT EXISTS "TaskAuditLog_taskId_createdAt_idx"
ON "TaskAuditLog"("taskId", "createdAt" DESC);
