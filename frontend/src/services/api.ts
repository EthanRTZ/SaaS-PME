import apiClient from '@/lib/api-client';

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
  }) => apiClient.post('/auth/register', data),

  logout: () => apiClient.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),

  updateProfile: (data: any) => apiClient.put('/users/profile', data),

  getAll: () => apiClient.get('/users'),

  create: (data: any) => apiClient.post('/users', data),

  delete: (userId: string) => apiClient.delete(`/users/${userId}`),
};

export const customerAPI = {
  getAll: () => apiClient.get('/customers'),

  getById: (id: string) => apiClient.get(`/customers/${id}`),

  create: (data: any) => apiClient.post('/customers', data),

  update: (id: string, data: any) => apiClient.put(`/customers/${id}`, data),

  delete: (id: string) => apiClient.delete(`/customers/${id}`),
};

export const documentAPI = {
  getAll: () => apiClient.get('/documents'),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  analyze: (documentId: string) =>
    apiClient.post(`/documents/${documentId}/analyze`),

  delete: (id: string) => apiClient.delete(`/documents/${id}`),
};

export const invoiceAPI = {
  getAll: () => apiClient.get('/invoices'),

  create: (data: any) => apiClient.post('/invoices', data),

  generatePDF: (invoiceId: string) =>
    apiClient.get(`/invoices/${invoiceId}/pdf`),

  createQuote: (data: any) => apiClient.post('/invoices/quote', data),
};

export const chatAPI = {
  getHistory: () => apiClient.get('/chat/history'),

  sendMessage: (message: string, context?: any) =>
    apiClient.post('/chat/message', { message, context }),

  generateEmail: (data: any) =>
    apiClient.post('/chat/generate-email', data),

  clearHistory: () => apiClient.delete('/chat/history'),
};

export const subscriptionAPI = {
  getPlans: () => apiClient.get('/subscriptions/plans'),

  getCurrent: () => apiClient.get('/subscriptions/current'),

  checkout: (planId: string) =>
    apiClient.post('/subscriptions/checkout', { planId }),

  cancel: () => apiClient.post('/subscriptions/cancel'),
};
