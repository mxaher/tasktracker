import 'dotenv/config';
import { CloudflareClient } from './cloudflare.js';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = '51d5dc9e-dbcf-4039-8fee-698c9b59823a';

const cf = new CloudflareClient({
  apiToken: CLOUDFLARE_API_TOKEN,
  accountId: CLOUDFLARE_ACCOUNT_ID,
});

async function main() {
  console.log('=== Task table PRAGMA ===');
  const pragma = await cf.executeD1Query(
    DATABASE_ID, 
    'PRAGMA table_info(Task)'
  );
  console.log(JSON.stringify(pragma, null, 2));
  
  console.log('\n=== First 5 tasks (all columns) ===');
  const tasks = await cf.executeD1Query(
    DATABASE_ID, 
    'SELECT * FROM Task LIMIT 5'
  );
  console.log(JSON.stringify(tasks, null, 2));
}

main().catch(console.error);