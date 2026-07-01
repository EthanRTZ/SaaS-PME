import { OpenAI } from 'openai';
import logger from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  /**
   * Envoyer un message à OpenAI et obtenir une réponse
   */
  static async chat(
    message: string,
    context?: Record<string, any>,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
        {
          role: 'system',
          content: `Tu es un assistant IA pour les PME. Tu aides avec les tâches administratives, 
          la génération de contenu professionnel, l'analyse de documents, et la gestion administrative.
          Sois concis, professionnel et pratique dans tes réponses.`,
        },
      ];

      // Ajouter l'historique de conversation
      if (conversationHistory && conversationHistory.length > 0) {
        messages.push(
          ...conversationHistory.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          }))
        );
      }

      // Ajouter le message actuel
      messages.push({
        role: 'user',
        content: message,
      });

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      return content;
    } catch (error) {
      logger.error('OpenAI chat error:', error);
      throw new Error('Failed to process message with AI');
    }
  }

  /**
   * Générer un email professionnel
   */
  static async generateEmail(
    subject: string,
    context: string,
    tone: 'formal' | 'friendly' | 'professional' = 'professional'
  ): Promise<{ subject: string; body: string }> {
    try {
      const prompt = `Génère un email professionnel avec les paramètres suivants:
      
Sujet: ${subject}
Contexte: ${context}
Ton: ${tone}

Réponds UNIQUEMENT au format JSON suivant (sans code block):
{
  "subject": "...",
  "body": "..."
}`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en rédaction d\'emails professionnels. Génère des emails de haute qualité.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      const result = JSON.parse(content);
      return {
        subject: result.subject,
        body: result.body,
      };
    } catch (error) {
      logger.error('Email generation error:', error);
      throw new Error('Failed to generate email');
    }
  }

  /**
   * Analyser du texte/document
   */
  static async analyzeText(
    text: string,
    analysisType: 'summary' | 'extraction' | 'sentiment' = 'summary'
  ): Promise<Record<string, any>> {
    try {
      let prompt = '';

      switch (analysisType) {
        case 'summary':
          prompt = `Résume ce texte de manière concise (max 3 paragraphes):

${text}`;
          break;

        case 'extraction':
          prompt = `Extrais les informations clés de ce texte (dates, noms, montants, etc.):

${text}

Réponds en JSON:
{
  "keyPoints": [...],
  "entities": {...},
  "dates": [...],
  "amounts": [...]
}`;
          break;

        case 'sentiment':
          prompt = `Analyse le sentiment général de ce texte:

${text}

Réponds en JSON:
{
  "sentiment": "positive|negative|neutral",
  "confidence": 0-1,
  "explanation": "..."
}`;
          break;
      }

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Basse température pour plus de précision
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      // Essayer de parser en JSON, sinon retourner comme texte
      try {
        return JSON.parse(content);
      } catch {
        return { text: content };
      }
    } catch (error) {
      logger.error('Text analysis error:', error);
      throw new Error('Failed to analyze text');
    }
  }

  /**
   * Générer un devis/facture automatiquement
   */
  static async generateInvoiceContent(
    customerName: string,
    companyName: string,
    items: Array<{ description: string; quantity: number; unitPrice: number }>
  ): Promise<string> {
    try {
      const itemsText = items
        .map(
          (item, i) =>
            `${i + 1}. ${item.description}: ${item.quantity} x ${item.unitPrice}€ = ${
              item.quantity * item.unitPrice
            }€`
        )
        .join('\n');

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: `Génère une facture professionnelle en format texte avec les paramètres suivants:

Entreprise: ${companyName}
Client: ${customerName}
Articles:
${itemsText}

Inclure: numéro de facture, date, conditions de paiement, etc.`,
          },
        ],
        temperature: 0.5,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Invoice generation error:', error);
      throw new Error('Failed to generate invoice');
    }
  }

  /**
   * Obtenir les informations d'utilisation des tokens
   */
  static calculateTokenEstimate(text: string): number {
    // Estimation simple: ~4 caractères = 1 token
    return Math.ceil(text.length / 4);
  }
}

export default AIService;
