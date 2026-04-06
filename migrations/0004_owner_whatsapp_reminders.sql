ALTER TABLE "AdminSettings" ADD COLUMN "whatsappOwnerRemindersEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "AdminSettings" ADD COLUMN "whatsappReminderOffsets" TEXT NOT NULL DEFAULT '0,1';
ALTER TABLE "AdminSettings" ADD COLUMN "whatsappReminderTemplate" TEXT NOT NULL DEFAULT 'Hi {{ownerName}}, this is a reminder for task {{taskTitle}} (Task #{{taskId}}). Due date: {{dueDate}}. Priority: {{priority}}.';
