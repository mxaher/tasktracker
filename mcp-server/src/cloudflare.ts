import type { CloudflareConfig } from './types.js';

export interface Worker {
  id: string;
  script_name: string;
  created_on: string;
  modified_on: string;
}

export interface WorkerContent {
  id: string;
  script_name: string;
  content: string;
  etag: string;
  modified_on: string;
}

export interface D1Database {
  uuid: string;
  name: string;
  version: string;
  created_at: string;
  size: number;
  num_tables: number;
}

export interface D1Table {
  name: string;
  schema: string;
}

export class CloudflareClient {
  private apiToken: string;
  public accountId: string;

  constructor(config: CloudflareConfig) {
    this.apiToken = config.apiToken;
    this.accountId = config.accountId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} ${error}`);
    }

    const data = await response.json() as { result: T };
    return data.result;
  }

  async listWorkers(): Promise<Worker[]> {
    return this.request(`/accounts/${this.accountId}/workers/scripts`);
  }

  async getWorker(scriptName: string): Promise<WorkerContent> {
    return this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}`);
  }

  async uploadWorker(scriptName: string, script: string): Promise<void> {
    await this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}`, {
      method: 'PUT',
      body: script,
      headers: {
        'Content-Type': 'application/javascript',
      },
    });
  }

  async deleteWorker(scriptName: string): Promise<void> {
    await this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}`, {
      method: 'DELETE',
    });
  }

  async getWorkerDeployments(scriptName: string): Promise<unknown[]> {
    return this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}/deployments`);
  }

  async listD1Databases(): Promise<D1Database[]> {
    const result = await this.request<{ databases: D1Database[] }>(`/accounts/${this.accountId}/d1/databases`);
    return result.databases;
  }

  async getD1Database(databaseId: string): Promise<D1Database> {
    return this.request(`/accounts/${this.accountId}/d1/databases/${databaseId}`);
  }

  async executeD1Query(databaseId: string, query: string, params?: unknown[]): Promise<{
    results: unknown[];
    success: boolean;
    meta: {
      changes: number;
      rows_read: number;
      rows_written: number;
      served_by: string;
      duration: number;
    };
  }> {
    return this.request(`/accounts/${this.accountId}/d1/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        sql: query,
        params: params ?? [],
      }),
    });
  }

  async executeD1Batch(
    databaseId: string,
    queries: Array<{ sql: string; params?: unknown[] }>
  ): Promise<{
    results: unknown[];
    success: boolean;
  }> {
    return this.request(`/accounts/${this.accountId}/d1/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        queries: queries.map(q => ({
          sql: q.sql,
          params: q.params ?? [],
        })),
      }),
    });
  }

  async listD1Tables(databaseId: string): Promise<D1Table[]> {
    const result = await this.request<{ tables: D1Table[] }>(`/accounts/${this.accountId}/d1/databases/${databaseId}/tables`);
    return result.tables;
  }

  async getD1TableSchema(databaseId: string, tableName: string): Promise<D1Table> {
    return this.request(`/accounts/${this.accountId}/d1/databases/${databaseId}/tables/${tableName}/schema`);
  }
}