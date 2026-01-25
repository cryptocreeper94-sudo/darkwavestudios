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

interface FinancialTransactionPayload {
  transactionId: string;
  type: 'subscription' | 'payment' | 'refund';
  amount: number;
  currency: string;
  sourceApp: string;
  productName: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: 'stripe' | 'coinbase';
  stripePaymentIntentId?: string;
  coinbaseChargeId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

interface FinancialTransactionResponse {
  success: boolean;
  transactionId: string;
  recorded: boolean;
  owner: string;
  ownerShare: number;
  partnerShare: number;
}

interface ContractorPaymentPayload {
  payeeId: string;
  payeeName: string;
  payeeEmail: string;
  payeeSSN?: string;
  payeeAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  amount: number;
  paymentDate: string;
  description: string;
  sourceApp: string;
  category: string;
}

interface ContractorPaymentResponse {
  success: boolean;
  paymentId: string;
  ytdTotal: number;
  threshold1099: number;
  requiresForm1099: boolean;
}

interface FinancialStatementResponse {
  app: string;
  period: string;
  totalRevenue: number;
  transactions: unknown[];
  ownerDistribution: Record<string, number>;
  contractorPayments: unknown[];
  blockchainAnchor?: string;
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

  async syncFinancialTransaction(transaction: FinancialTransactionPayload): Promise<FinancialTransactionResponse> {
    const response = await fetch(`${this.hubUrl}/api/ecosystem/sync/financial-transaction`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to sync financial transaction: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async syncContractorPayment(payment: ContractorPaymentPayload): Promise<ContractorPaymentResponse> {
    const response = await fetch(`${this.hubUrl}/api/ecosystem/sync/1099-payment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payment),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to sync contractor payment: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getFinancialStatement(period: string): Promise<FinancialStatementResponse> {
    const response = await fetch(
      `${this.hubUrl}/api/ecosystem/financial-statement?app=darkwave-studios&period=${encodeURIComponent(period)}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch financial statement: ${response.status}`);
    }

    return response.json();
  }

  async anchorFinancialStatement(statementId: string, dataHash: string): Promise<BlockchainAnchorResponse> {
    return this.anchorToBlockchain({
      recordType: 'snippet',
      recordId: statementId,
      dataHash,
    });
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

    const baseUrl = process.env.ORBIT_ECOSYSTEM_URL || 'https://orbitstaffing.io/api/ecosystem';
    const hubUrl = baseUrl.replace('/api/ecosystem', '');

    orbitClient = new OrbitEcosystemClient({
      hubUrl,
      apiKey,
      apiSecret,
      appName: 'DarkWave Studios',
    });
  }

  return orbitClient;
}

export async function syncPaymentToOrbit(payment: {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: string;
  planType: string;
  planName: string;
  paymentMethod: string;
  stripePaymentIntentId?: string | null;
  coinbaseChargeId?: string | null;
}): Promise<void> {
  try {
    const client = getOrbitClient();
    
    const transaction = {
      transactionId: payment.stripePaymentIntentId || payment.coinbaseChargeId || payment.id,
      type: payment.planType.startsWith('custom_') ? 'payment' as const : 'subscription' as const,
      amount: parseFloat(payment.amount),
      currency: 'USD',
      sourceApp: 'DarkWave Studios',
      productName: payment.planName,
      customerEmail: payment.customerEmail,
      customerName: payment.customerName,
      paymentMethod: payment.paymentMethod as 'stripe' | 'coinbase',
      stripePaymentIntentId: payment.stripePaymentIntentId || undefined,
      coinbaseChargeId: payment.coinbaseChargeId || undefined,
      metadata: {
        planType: payment.planType,
        internalPaymentId: payment.id,
      },
      timestamp: new Date().toISOString(),
    };

    const result = await client.syncFinancialTransaction(transaction);
    console.log(`[ORBIT] Payment synced: ${result.transactionId}, Owner: ${result.owner}, Share: $${result.ownerShare}`);
  } catch (error) {
    console.error('[ORBIT] Failed to sync payment:', error);
  }
}
