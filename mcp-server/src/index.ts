import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { CloudflareClient } from './cloudflare.js';
import { createWorkerTools, createD1Tools } from './tools.js';

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

interface MCPTool {
  name: string;
  description: string;
  inputSchema: object;
  execute: (args: Record<string, unknown>) => Promise<CallToolResult>;
}

const workerTools = createWorkerTools(cf) as MCPTool[];
const d1Tools = createD1Tools(cf) as MCPTool[];
const allTools = [...workerTools, ...d1Tools];

const server = new Server(
  {
    name: 'cloudflare-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler('tools/list', async () => {
  return {
    tools: allTools as unknown as Tool[],
  };
});

server.setRequestHandler('tools/call', async (request: object) => {
  const params = request as { name: string; arguments: object | undefined };
  const tool = allTools.find((t) => t.name === params.name);

  if (!tool) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Tool not found: ${params.name}`,
        },
      ],
      isError: true,
    };
  }

  try {
    const args = (params.arguments as Record<string, unknown>) ?? {};
    const result = await tool.execute(args);
    return result;
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: error instanceof Error ? error.message : String(error),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);