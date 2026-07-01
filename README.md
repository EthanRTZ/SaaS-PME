# PME Assistant - SaaS Application

Plateforme d'intelligence artificielle destinée aux petites et moyennes entreprises pour centraliser et automatiser la gestion administrative.

## 🎯 Fonctionnalités

- **Chat IA Intégré**: Assistance intelligente pour les tâches professionnelles
- **Analyse de Documents**: Résumé et interrogation de PDF, Word, images
- **Génération d'Emails**: Creation automatique d'emails professionnels
- **Facturation**: Creation de devis et factures avec export PDF
- **CRM Léger**: Gestion de la base de clients
- **Tableau de Bord**: Suivi de l'activité en temps réel
- **Multi-tenant**: Gestion sécurisée de plusieurs entreprises
- **Authentification**: Système d'authentification robuste avec JWT
- **Gestion des Rôles**: Contrôle d'accès basé sur les rôles

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│          React Components + TypeScript + Tailwind        │
└────────────────────────┬────────────────────────────────┘
                         │
                    REST API (HTTP)
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Backend (Node.js)                      │
│         Express + TypeScript + Prisma ORM               │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼──────┐ ┌──────▼─────────┐
│  PostgreSQL    │ │   Redis   │ │   AWS S3       │
│   Database     │ │  Caching  │ │  File Storage  │
└────────────────┘ └───────────┘ └────────────────┘
        
┌────────────────────────────────────────────────────────┐
│              External Services Integration              │
│  OpenAI (IA) | Stripe (Paiements) | AWS S3 (Fichiers)  │
└────────────────────────────────────────────────────────┘
```

## 📋 Stack Technique

### Frontend
- **Framework**: Next.js 14+
- **UI Library**: React
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query + Zustand
- **Form Validation**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Document Viewer**: PDF.js, Docx preview
- **PDF Generation**: jsPDF, html2pdf

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **AI Integration**: OpenAI API
- **Payment**: Stripe API
- **Storage**: AWS SDK (S3)
- **Email**: Nodemailer
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest + Supertest

### Infrastructure
- **Database**: PostgreSQL 15+
- **Cache**: Redis (optional)
- **Container**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Environment**: Node.js 20+

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)
- OpenAI API key
- Stripe account
- AWS S3 bucket

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd project
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Database setup**
```bash
npm run db:migrate
npm run db:seed
```

5. **Start development servers**
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:3001

### Using Docker

```bash
npm run docker:build
npm run docker:up
```

## 📁 Project Structure

```
SaaS-PME/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── services/        # API client services
│   │   ├── lib/             # Utilities and helpers
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Prisma models definition
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   ├── db/              # Database migrations
│   │   └── utils/           # Helper functions
│   ├── prisma/              # Prisma schema
│   └── package.json
│
├── shared/                   # Shared types and utilities
│   ├── types/
│   └── utils/
│
├── docker/                   # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── docs/                     # Documentation
│   ├── API.md
│   ├── DATABASE.md
│   ├── ARCHITECTURE.md
│   └── SETUP.md
│
└── README.md
```

## 🔐 Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **SQL Injection Prevention**: Parameterized queries with Prisma
- **XSS Protection**: React's built-in XSS prevention
- **CORS**: Strict CORS policy
- **Rate Limiting**: API rate limiting on sensitive endpoints
- **Data Encryption**: Encrypted sensitive data at rest
- **Multi-tenant Isolation**: Strict data isolation between companies

## 📊 Database Schema

Key models:
- **Company**: Multi-tenant organization
- **User**: Application users with roles
- **Customer**: CRM customer management
- **Document**: Uploaded and processed documents
- **Invoice/Quote**: Billing documents
- **Conversation**: Chat history with IA
- **Subscription**: Payment plans

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend

# With coverage
npm run test -- --coverage
```

## 📈 Performance Optimization

- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database query optimization, caching with Redis
- **Storage**: S3 CDN for file serving
- **API**: Response compression, pagination

## 🔄 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL/TLS certificates configured
- [ ] Backup strategy in place
- [ ] Monitoring and logging set up
- [ ] Rate limiting configured
- [ ] Security headers configured

### Deployment Options
- AWS ECS + RDS + S3
- Vercel (Frontend) + Railway (Backend)
- DigitalOcean + App Platform
- Self-hosted with Docker

## 📝 API Documentation

See [API.md](./docs/API.md) for detailed API endpoints documentation.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, email support@saas-pme.com or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Custom AI model training
- [ ] Marketplace for plugins
- [ ] Community forum
- [ ] Advanced reporting

---

**Last Updated**: July 2026
