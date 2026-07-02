import logger from '../utils/logger';

export class EmailService {
  /**
   * Envoyer un email
   */
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
    attachments?: Array<{ filename: string; path?: string; content?: Buffer }>
  ): Promise<void> {
    try {
      logger.info(
        `Local email stub: to=${to}, subject=${subject}, htmlLength=${html.length}, textLength=${text?.length || 0}, attachments=${attachments?.length || 0}`
      );
    } catch (error) {
      logger.error('Local email error:', error);
    }
  }

  /**
   * Envoyer un email de bienvenue
   */
  async sendWelcomeEmail(email: string, firstName: string, companyName: string): Promise<void> {
    const html = `
      <h1>Bienvenue sur PME Assistant!</h1>
      <p>Bonjour ${firstName},</p>
      <p>Votre compte pour l'entreprise <strong>${companyName}</strong> a été créé avec succès.</p>
      <p>Vous pouvez à présent accéder à votre tableau de bord à l'adresse:</p>
      <p><a href="https://app.saas-pme.com">https://app.saas-pme.com</a></p>
      <p>Commencez par configurer vos préférences et parcourir les fonctionnalités disponibles.</p>
      <p>Besoin d'aide? Consultez notre <a href="https://docs.saas-pme.com">documentation</a>.</p>
      <p>À bientôt,<br>L'équipe PME Assistant</p>
    `;

    await this.sendEmail(email, 'Bienvenue sur PME Assistant', html);
  }

  /**
   * Envoyer une facture
   */
  async sendInvoice(
    to: string,
    invoiceNumber: string,
    pdfBuffer: Buffer,
    customerName: string
  ): Promise<void> {
    const html = `
      <h1>Votre facture</h1>
      <p>Bonjour ${customerName},</p>
      <p>Veuillez trouver ci-joint votre facture <strong>${invoiceNumber}</strong>.</p>
      <p>Merci pour votre business.</p>
      <p>L'équipe</p>
    `;

    await this.sendEmail(to, `Facture ${invoiceNumber}`, html, '', [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBuffer,
      },
    ]);
  }

  /**
   * Envoyer email de réinitialisation de mot de passe
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `https://app.saas-pme.com/reset-password?token=${resetToken}`;

    const html = `
      <h1>Réinitialisation du mot de passe</h1>
      <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
      <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none;">
        Réinitialiser le mot de passe
      </a></p>
      <p>Ce lien expire dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cela, ignorez cet email.</p>
    `;

    await this.sendEmail(email, 'Réinitialisation de votre mot de passe', html);
  }

  /**
   * Envoyer une notification d'alerte
   */
  async sendAlert(email: string, message: string, type: 'info' | 'warning' | 'error' = 'info'): Promise<void> {
    const colorMap = {
      info: '#17a2b8',
      warning: '#ffc107',
      error: '#dc3545',
    };

    const html = `
      <div style="border-left: 4px solid ${colorMap[type]}; padding: 10px;">
        <h2>${type.toUpperCase()}</h2>
        <p>${message}</p>
      </div>
    `;

    await this.sendEmail(email, `Alerte - ${type}`, html);
  }
}

export default new EmailService();
