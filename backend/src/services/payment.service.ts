import Stripe from 'stripe';
import logger from '../utils/logger';

const hasStripeKey = Boolean(process.env.STRIPE_SECRET_KEY);
const stripe = hasStripeKey
  ? new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    })
  : null;

export class PaymentService {
  private isDemoMode(): boolean {
    return !hasStripeKey || !stripe;
  }

  /**
   * Créer une session de checkout Stripe
   */
  async createCheckoutSession(
    companyId: string,
    planId: string,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string; url: string }> {
    try {
      if (this.isDemoMode()) {
        const sessionId = `demo_session_${Date.now()}`;
        return {
          sessionId,
          url: `${successUrl}${successUrl.includes('?') ? '&' : '?'}demoSession=${sessionId}`,
        };
      }

      // À adapter selon votre configuration Stripe
      const session = await stripe!.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: this.getPriceIdForPlan(planId),
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customerEmail,
        metadata: {
          companyId,
          planId,
        },
      });

      return {
        sessionId: session.id,
        url: session.url || '',
      };
    } catch (error) {
      logger.error('Stripe checkout error:', error);
      if (this.isDemoMode()) {
        const sessionId = `demo_session_${Date.now()}`;
        return {
          sessionId,
          url: `${successUrl}${successUrl.includes('?') ? '&' : '?'}demoSession=${sessionId}`,
        };
      }

      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Récupérer une souscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      if (this.isDemoMode()) {
        return {
          id: subscriptionId,
          object: 'subscription',
          status: 'active',
        } as Stripe.Subscription;
      }

      return await stripe!.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      logger.error('Stripe subscription retrieval error:', error);
      if (this.isDemoMode()) {
        return {
          id: subscriptionId,
          object: 'subscription',
          status: 'active',
        } as Stripe.Subscription;
      }

      throw new Error('Failed to retrieve subscription');
    }
  }

  /**
   * Annuler une souscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      if (this.isDemoMode()) {
        logger.info(`Demo mode: subscription cancelled locally: ${subscriptionId}`);
        return;
      }

      await stripe!.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      logger.info(`Subscription cancelled: ${subscriptionId}`);
    } catch (error) {
      logger.error('Stripe cancellation error:', error);
      if (this.isDemoMode()) {
        return;
      }

      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Mapper un plan local à un price ID Stripe
   */
  private getPriceIdForPlan(planId: string): string {
    const planMapping: Record<string, string> = {
      'plan-basic': process.env.STRIPE_PRICE_BASIC || 'price_basic',
      'plan-pro': process.env.STRIPE_PRICE_PRO || 'price_pro',
      'plan-enterprise': process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise',
    };

    return planMapping[planId] || 'price_basic';
  }

  /**
   * Vérifier la signature du webhook Stripe
   */
  verifyWebhookSignature(body: string, signature: string): Stripe.Event {
    try {
      if (this.isDemoMode()) {
        return {
          id: 'demo_event',
          object: 'event',
          api_version: '2023-10-16',
          created: Math.floor(Date.now() / 1000),
          data: { object: {} },
          livemode: false,
          pending_webhooks: 0,
          request: null,
          type: 'checkout.session.completed',
        } as Stripe.Event;
      }

      return stripe!.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      if (this.isDemoMode()) {
        return {
          id: 'demo_event',
          object: 'event',
          api_version: '2023-10-16',
          created: Math.floor(Date.now() / 1000),
          data: { object: {} },
          livemode: false,
          pending_webhooks: 0,
          request: null,
          type: 'checkout.session.completed',
        } as Stripe.Event;
      }

      throw new Error('Invalid webhook signature');
    }
  }

  /**
   * Créer une facture Stripe
   */
  async createInvoice(
    customerId: string,
    items: Array<{ description: string; amount: number; quantity: number }>
  ): Promise<Stripe.Invoice> {
    try {
      if (this.isDemoMode()) {
        return {
          id: `demo_invoice_${Date.now()}`,
          object: 'invoice',
          customer: customerId,
          status: 'draft',
          hosted_invoice_url: null,
        } as Stripe.Invoice;
      }

      const invoice = await stripe!.invoices.create({
        customer: customerId,
      });

      for (const item of items) {
        await stripe!.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          description: item.description,
          unit_amount: Math.round(item.amount * 100), // Centimes
          quantity: item.quantity,
        });
      }

      return await stripe!.invoices.finalizeInvoice(invoice.id);
    } catch (error) {
      logger.error('Invoice creation error:', error);
      if (this.isDemoMode()) {
        return {
          id: `demo_invoice_${Date.now()}`,
          object: 'invoice',
          customer: customerId,
          status: 'draft',
          hosted_invoice_url: null,
        } as Stripe.Invoice;
      }

      throw new Error('Failed to create invoice');
    }
  }
}

export default new PaymentService();
