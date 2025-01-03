import { useAuthStore } from '@/auth/useAuthStore';
import { useEffect } from 'react';

export const useAuth = () => {
    const { user, setUser, isAuthenticated, isAdmin, isEditor } = useAuthStore();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            }
        };

        if (!user) {
            checkAuth();
        }
    }, [user, setUser]);

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
        } catch (error) {
            throw error;
        }
    };

    return { user, isAuthenticated, isAdmin, isEditor, login };
};