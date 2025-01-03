import { create } from 'zustand';
import { User } from '@prisma/client';

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isEditor: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set((state) => ({
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isEditor: user?.role === 'EDITOR' || user?.role === 'ADMIN',
    })),
    isAuthenticated: false,
    isAdmin: false,
    isEditor: false,
}));