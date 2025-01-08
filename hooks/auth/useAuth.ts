import { useAuthStore } from '@/auth/useAuthStore';
import { useEffect, useCallback } from 'react';
import type { User } from '@/lib/types/user';

export const useAuth = () => {
    const { user, setUser, isAuthenticated, isAdmin, isEditor } = useAuthStore();

    const checkAuth = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        }
    }, [setUser]);

    useEffect(() => {
        if (!user) {
            checkAuth();
        }
    }, [user, checkAuth]);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка входа');
            }

            const data = await response.json();
            setUser(data.user);
            return data; // Возвращаем данные, включая пользователя
        } catch (error) {
            throw error;
        }
    };

    const updateUserData = useCallback(async () => {
        if (user) {
            await checkAuth();
        }
    }, [user, checkAuth]);

    return {
        user: user as User | null,
        setUser,
        isAuthenticated,
        isAdmin,
        isEditor,
        login,
        updateUserData
    };
};