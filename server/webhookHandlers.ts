import { getStripeSync } from './stripeClient';
import { storage } from './storage';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    // Process with stripe-replit-sync (handles verification and syncs to stripe schema)
    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    // Parse the event to update our payments table
    // The signature was already verified by stripe-replit-sync
    try {
      const event = JSON.parse(payload.toString());
      await WebhookHandlers.handlePaymentEvents(event);
    } catch (error) {
      console.error('Error processing payment webhook event:', error);
    }
  }

  static async handlePaymentEvents(event: any): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data?.object;
        if (session?.id) {
          const payment = await storage.getPaymentByStripeSession(session.id);
          if (payment) {
            await storage.updatePaymentStatus(payment.id, 'completed', new Date());
            if (session.payment_intent) {
              await storage.updatePaymentStripeIntent(payment.id, session.payment_intent);
            }
          }
        }
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data?.object;
        if (session?.id) {
          const payment = await storage.getPaymentByStripeSession(session.id);
          if (payment) {
            await storage.updatePaymentStatus(payment.id, 'failed');
          }
        }
        break;
      }
    }
  }
}
