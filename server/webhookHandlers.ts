import { getStripeSync } from './stripeClient';
import { storage } from './storage';
import { syncPaymentToOrbit } from './orbitClient';
import { db } from './db';
import { eq } from 'drizzle-orm';

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
      await WebhookHandlers.handleSubscriptionEvents(event);
    } catch (error) {
      console.error('Error processing payment webhook event:', error);
    }
  }

  static async handleSubscriptionEvents(event: any): Promise<void> {
    const { chatUsers } = await import('@shared/schema');

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data?.object;
        if (session?.metadata?.type === 'ad_free_subscription' && session.subscription) {
          const email = session.metadata.email || session.customer_email;
          if (email) {
            const currentPeriodEnd = session.current_period_end
              ? new Date(session.current_period_end * 1000)
              : (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d; })();
            await db.update(chatUsers)
              .set({
                adFreeSubscription: true,
                adFreeExpiresAt: currentPeriodEnd,
                stripeCustomerId: session.customer || null,
                stripeSubscriptionId: session.subscription
              })
              .where(eq(chatUsers.email, email));
            console.log(`[Ad-Free] Activated subscription for ${email}`);
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data?.object;
        if (subscription?.id) {
          await db.update(chatUsers)
            .set({
              adFreeSubscription: false,
              adFreeExpiresAt: null,
              stripeSubscriptionId: null
            })
            .where(eq(chatUsers.stripeSubscriptionId, subscription.id));
          console.log(`[Ad-Free] Cancelled subscription ${subscription.id}`);
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data?.object;
        if (invoice?.subscription) {
          const periodEnd = invoice.lines?.data?.[0]?.period?.end
            ? new Date(invoice.lines.data[0].period.end * 1000)
            : (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d; })();
          await db.update(chatUsers)
            .set({
              adFreeSubscription: true,
              adFreeExpiresAt: periodEnd
            })
            .where(eq(chatUsers.stripeSubscriptionId, invoice.subscription));
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data?.object;
        if (invoice?.subscription) {
          console.log(`[Ad-Free] Payment failed for subscription ${invoice.subscription}`);
        }
        break;
      }
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
            
            // Sync completed payment to ORBIT for bookkeeping
            const updatedPayment = await storage.getPaymentByStripeSession(session.id);
            if (updatedPayment) {
              await syncPaymentToOrbit({
                id: updatedPayment.id,
                customerName: updatedPayment.customerName,
                customerEmail: updatedPayment.customerEmail,
                amount: updatedPayment.amount,
                planType: updatedPayment.planType,
                planName: updatedPayment.planName,
                paymentMethod: updatedPayment.paymentMethod,
                stripePaymentIntentId: session.payment_intent || updatedPayment.stripePaymentIntentId,
                coinbaseChargeId: updatedPayment.coinbaseChargeId,
              });
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
