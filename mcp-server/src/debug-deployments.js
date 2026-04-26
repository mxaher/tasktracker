import 'dotenv/config';
import { CloudflareClient } from './cloudflare.js';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

console.log('Token:', CLOUDFLARE_API_TOKEN ? 'present' : 'missing');
console.log('Account:', CLOUDFLARE_ACCOUNT_ID ?? 'missing');

const cf = new CloudflareClient({
  apiToken: CLOUDFLARE_API_TOKEN,
  accountId: CLOUDFLARE_ACCOUNT_ID,
});

async function main() {
  const workerName = 'tasktracker';
  
  console.log(`\nGetting deployments for worker: ${workerName}`);
  
  const deployments = await cf.getWorkerDeployments(workerName);
  
  console.log(JSON.stringify(deployments, null, 2));
}

main().catch(console.error);