export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'viewer';
  companyId: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  settings: Record<string, any>;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  companyId: string;
  createdAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  analysis?: string;
  companyId: string;
  uploadedAt: Date;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  items: InvoiceItem[];
  total: number;
  tax: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  companyId: string;
  createdAt: Date;
  dueDate: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Subscription {
  id: string;
  planId: string;
  companyId: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  stripeSubscriptionId: string;
}
