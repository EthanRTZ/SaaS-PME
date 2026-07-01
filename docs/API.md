# API Documentation

## Vue d'ensemble

L'API REST suit les conventions RESTful standards avec préfixe `/api/` et authentification JWT.

## Authentification

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin"
  },
  "company": {
    "id": "company-id",
    "name": "My Company"
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "My Company"
}

Response 201:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... },
  "company": { ... }
}
```

### Headers requis
Tous les endpoints protégés nécessitent:
```http
Authorization: Bearer <token>
```

## Endpoints

### Users

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>

Response 200:
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "admin",
  "company": { ... }
}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "avatar": "https://..."
}

Response 200:
{ ... updated user ... }
```

#### Get Company Users
```http
GET /api/users
Authorization: Bearer <token>

Response 200:
[
  { id, email, firstName, lastName, role },
  ...
]
```

### Customers (CRM)

#### Get All Customers
```http
GET /api/customers?page=1&limit=10
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "customer-id",
    "name": "Client Name",
    "email": "client@example.com",
    "phone": "+33...",
    "address": "...",
    "city": "...",
    "postalCode": "..."
  },
  ...
]
```

#### Create Customer
```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+33...",
  "address": "...",
  "city": "...",
  "postalCode": "..."
}

Response 201:
{ ... created customer ... }
```

#### Get Customer
```http
GET /api/customers/:customerId
Authorization: Bearer <token>

Response 200:
{ ... customer details ... }
```

#### Update Customer
```http
PUT /api/customers/:customerId
Authorization: Bearer <token>
Content-Type: application/json

{ ... fields to update ... }

Response 200:
{ ... updated customer ... }
```

#### Delete Customer
```http
DELETE /api/customers/:customerId
Authorization: Bearer <token>

Response 204:
```

### Documents

#### Upload Document
```http
POST /api/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary file>

Response 201:
{
  "id": "document-id",
  "name": "document.pdf",
  "type": "pdf",
  "size": 1024000,
  "url": "https://s3.amazonaws.com/..."
}
```

#### Get All Documents
```http
GET /api/documents
Authorization: Bearer <token>

Response 200:
[ ... documents ... ]
```

#### Analyze Document
```http
POST /api/documents/:documentId/analyze
Authorization: Bearer <token>

Response 200:
{
  "id": "document-id",
  "analysis": {
    "summary": "...",
    "keyPoints": ["...", "..."],
    "entities": [...],
    "sentiment": "..."
  }
}
```

### Invoices

#### Get All Invoices
```http
GET /api/invoices?status=draft&page=1
Authorization: Bearer <token>

Response 200:
[ ... invoices ... ]
```

#### Create Invoice
```http
POST /api/invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "customer-id",
  "items": [
    {
      "description": "Service",
      "quantity": 1,
      "unitPrice": 100
    }
  ],
  "tax": 20,
  "dueDate": "2026-08-02"
}

Response 201:
{
  "id": "invoice-id",
  "number": "INV-001",
  "total": 120,
  "status": "draft"
}
```

#### Generate PDF
```http
GET /api/invoices/:invoiceId/pdf
Authorization: Bearer <token>

Response 200:
<PDF binary content>
Content-Type: application/pdf
```

#### Create Quote
```http
POST /api/invoices/quote
Authorization: Bearer <token>
Content-Type: application/json

{ ... same as invoice ... }

Response 201:
{ ... quote data ... }
```

### Chat (IA)

#### Get Chat History
```http
GET /api/chat/history?conversationId=...
Authorization: Bearer <token>

Response 200:
{
  "conversationId": "...",
  "messages": [
    {
      "id": "msg-id",
      "role": "user",
      "content": "...",
      "timestamp": "2026-07-02T10:00:00Z"
    },
    {
      "id": "msg-id",
      "role": "assistant",
      "content": "...",
      "timestamp": "2026-07-02T10:00:05Z"
    }
  ]
}
```

#### Send Message
```http
POST /api/chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Aide-moi à rédiger un email",
  "context": {
    "type": "email-generation",
    "subject": "Follow-up"
  }
}

Response 200:
{
  "conversationId": "...",
  "message": {
    "id": "msg-id",
    "role": "assistant",
    "content": "Voici un projet d'email...",
    "timestamp": "..."
  }
}
```

#### Generate Email
```http
POST /api/chat/generate-email
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Follow-up meeting",
  "context": "Relance client après démo",
  "tone": "professionnel"
}

Response 200:
{
  "email": {
    "subject": "Follow-up meeting",
    "body": "Madame, Monsieur,\n\nJe suite à..."
  }
}
```

### Subscriptions

#### Get Plans
```http
GET /api/subscriptions/plans
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "plan-basic",
    "name": "Basic",
    "price": 29,
    "features": ["Chat IA", "10 documents/mois", ...]
  },
  {
    "id": "plan-pro",
    "name": "Professionnel",
    "price": 99,
    "features": ["Chat IA illimité", "Documents illimitées", ...]
  }
]
```

#### Get Current Subscription
```http
GET /api/subscriptions/current
Authorization: Bearer <token>

Response 200:
{
  "id": "sub-id",
  "planId": "plan-pro",
  "status": "active",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "nextBillingDate": "2026-08-01"
}
```

#### Create Checkout Session
```http
POST /api/subscriptions/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "plan-pro"
}

Response 200:
{
  "sessionId": "stripe-session-id",
  "url": "https://checkout.stripe.com/pay/..."
}
```

#### Cancel Subscription
```http
POST /api/subscriptions/cancel
Authorization: Bearer <token>

Response 200:
{
  "id": "sub-id",
  "status": "cancelled",
  "cancelledAt": "2026-07-02"
}
```

## Status Codes

- `200 OK`: Succès
- `201 Created`: Ressource créée
- `204 No Content`: Suppression réussie
- `400 Bad Request`: Données invalides
- `401 Unauthorized`: Authentication requise
- `403 Forbidden`: Accès refusé
- `404 Not Found`: Ressource inexistante
- `409 Conflict`: Conflict (ex: email déjà utilisé)
- `500 Internal Server Error`: Erreur serveur

## Pagination

Pour les listes:
```http
GET /api/customers?page=1&limit=10&sort=name&order=asc

Query Parameters:
- page: Numéro de page (défaut: 1)
- limit: Nombre de résultats (défaut: 10, max: 100)
- sort: Champ de tri (défaut: createdAt)
- order: Ordre (asc|desc, défaut: desc)

Response 200:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

## Erreurs

Format standard des erreurs:
```json
{
  "error": "Invalid email format",
  "status": 400,
  "details": {
    "field": "email",
    "reason": "Must be a valid email"
  }
}
```

## Rate Limiting

À implémenter:
- 100 requêtes/minute pour utilisateurs authentifiés
- 10 requêtes/minute pour endpoints publics
- 1 requête/seconde pour uploads de fichiers

## CORS

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```
