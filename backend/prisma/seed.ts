import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer une entreprise de test
  const company = await prisma.company.create({
    data: {
      name: 'Tech Startup Inc.',
      settings: {
        currency: 'EUR',
        language: 'fr',
        timezone: 'Europe/Paris',
      },
    },
  });

  console.log('✓ Created company:', company.name);

  // Créer des utilisateurs de test
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      companyId: company.id,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'user',
      companyId: company.id,
    },
  });

  console.log('✓ Created users');

  // Créer des clients de test
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Client A',
        email: 'clienta@example.com',
        phone: '+33612345678',
        city: 'Paris',
        companyId: company.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Client B',
        email: 'clientb@example.com',
        phone: '+33687654321',
        city: 'Lyon',
        companyId: company.id,
      },
    }),
  ]);

  console.log('✓ Created customers');

  // Créer des factures de test
  const invoice = await prisma.invoice.create({
    data: {
      number: 'INV-2026-001',
      type: 'invoice',
      items: [
        {
          description: 'Consulting Services',
          quantity: 10,
          unitPrice: 100,
        },
      ],
      total: 1200,
      tax: 200,
      status: 'draft',
      customerId: customers[0].id,
      companyId: company.id,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    },
  });

  console.log('✓ Created invoice');

  // Créer une conversation de test
  const conversation = await prisma.conversation.create({
    data: {
      userId: regularUser.id,
      companyId: company.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'Comment puis-je créer une facture?',
          },
          {
            role: 'assistant',
            content:
              'Vous pouvez créer une facture en allant à la section Facturation et en cliquant sur "Nouvelle facture".',
          },
        ],
      },
    },
  });

  console.log('✓ Created conversation with messages');

  // Créer une souscription de test
  const subscription = await prisma.subscription.create({
    data: {
      planId: 'plan-pro',
      status: 'active',
      stripeCustomerId: 'cus_test_123',
      stripeSubscriptionId: 'sub_test_123',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
      companyId: company.id,
    },
  });

  console.log('✓ Created subscription');

  console.log('\n✅ Database seeding completed!');
  console.log('\nTest credentials:');
  console.log('Admin:');
  console.log('  Email: admin@example.com');
  console.log('  Password: password123');
  console.log('\nRegular user:');
  console.log('  Email: user@example.com');
  console.log('  Password: password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
