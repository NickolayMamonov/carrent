'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { User, Camera, Loader2 } from "lucide-react";

interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ProfilePage() {
    const { user, updateUserData } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/profile/avatar', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке фото');
            }

            await updateUserData();
            setSuccess('Фото успешно обновлено');
        } catch (err) {
            setError('Ошибка при загрузке фото');
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Проверка паролей при их изменении
        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                setError('Новый пароль должен быть не менее 6 символов');
                setLoading(false);
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setError('Пароли не совпадают');
                setLoading(false);
                return;
            }
            if (!formData.currentPassword) {
                setError('Введите текущий пароль');
                setLoading(false);
                return;
            }
        }

        try {
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    currentPassword: formData.currentPassword || undefined,
                    newPassword: formData.newPassword || undefined,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка при обновлении профиля');
            }

            await updateUserData();
            setSuccess('Профиль успешно обновлен');
            setIsEditing(false);

            // Очищаем поля пароля
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-card border rounded-lg p-8">
                {/* Заголовок */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Профиль</h1>
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        disabled={loading}
                    >
                        {isEditing ? 'Отменить' : 'Редактировать'}
                    </Button>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Фото профиля */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full bg-muted overflow-hidden">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="h-full w-full p-6 text-muted-foreground" />
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 cursor-pointer">
                                    <div className="rounded-full p-2 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Camera className="h-4 w-4" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={loading}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Основные данные */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium mb-2">Имя</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                disabled={!isEditing || loading}
                                className="w-full rounded-md border px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Фамилия</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                disabled={!isEditing || loading}
                                className="w-full rounded-md border px-3 py-2"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing || loading}
                            className="w-full rounded-md border px-3 py-2"
                            required
                        />
                    </div>

                    {/* Смена пароля */}
                    {isEditing && (
                        <div className="space-y-6 border-t pt-6">
                            <h3 className="font-medium">Изменить пароль</h3>
                            <div>
                                <label className="block text-sm font-medium mb-2">Текущий пароль</label>
                                <input
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    disabled={loading}
                                    className="w-full rounded-md border px-3 py-2"
                                />
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Новый пароль</label>
                                    <input
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        disabled={loading}
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Подтверждение пароля</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        disabled={loading}
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Сообщения об ошибках и успехе */}
                    {error && (
                        <div className="text-sm text-destructive">{error}</div>
                    )}
                    {success && (
                        <div className="text-sm text-green-600">{success}</div>
                    )}

                    {/* Кнопки */}
                    {isEditing && (
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {loading ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
}