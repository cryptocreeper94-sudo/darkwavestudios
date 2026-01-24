import crypto from 'crypto';

interface OrbitClientConfig {
  hubUrl: string;
  apiKey: string;
  apiSecret: string;
  appName: string;
}

interface SnippetPayload {
  name: string;
  code: string;
  language: string;
  category: string;
  description?: string;
  tags?: string[];
}

interface BlockchainAnchorRequest {
  recordType: 'snippet' | 'app';
  recordId: string;
  dataHash: string;
}

interface BlockchainAnchorResponse {
  queued: boolean;
  batchId: string;
}

interface WebhookEvent {
  event: string;
  timestamp: string;
  source: string;
  payload: Record<string, unknown>;
  signature: string;
}

export class OrbitEcosystemClient {
  private hubUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private appName: string;

  constructor(config: OrbitClientConfig) {
    this.hubUrl = config.hubUrl;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.appName = config.appName;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      'X-API-Secret': this.apiSecret,
      'X-App-Name': this.appName,
    };
  }

  async checkConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const response = await fetch(`${this.hubUrl}/api/ecosystem/apps`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        return { connected: true, message: 'Successfully connected to ORBIT Hub' };
      }
      return { connected: false, message: `Connection failed: ${response.status}` };
    } catch (error) {
      return { connected: false, message: `Connection error: ${error}` };
    }
  }

  async getEcosystemApps(): Promise<unknown[]> {
    const response = await fetch(`${this.hubUrl}/api/ecosystem/apps`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch apps: ${response.status}`);
    }

    return response.json();
  }

  async getAppMetadata(): Promise<unknown> {
    const response = await fetch(`${this.hubUrl}/api/ecosystem/app-metadata`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch app metadata: ${response.status}`);
    }

    return response.json();
  }

  async pushSnippet(snippet: SnippetPayload): Promise<unknown> {
    const response = await fetch(`${this.hubUrl}/api/ecosystem/snippets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(snippet),
    });

    if (!response.ok) {
      throw new Error(`Failed to push snippet: ${response.status}`);
    }

    return response.json();
  }

  async getSnippets(category?: string): Promise<unknown[]> {
    const url = category
      ? `${this.hubUrl}/api/ecosystem/snippets?category=${encodeURIComponent(category)}`
      : `${this.hubUrl}/api/ecosystem/snippets`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch snippets: ${response.status}`);
    }

    return response.json();
  }

  async anchorToBlockchain(request: BlockchainAnchorRequest): Promise<BlockchainAnchorResponse> {
    const response = await fetch(`${this.hubUrl}/api/blockchain/anchor`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to anchor to blockchain: ${response.status}`);
    }

    return response.json();
  }

  verifyWebhookSignature(requestBody: string, signature: string): boolean {
    const computedSignature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(requestBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  }

  parseWebhookEvent(requestBody: string, signature: string): WebhookEvent | null {
    if (!this.verifyWebhookSignature(requestBody, signature)) {
      console.error('Invalid webhook signature');
      return null;
    }

    try {
      return JSON.parse(requestBody) as WebhookEvent;
    } catch {
      console.error('Failed to parse webhook event');
      return null;
    }
  }

  generateDataHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

let orbitClient: OrbitEcosystemClient | null = null;

export function getOrbitClient(): OrbitEcosystemClient {
  if (!orbitClient) {
    const apiKey = process.env.ORBIT_API_KEY;
    const apiSecret = process.env.ORBIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('ORBIT_API_KEY and ORBIT_API_SECRET must be set');
    }

    orbitClient = new OrbitEcosystemClient({
      hubUrl: process.env.ORBIT_HUB_URL || 'https://orbitstaffing.io',
      apiKey,
      apiSecret,
      appName: 'DarkWave Trust Layer Hub',
    });
  }

  return orbitClient;
}
