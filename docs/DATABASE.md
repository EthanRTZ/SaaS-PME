# Base de Données

## Vue d'ensemble

La base de données PostgreSQL est le cœur du système. Elle stocke toutes les données de l'application avec une architecture multi-tenant.

## Schéma de base

### Modèles multi-tenant

#### Companies
- Représente chaque PME/entreprise Cliente
- Stocke les paramètres de l'entreprise (nom, logo, settings)

```sql
CREATE TABLE companies (
  id STRING PRIMARY KEY,
  name STRING NOT NULL,
  logo STRING,
  settings JSONB DEFAULT '{}',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Users
- Utilisateurs au sein d'une entreprise
- Liés à une Company via companyId
- Rôles: admin, user, viewer

```sql
CREATE TABLE users (
  id STRING PRIMARY KEY,
  email STRING UNIQUE NOT NULL,
  password STRING NOT NULL (bcrypt),
  firstName STRING,
  lastName STRING,
  role STRING DEFAULT 'user',
  avatar STRING,
  companyId STRING NOT NULL (FK),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_companyId ON users(companyId);
```

### Modèles métier

#### Customers (CRM)
Gestion de la base de clients

```sql
CREATE TABLE customers (
  id STRING PRIMARY KEY,
  name STRING NOT NULL,
  email STRING NOT NULL,
  phone STRING,
  address STRING,
  city STRING,
  postalCode STRING,
  notes TEXT,
  companyId STRING NOT NULL (FK),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

#### Invoices (Facturation)
Factures et devis

```sql
CREATE TABLE invoices (
  id STRING PRIMARY KEY,
  number STRING UNIQUE,
  type STRING DEFAULT 'invoice', -- invoice, quote
  items JSONB, -- [{ description, quantity, unitPrice }]
  total FLOAT,
  tax FLOAT DEFAULT 0,
  status STRING DEFAULT 'draft', -- draft, sent, paid, overdue
  dueDate TIMESTAMP,
  customerId STRING NOT NULL (FK),
  companyId STRING NOT NULL (FK),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE INDEX idx_invoices_companyId ON invoices(companyId);
CREATE INDEX idx_invoices_customerId ON invoices(customerId);
```

#### Documents (Stockage)
Fichiers uploadés et analysés

```sql
CREATE TABLE documents (
  id STRING PRIMARY KEY,
  name STRING NOT NULL,
  type STRING, -- pdf, docx, image
  size INT,
  url STRING NOT NULL, -- S3 URL
  analysis TEXT, -- JSON avec résultats analyse
  companyId STRING NOT NULL (FK),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE INDEX idx_documents_companyId ON documents(companyId);
```

#### Conversations & Messages (Chat IA)
Historique de conversation avec l'IA

```sql
CREATE TABLE conversations (
  id STRING PRIMARY KEY,
  userId STRING NOT NULL (FK),
  companyId STRING NOT NULL (FK),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE TABLE messages (
  id STRING PRIMARY KEY,
  conversationId STRING NOT NULL (FK),
  role STRING NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  tokens INT, -- Tokens OpenAI utilisés
  createdAt TIMESTAMP
);

CREATE INDEX idx_conversations_userId ON conversations(userId);
CREATE INDEX idx_conversations_companyId ON conversations(companyId);
CREATE INDEX idx_messages_conversationId ON messages(conversationId);
```

#### Subscriptions (Paiements)
Gestion des abonnements

```sql
CREATE TABLE subscriptions (
  id STRING PRIMARY KEY,
  planId STRING NOT NULL,
  status STRING DEFAULT 'active', -- active, cancelled, expired
  stripeSubscriptionId STRING UNIQUE,
  stripeCustomerId STRING,
  startDate TIMESTAMP DEFAULT NOW(),
  endDate TIMESTAMP,
  cancelledAt TIMESTAMP,
  companyId STRING NOT NULL (FK),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE INDEX idx_subscriptions_companyId ON subscriptions(companyId);
```

### Modèles auxiliaires

#### Payments
```sql
CREATE TABLE payments (
  id STRING PRIMARY KEY,
  amount FLOAT NOT NULL,
  currency STRING DEFAULT 'EUR',
  status STRING DEFAULT 'pending', -- pending, succeeded, failed
  stripePaymentId STRING UNIQUE,
  invoiceId STRING,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

#### AuditLog
```sql
CREATE TABLE audit_logs (
  id STRING PRIMARY KEY,
  action STRING NOT NULL,
  entity STRING NOT NULL,
  entityId STRING NOT NULL,
  userId STRING,
  companyId STRING,
  changes JSONB,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_companyId ON audit_logs(companyId);
CREATE INDEX idx_audit_logs_userId ON audit_logs(userId);
```

## Migrations

Toutes les migrations sont gérées avec Prisma:

```bash
# Créer une nouvelle migration
npx prisma migrate dev --name add_field_name

# Appliquer les migrations (production)
npx prisma migrate deploy

# Réinitialiser la DB (développement seulement)
npx prisma migrate reset
```

## Seed (Données initiales)

Remplir la base de données avec des données de test:

```bash
npm run db:seed
```

Voir `backend/prisma/seed.ts` pour les données initiales.

## Sauvegardes

### Développement
Les données sont stockées dans un volume Docker:
```bash
docker volume ls | grep postgres_data
```

### Production
- Sauvegardes automatiques quotidiennes
- Réplication pour la haute disponibilité
- Point-in-time recovery

## Performance

### Indexes
Les indexes principaux sont déjà créés sur:
- `companyId` - Filtering multi-tenant
- `userId` - User queries
- `customerId` - Customer lookups
- `createdAt` - Sorting chronologique

### Pagination
Toutes les listes doivent utiliser la pagination:
```typescript
const users = await prisma.user.findMany({
  where: { companyId },
  take: 10, // Limit
  skip: (page - 1) * 10, // Offset
  orderBy: { createdAt: 'desc' }
});
```

## Maintenance

### Analyzing Query Performance
```sql
EXPLAIN ANALYZE
SELECT * FROM customers WHERE companyId = '...';
```

### Vacuum (PostgreSQL)
```sql
VACUUM ANALYZE;
```

## Connexion directe

Pour accéder directement à la base de données:

```bash
# Via Docker
docker exec -it saas-pme-postgres psql -U saas_user -d saas_pme

# Via Prisma Studio
npm run db:studio
```

## Restore from backup

```bash
# Dump
pg_dump -U saas_user saas_pme > backup.sql

# Restore
psql -U saas_user saas_pme < backup.sql
```

## Relationships Diagram

```
Company (1) ──── (many) Users
       ├──── (many) Customers
       ├──── (many) Documents
       ├──── (many) Invoices
       ├──── (many) Conversations
       └──── (many) Subscriptions

User (1) ──── (many) Conversations

Customer (1) ──── (many) Invoices

Conversation (1) ──── (many) Messages
```
