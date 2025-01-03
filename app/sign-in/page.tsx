'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/auth/useAuth';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto space-y-6 py-12">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Вход в систему</h1>
                <p className="text-muted-foreground mt-2">
                    Введите ваши данные для входа
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border px-3 py-2"
                        required
                    />
                </div>

                {error && (
                    <div className="text-sm text-destructive">{error}</div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">Нет аккаунта? </span>
                <Link href="/sign-up" className="text-primary hover:underline">
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    );
}