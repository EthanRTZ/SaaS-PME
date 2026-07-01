# Guide de Configuration et Installation

## Prérequis

- **Node.js**: 20.x LTS
- **npm**: 10.x
- **PostgreSQL**: 15+
- **Docker**: (optionnel, recommandé)
- **Git**: Pour le contrôle de version

## Installation Locale

### 1. Cloner le repository
```bash
git clone <repository-url>
cd SaaS-PME
```

### 2. Installer les dépendances

```bash
# Installation globale (si utilisation npm workspaces)
npm install

# OU installations individuelles
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 3. Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# En éditer avec vos clés API
nano .env.local
```

**Variables critiques à configurer:**
- `OPENAI_API_KEY`: Obtenir à https://platform.openai.com/api-keys
- `STRIPE_SECRET_KEY`: Obtenir à https://dashboard.stripe.com
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`: Depuis AWS IAM
- `DATABASE_URL`: URL PostgreSQL

### 4. Configuration de la base de données

```bash
# Créer la base de données
createdb saas_pme -U postgres

# Ou via Docker
docker run --name saas-pme-postgres \
  -e POSTGRES_USER=saas_user \
  -e POSTGRES_PASSWORD=saas_password \
  -e POSTGRES_DB=saas_pme \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 5. Migrations Prisma

```bash
cd backend

# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run db:migrate

# (Optionnel) Remplir avec des données de test
npm run db:seed
```

### 6. Démarrer le développement

```bash
# Depuis la racine du projet
npm run dev

# Ou separately:
npm run dev:backend  # Terminal 1 - http://localhost:3001
npm run dev:frontend # Terminal 2 - http://localhost:3000
```

## Installation Docker

### 1. Vérifier Docker
```bash
docker --version
docker-compose --version
```

### 2. Configuration

```bash
# Copier l'env
cp .env.example .env.local

# Éditer les variables
nano .env.local
```

### 3. Démarrer les services

```bash
cd docker

# Build et démarrage
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Accessible à:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

### 4. Arrêter les services

```bash
docker-compose down

# Avec volumes (attention: données supprimées)
docker-compose down -v
```

## Configuration des services externes

### OpenAI

1. Créer un compte: https://openai.com/api/
2. Générer une clé API
3. Configurer dans `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4-turbo
   ```

### AWS S3

1. Créer un compte AWS
2. Créer une clé d'accès IAM:
   - Service: S3 FullAccess
3. Créer un bucket S3
4. Configurer:
   ```
   AWS_REGION=eu-west-1
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_S3_BUCKET=your-bucket-name
   ```

### Stripe

1. Créer un compte: https://stripe.com
2. Obtenir clés API (mode test)
3. Configurer:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Configurer webhook: http://localhost:3001/api/subscriptions/webhook

### Email (Nodemailer)

Pour Gmail:
1. Activer 2FA
2. Obtenir "App Password"
3. Configurer:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@saas-pme.com
   ```

## Tests

### Unit Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### E2E Tests (à configurer)
```bash
npm run test:e2e
```

## Linting & Format

```bash
# Vérifier le code
npm run lint

# Fixer les problèmes
npm run lint:fix

# Vérification des types TypeScript
npm run type-check
```

## Build pour production

```bash
# Build des deux applications
npm run build

# Ou individuellement
npm run build:backend
npm run build:frontend
```

## Variables d'environnement détaillées

### Frontend (.env.local dans frontend/)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=PME Assistant
```

### Backend (.env.local dans racine)
```
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://saas_user:saas_password@localhost:5432/saas_pme

# Auth
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo

# AWS
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=saas-pme-files

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=noreply@saas-pme.com

# Redis (optionnel)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
```

## Troubleshooting

### Port déjà utilisé
```bash
# Linux/Mac: Kill le processus
lsof -ti:3000 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Erreur PostgreSQL
```bash
# Vérifier la connexion
psql -U saas_user -h localhost -d saas_pme

# Réinitialiser les migrations
npm run db:migrate:reset
```

### Erreur Node modules
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur Docker
```bash
# Nettoyer les containers
docker-compose down -v

# Rebuild
docker-compose up -d --build
```

## Prochaines étapes

1. **Connexion**: Accéder à http://localhost:3000 et créer un compte
2. **Configuration**: Compléter les paramètres de l'entreprise
3. **API Testing**: Utiliser Postman ou Insomnia avec les samples dans [API.md](./API.md)
4. **Développement**: Commencer à implémenter les features

## Support

Pour problèmes ou questions:
1. Vérifier la documentation
2. Vérifier les logs: `docker-compose logs backend`
3. Créer une issue sur GitHub
