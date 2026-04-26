export function createWorkerTools(cf) {
  return [
    {
      name: 'cf_list_workers',
      description: 'List all Cloudflare Workers in your account',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        const workers = await cf.listWorkers();
        return {
          content: [{ type: 'text', text: JSON.stringify(workers, null, 2) }],
        };
      },
    },
    {
      name: 'cf_get_worker',
      description: 'Get the code of a specific Cloudflare Worker',
      inputSchema: {
        type: 'object',
        properties: {
          scriptName: { type: 'string', description: 'Name of the worker script' },
        },
        required: ['scriptName'],
      },
      execute: async (args) => {
        const worker = await cf.getWorker(args.scriptName);
        return {
          content: [{ type: 'text', text: JSON.stringify(worker, null, 2) }],
        };
      },
    },
    {
      name: 'cf_delete_worker',
      description: 'Delete a Cloudflare Worker',
      inputSchema: {
        type: 'object',
        properties: {
          scriptName: { type: 'string', description: 'Name of the worker script to delete' },
        },
        required: ['scriptName'],
      },
      execute: async (args) => {
        await cf.deleteWorker(args.scriptName);
        return {
          content: [{ type: 'text', text: `Worker "${args.scriptName}" deleted successfully` }],
        };
      },
    },
    {
      name: 'cf_get_worker_deployments',
      description: 'Get deployment history for a Cloudflare Worker',
      inputSchema: {
        type: 'object',
        properties: {
          scriptName: { type: 'string', description: 'Name of the worker script' },
        },
        required: ['scriptName'],
      },
      execute: async (args) => {
        const deployments = await cf.getWorkerDeployments(args.scriptName);
        return {
          content: [{ type: 'text', text: JSON.stringify(deployments, null, 2) }],
        };
      },
    },
    {
      name: 'cf_upload_worker',
      description: 'Upload or update a Cloudflare Worker script',
      inputSchema: {
        type: 'object',
        properties: {
          scriptName: { type: 'string', description: 'Name for the worker script' },
          script: { type: 'string', description: 'JavaScript code for the worker' },
        },
        required: ['scriptName', 'script'],
      },
      execute: async (args) => {
        await cf.uploadWorker(args.scriptName, args.script);
        return {
          content: [{ type: 'text', text: `Worker "${args.scriptName}" uploaded successfully` }],
        };
      },
    },
  ];
}

export function createD1Tools(cf) {
  return [
    {
      name: 'cf_list_d1_databases',
      description: 'List all D1 databases in your account',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        const databases = await cf.listD1Databases();
        return {
          content: [{ type: 'text', text: JSON.stringify(databases, null, 2) }],
        };
      },
    },
    {
      name: 'cf_get_d1_database',
      description: 'Get details of a specific D1 database',
      inputSchema: {
        type: 'object',
        properties: {
          databaseId: { type: 'string', description: 'UUID of the D1 database' },
        },
        required: ['databaseId'],
      },
      execute: async (args) => {
        const database = await cf.getD1Database(args.databaseId);
        return {
          content: [{ type: 'text', text: JSON.stringify(database, null, 2) }],
        };
      },
    },
    {
      name: 'cf_execute_d1_query',
      description: 'Execute a SQL query on a D1 database',
      inputSchema: {
        type: 'object',
        properties: {
          databaseId: { type: 'string', description: 'UUID of the D1 database' },
          query: { type: 'string', description: 'SQL query to execute' },
          params: { type: 'array', description: 'Optional query parameters', items: { type: 'string' } },
        },
        required: ['databaseId', 'query'],
      },
      execute: async (args) => {
        const result = await cf.executeD1Query(args.databaseId, args.query, args.params || []);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      },
    },
    {
      name: 'cf_execute_d1_batch',
      description: 'Execute multiple SQL queries in a single call',
      inputSchema: {
        type: 'object',
        properties: {
          databaseId: { type: 'string', description: 'UUID of the D1 database' },
          queries: {
            type: 'array',
            description: 'Array of SQL queries to execute',
            items: {
              type: 'object',
              properties: {
                sql: { type: 'string' },
                params: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
        required: ['databaseId', 'queries'],
      },
      execute: async (args) => {
        const result = await cf.executeD1Batch(args.databaseId, args.queries);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      },
    },
    {
      name: 'cf_list_d1_tables',
      description: 'List all tables in a D1 database',
      inputSchema: {
        type: 'object',
        properties: {
          databaseId: { type: 'string', description: 'UUID of the D1 database' },
        },
        required: ['databaseId'],
      },
      execute: async (args) => {
        const tables = await cf.listD1Tables(args.databaseId);
        return {
          content: [{ type: 'text', text: JSON.stringify(tables, null, 2) }],
        };
      },
    },
    {
      name: 'cf_get_d1_table_schema',
      description: 'Get the schema of a specific table in a D1 database',
      inputSchema: {
        type: 'object',
        properties: {
          databaseId: { type: 'string', description: 'UUID of the D1 database' },
          tableName: { type: 'string', description: 'Name of the table' },
        },
        required: ['databaseId', 'tableName'],
      },
      execute: async (args) => {
        const schema = await cf.getD1TableSchema(args.databaseId, args.tableName);
        return {
          content: [{ type: 'text', text: JSON.stringify(schema, null, 2) }],
        };
      },
    },
  ];
}