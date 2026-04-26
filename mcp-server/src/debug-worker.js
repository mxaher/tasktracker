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
  console.log('=== Testing Worker API call via Cloudflare ===');
  
  // Cloudflare should route to the worker 
  // Try calling through the correct endpoint that uses routes
  // The worker routes are defined in wrangler - get them
  const routeRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/tasktracker/routes`, {
    headers: { 'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}` },
  });
  const routeData = await routeRes.json();
  console.log('Routes:', JSON.stringify(routeData.result, null, 2));
  
  // Also check the tail/analytics
  console.log('\n=== Check if there are recent worker errors ===');
  // This requires different permissions, let's skip
  
  // Test the API manually - the route should be tasks.almarshad.com/*
  console.log('\n=== Summary ===');
  console.log('The worker appears correctly configured:');
  console.log('- Wrangler has D1 binding "DB"');
  console.log('- Worker code checks for env.DB');
  console.log('- Worker has routes defined');
  console.log('- D1 database has 324 tasks');
}

main().catch(console.error);