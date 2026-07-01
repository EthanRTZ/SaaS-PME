import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
  logo?: string;
}

interface AuthStore {
  user: User | null;
  company: Company | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, company: Company, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  company: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, company, token) =>
    set({
      user,
      company,
      token,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      user: null,
      company: null,
      token: null,
      isAuthenticated: false,
    }),
}));
