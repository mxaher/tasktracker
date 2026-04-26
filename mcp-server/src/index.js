import { McpServer, StdioServerTransport } from '@modelcontextprotocol/server';
import { CloudflareClient } from './cloudflare.js';
import { createWorkerTools, createD1Tools } from './tools.js';
import 'dotenv/config';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
  console.error('Missing required environment variables:');
  console.error('  CLOUDFLARE_API_TOKEN');
  console.error('  CLOUDFLARE_ACCOUNT_ID');
  process.exit(1);
}

const cf = new CloudflareClient({
  apiToken: CLOUDFLARE_API_TOKEN,
  accountId: CLOUDFLARE_ACCOUNT_ID,
});

const server = new McpServer({
  name: 'cloudflare-mcp',
  version: '1.0.0',
});

const workerTools = createWorkerTools(cf);
const d1Tools = createD1Tools(cf);

for (const tool of workerTools) {
  server.registerTool(
    tool.name,
    {
      description: tool.description,
      inputSchema: tool.inputSchema,
    },
    tool.execute
  );
}

for (const tool of d1Tools) {
  server.registerTool(
    tool.name,
    {
      description: tool.description,
      inputSchema: tool.inputSchema,
    },
    tool.execute
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);