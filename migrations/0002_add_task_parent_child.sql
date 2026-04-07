-- Migration: add parent-child hierarchy to Task table
-- Run: npx prisma migrate dev --name add_task_parent_child
-- Or apply manually against your D1 database

ALTER TABLE "Task" ADD COLUMN "parentId" TEXT REFERENCES "Task"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "Task_parentId_idx" ON "Task"("parentId");
