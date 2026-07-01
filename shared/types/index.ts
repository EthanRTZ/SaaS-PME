// Types partagés entre frontend et backend

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthPayload {
  userId: string;
  companyId: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

export interface AuthResponse {
  token: string;
  user: UserData;
  company: CompanyData;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface CompanyData {
  id: string;
  name: string;
  logo?: string;
}

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface DocumentData {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  analysis?: DocumentAnalysis;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  entities: string[];
  sentiment: string;
}

export interface InvoiceData {
  id: string;
  number: string;
  customerId: string;
  items: InvoiceItem[];
  total: number;
  tax: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate?: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: Record<string, number>;
}
