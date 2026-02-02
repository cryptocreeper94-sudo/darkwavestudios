import { getUncachableStripeClient } from './stripeClient';

async function createPulseProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Creating Pulse products in Stripe...');

  // Check if Pulse Basic already exists
  const existingProducts = await stripe.products.search({ query: "name:'Pulse'" });
  if (existingProducts.data.length > 0) {
    console.log('Pulse products already exist, skipping creation');
    console.log('Existing products:', existingProducts.data.map(p => ({ id: p.id, name: p.name })));
    return;
  }

  // Pulse Basic - $499
  const pulseBasic = await stripe.products.create({
    name: 'Pulse',
    description: 'AI predictive quant system with 65%+ verified win rate across 100,000+ predictions.',
    metadata: {
      tier: 'basic',
      category: 'ai-predictive',
      winRate: '65-70%',
      predictions: '100000+',
      featured: 'true',
    }
  });
  const pulseBasicPrice = await stripe.prices.create({
    product: pulseBasic.id,
    unit_amount: 49900, // $499.00
    currency: 'usd',
  });
  console.log('Created Pulse Basic:', pulseBasic.id, pulseBasicPrice.id);

  // Pulse Pro API - $1,499
  const pulsePro = await stripe.products.create({
    name: 'Pulse Pro API',
    description: 'Unlimited API access to Pulse predictions with backtesting suite and custom model training.',
    metadata: {
      tier: 'pro',
      category: 'ai-predictive',
      apiCalls: 'unlimited',
      rateLimit: '1000/min',
      featured: 'true',
    }
  });
  const pulseProPrice = await stripe.prices.create({
    product: pulsePro.id,
    unit_amount: 149900, // $1,499.00
    currency: 'usd',
  });
  console.log('Created Pulse Pro:', pulsePro.id, pulseProPrice.id);

  // Pulse Enterprise - $3,999
  const pulseEnterprise = await stripe.products.create({
    name: 'Pulse Enterprise',
    description: 'White-label quant system with dedicated infrastructure, 99.9% SLA, and 24/7 priority support.',
    metadata: {
      tier: 'enterprise',
      category: 'ai-predictive',
      whiteLabel: 'true',
      sla: '99.9%',
      support: '24/7',
      featured: 'true',
    }
  });
  const pulseEnterprisePrice = await stripe.prices.create({
    product: pulseEnterprise.id,
    unit_amount: 399900, // $3,999.00
    currency: 'usd',
  });
  console.log('Created Pulse Enterprise:', pulseEnterprise.id, pulseEnterprisePrice.id);

  console.log('\n=== Pulse Products Created Successfully ===');
  console.log('Update your widgetsList with these price IDs:');
  console.log(`- Pulse Basic: ${pulseBasicPrice.id}`);
  console.log(`- Pulse Pro: ${pulseProPrice.id}`);
  console.log(`- Pulse Enterprise: ${pulseEnterprisePrice.id}`);
}

createPulseProducts().catch(console.error);
