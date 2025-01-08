import { useState } from 'react';
import { useAuthStore } from '@/auth/useAuthStore';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка входа');
            }

            const data = await response.json();
            setUser(data.user);
        } finally {
            setLoading(false);
        }
    };

    return { login, loading };
};