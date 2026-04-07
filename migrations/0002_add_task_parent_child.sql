-- Migration: add_task_parent_child
-- Adds self-referential parent-child hierarchy to the Task table.
-- Uses SET NULL on delete so orphaning (not cascading deletes) is the default.

ALTER TABLE "Task" ADD COLUMN "parentId" TEXT REFERENCES "Task"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "Task_parentId_idx" ON "Task"("parentId");
