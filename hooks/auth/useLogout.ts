import { useState } from 'react';
import { useAuthStore } from '@/auth/useAuthStore';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();

    const logout = async () => {
        setLoading(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    return { logout, loading };
};