'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { User, FileText } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-card border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Личные данные</h2>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Отменить' : 'Редактировать'}
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Имя
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            firstName: e.target.value,
                                        })
                                    }
                                    disabled={!isEditing}
                                    className="w-full rounded-md border px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Фамилия
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            lastName: e.target.value,
                                        })
                                    }
                                    disabled={!isEditing}
                                    className="w-full rounded-md border px-3 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className="w-full rounded-md border px-3 py-2"
                            />
                        </div>

                        {isEditing && (
                            <Button type="submit" className="w-full">
                                Сохранить изменения
                            </Button>
                        )}
                    </form>
                </div>

                {/* Driver's License Section */}
                <div className="bg-card border rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <FileText className="h-6 w-6" />
                        <h2 className="text-xl font-semibold">
                            Водительское удостоверение
                        </h2>
                    </div>

                    <Button variant="outline" className="w-full">
                        Добавить водительское удостоверение
                    </Button>
                </div>
            </div>
        </div>
    );
}