import Stripe from 'stripe';

// Cache credentials with TTL
let cachedCredentials: { publishableKey: string; secretKey: string } | null = null;
let credentialsCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let fetchInProgress: Promise<{ publishableKey: string; secretKey: string }> | null = null;

async function getCredentials() {
  // Return cached credentials if still valid
  if (cachedCredentials && Date.now() - credentialsCacheTime < CACHE_TTL_MS) {
    return cachedCredentials;
  }

  // Prevent concurrent fetches
  if (fetchInProgress) {
    return fetchInProgress;
  }

  fetchInProgress = (async () => {
    try {
      const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
      const xReplitToken = process.env.REPL_IDENTITY
        ? 'repl ' + process.env.REPL_IDENTITY
        : process.env.WEB_REPL_RENEWAL
          ? 'depl ' + process.env.WEB_REPL_RENEWAL
          : null;

      if (!xReplitToken) {
        throw new Error('X_REPLIT_TOKEN not found for repl/depl');
      }

      const connectorName = 'stripe';
      const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
      const targetEnvironment = isProduction ? 'production' : 'development';

      const url = new URL(`https://${hostname}/api/v2/connection`);
      url.searchParams.set('include_secrets', 'true');
      url.searchParams.set('connector_names', connectorName);
      url.searchParams.set('environment', targetEnvironment);

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Stripe credentials: ${response.status}`);
      }

      const data = await response.json();
      const connectionSettings = data.items?.[0];

      if (!connectionSettings?.settings?.publishable || !connectionSettings?.settings?.secret) {
        throw new Error(`Stripe ${targetEnvironment} connection not found`);
      }

      cachedCredentials = {
        publishableKey: connectionSettings.settings.publishable,
        secretKey: connectionSettings.settings.secret,
      };
      credentialsCacheTime = Date.now();

      return cachedCredentials;
    } finally {
      fetchInProgress = null;
    }
  })();

  return fetchInProgress;
}

export async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();

  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil' as any,
  });
}

export async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

export async function getStripeSecretKey() {
  const { secretKey } = await getCredentials();
  return secretKey;
}

let stripeSync: any = null;

export async function getStripeSync() {
  if (!stripeSync) {
    const { StripeSync } = await import('stripe-replit-sync');
    const secretKey = await getStripeSecretKey();

    stripeSync = new StripeSync({
      poolConfig: {
        connectionString: process.env.DATABASE_URL!,
        max: 2,
      },
      stripeSecretKey: secretKey,
    });
  }
  return stripeSync;
}
