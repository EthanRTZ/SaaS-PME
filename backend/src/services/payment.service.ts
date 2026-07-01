import Stripe from 'stripe';
import logger from '../utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export class PaymentService {
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
      // À adapter selon votre configuration Stripe
      const session = await stripe.checkout.sessions.create({
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
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Récupérer une souscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      logger.error('Stripe subscription retrieval error:', error);
      throw new Error('Failed to retrieve subscription');
    }
  }

  /**
   * Annuler une souscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      logger.info(`Subscription cancelled: ${subscriptionId}`);
    } catch (error) {
      logger.error('Stripe cancellation error:', error);
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
      return stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
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
      const invoice = await stripe.invoices.create({
        customer: customerId,
      });

      for (const item of items) {
        await stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          description: item.description,
          unit_amount: Math.round(item.amount * 100), // Centimes
          quantity: item.quantity,
        });
      }

      return await stripe.invoices.finalizeInvoice(invoice.id);
    } catch (error) {
      logger.error('Invoice creation error:', error);
      throw new Error('Failed to create invoice');
    }
  }
}

export default new PaymentService();
