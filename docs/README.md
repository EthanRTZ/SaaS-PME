# SaaS PME - Application Assistant IA pour PME

Plateforme cloud complète pour centraliser et automatiser la gestion administrative des PME grâce à l'intelligence artificielle.

## 📊 Status du Projet

**Phase**: MVP Development
**Last Updated**: Juillet 2026
**Version**: 0.1.0

## 🎯 Vision

Créer un assistant IA simple d'utilisation qui permet aux PME de:
- Réduire les tâches administratives répétitives
- Générer de la documentation professionnelle automatiquement
- Centraliser la gestion des clients et factures
- Maximiser la productivité avec une IA intégrée

## 📦 Contenu du projet

```
SaaS-PME/
├── frontend/          # Application Next.js
├── backend/           # API Node.js/Express
├── docs/              # Documentation
├── docker/            # Docker configuration
├── shared/            # Code partagé
└── README.md          # Ce fichier
```

## 🚀 Quick Start

### Avec Docker (Recommandé)
```bash
npm run docker:up
# Frontend: http://localhost:3000
# API: http://localhost:3001
```

### Local Setup
```bash
npm install
npm run dev
```

Voir [SETUP.md](./docs/SETUP.md) pour les instructions détaillées.

## 🏗️ Architecture

### Stack technique
- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Storage**: AWS S3
- **IA**: OpenAI API
- **Payments**: Stripe

### Modèle architectural
- Multi-tenant avec isolation par entreprise
- API REST sécurisée avec JWT
- Scalable et performante

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Vue d'ensemble technique
- [API](./docs/API.md) - Endpoints et exemples
- [Database](./docs/DATABASE.md) - Schéma et relations
- [Setup](./docs/SETUP.md) - Installation et configuration
- [Roadmap](./docs/ROADMAP.md) - Plan de développement

## ✨ Fonctionnalités principales

### Phase 1 (MVP)
- ✅ Authentification et autorisation
- ✅ Gestion multi-tenant
- 🔄 Dashboard
- 🔄 Chat IA intégré
- 🔄 Upload et analyse de documents
- 🔄 Gestion CRM basique
- 🔄 Génération de factures
- 🔄 Intégration Stripe

### Phase 2+
- Génération automatique d'emails
- Synchronisation avec calendrier
- Applications mobiles
- Intégrations avancées
- Analytics détaillés

Pour plus de détails, voir [ROADMAP.md](./docs/ROADMAP.md)

## 🔐 Sécurité

- Authentification JWT
- Bcrypt pour les mots de passe
- Isolation multi-tenant stricte
- Chiffrement des données sensibles
- CORS et headers de sécurité
- SQL injection prevention (Prisma ORM)

## 📈 Performance

- Redis caching
- Pagination sur toutes les listes
- Optimisation des images
- Code splitting frontend
- Compression gzip

## 🧪 Testing

```bash
npm run test              # Run all tests
npm run test:backend      # Backend only
npm run test:frontend     # Frontend only
npm run test:ci           # CI mode avec coverage
```

## 🤝 Contributing

Les contributions sont bienvenues! Voir [CONTRIBUTING.md](./CONTRIBUTING.md)

### Zones principales de contribution
1. **Authentification** - Implémentation complète des routes auth
2. **Chat IA** - Interface et intégration OpenAI
3. **Documents** - Upload et analyse
4. **Facturation** - Intégration Stripe
5. **Tests** - Amélioration de la couverture

## 📝 Environment Variables

Copier [.env.example](./.env.example) vers `.env.local` et remplir:

```
OPENAI_API_KEY=          # OpenAI
AWS_*=                   # AWS S3
STRIPE_*=                # Stripe keys
DATABASE_URL=            # PostgreSQL
JWT_SECRET=              # JWT secret
```

## 🐛 Troubleshooting

### Port déjà utilisé
```bash
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Erreur de base de données
```bash
npm run db:migrate:reset
```

### Docker issues
```bash
docker-compose down -v
docker-compose up -d --build
```

Voir [SETUP.md](./docs/SETUP.md) pour plus de solutions.

## 📊 Project Health

- ✅ CI/CD Ready
- ✅ Docker Configured
- ✅ Database Schema Complete
- ✅ API Routes Scaffolded
- 🔄 Frontend Pages (In Progress)
- 🔄 Business Logic (To Do)
- 🔄 Testing (To Do)

## 📞 Support

- 📖 [Documentation](./docs)
- 💬 [GitHub Issues](https://github.com/yourrepo/issues)
- 📧 support@saas-pme.com

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🙏 Acknowledgments

- OpenAI for powerful AI capabilities
- Vercel for Next.js
- Prisma for amazing ORM
- The open source community

---

**Built with ❤️ for SMEs** | (c) 2026 PME Assistant
