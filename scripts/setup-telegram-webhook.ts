#!/usr/bin/env tsx
/**
 * Script to register the Telegram bot webhook URL.
 *
 * Usage:
 *   npx tsx scripts/setup-telegram-webhook.ts [APP_URL]
 *
 * Environment variables (read from .env / .dev.vars):
 *   TELEGRAM_BOT_TOKEN          - Telegram bot token
 *   TELEGRAM_WEBHOOK_SECRET     - Secret token for webhook validation (optional)
 *
 * If APP_URL is not passed as CLI argument, it must be set in env as APP_URL or NEXT_PUBLIC_APP_URL.
 */

import * as fs from "node:fs";
import * as path from "node:path";

// Load .dev.vars or .env for local usage
function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".dev.vars"));
loadEnvFile(path.join(process.cwd(), ".env"));

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const APP_URL =
  process.argv[2] ||
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL;

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is not set.");
  process.exit(1);
}

if (!APP_URL) {
  console.error("❌ APP_URL is not set. Pass it as CLI argument or set APP_URL in env.");
  process.exit(1);
}

const webhookUrl = `${APP_URL.replace(/\/$/, "")}/api/telegram/webhook`;

console.log(`🔗 Registering webhook URL: ${webhookUrl}`);

const payload: Record<string, unknown> = { url: webhookUrl };
if (WEBHOOK_SECRET) {
  payload.secret_token = WEBHOOK_SECRET;
  console.log("🔐 Secret token will be set.");
}

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
})
  .then((res) => res.json())
  .then((data) => {
    if ((data as { ok?: boolean }).ok) {
      console.log("✅ Webhook registered successfully!");
      console.log("   Result:", JSON.stringify(data, null, 2));
    } else {
      console.error("❌ Webhook registration failed:");
      console.error("   ", JSON.stringify(data, null, 2));
      process.exit(1);
    }
  })
  .catch((err: unknown) => {
    console.error("❌ Network error:", err);
    process.exit(1);
  });
