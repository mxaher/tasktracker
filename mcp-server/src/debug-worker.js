import { readFileSync } from 'fs';

const envFile = readFileSync('./mcp-server/.env', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;

async function main() {
  console.log('=== Test health endpoint ===');
  
  const healthRes = await fetch('https://tasktracker.moh-zaher.workers.dev/api/health', {
    headers: { 'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}` },
  });
  console.log('Health status:', healthRes.status);
  const healthText = await healthRes.text();
  console.log('Health response:', healthText.substring(0, 500));
  
  console.log('\n=== Test tasks with verbose error ===');
  const tasksRes = await fetch('https://tasktracker.moh-zaher.workers.dev/api/tasks');
  console.log('Tasks status:', tasksRes.status);
  const tasksText = await tasksRes.text();
  console.log('Tasks response:', tasksText);
}

main().catch(console.error);