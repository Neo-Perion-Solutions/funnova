import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,

      setAuth: (admin, token) => set({ admin, token }),

      clearAuth: () => set({ admin: null, token: null }),
    }),
    {
      name: 'funnova-admin-auth',
    }
  )
);
