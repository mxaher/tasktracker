export class CloudflareClient {
  constructor(config) {
    this.apiToken = config.apiToken;
    this.accountId = config.accountId;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('text/plain')) {
      return response.text();
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.result;
  }

  async requestRaw(endpoint, options = {}) {
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

    const data = await response.json();
    return data;
  }

  async listWorkers() {
    return this.request(`/accounts/${this.accountId}/workers/scripts`);
  }

  async getWorker(scriptName) {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.accountId}/workers/scripts/${scriptName}`, {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} ${error}`);
    }
    
    return response.text();
  }

  async uploadWorker(scriptName, script) {
    await this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}`, {
      method: 'PUT',
      body: script,
      headers: {
        'Content-Type': 'application/javascript',
      },
    });
  }

  async deleteWorker(scriptName) {
    await this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}`, {
      method: 'DELETE',
    });
  }

  async getWorkerDeployments(scriptName) {
    return this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}/deployments`);
  }

  async listD1Databases() {
    const result = await this.request(`/accounts/${this.accountId}/d1/database`);
    return result;
  }

  async getD1Database(databaseId) {
    return this.request(`/accounts/${this.accountId}/d1/database/${databaseId}`);
  }

  async executeD1Query(databaseId, query, params = []) {
    return this.request(`/accounts/${this.accountId}/d1/database/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({ sql: query, params }),
    });
  }

  async executeD1Batch(databaseId, queries) {
    return this.request(`/accounts/${this.accountId}/d1/database/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        queries: queries.map(q => ({ sql: q.sql, params: q.params ?? [] })),
      }),
    });
  }

  async listD1Tables(databaseId) {
    const result = await this.request(`/accounts/${this.accountId}/d1/database/${databaseId}/table`);
    return result;
  }

  async getD1TableSchema(databaseId, tableName) {
    return this.request(`/accounts/${this.accountId}/d1/database/${databaseId}/table/${tableName}/schema`);
  }
}