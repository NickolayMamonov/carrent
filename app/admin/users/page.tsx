'use client';

import Image from 'next/image';
import React, {useState, useEffect, useRef} from 'react';
import { Button } from "@/components/ui/button";
import { User } from '@/lib/types/user';
import { Shield, User as UserIcon, Pencil } from 'lucide-react';
export const dynamic = 'force-dynamic';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            fetchUsers();
            firstRender.current = false;
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Ошибка при загрузке пользователей');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update role');
            }

            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, role: newRole as 'USER' | 'EDITOR' | 'ADMIN' }
                    : user
            ));
            setEditingUser(null);
            setSuccess('Роль успешно обновлена');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error updating role:', error);
            setError(error instanceof Error ? error.message : 'Ошибка при обновлении роли');
            setTimeout(() => setError(null), 3000);
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-800';
            case 'EDITOR':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'Администратор';
            case 'EDITOR':
                return 'Редактор';
            default:
                return 'Пользователь';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-6 w-6"/>
                    <h1 className="text-2xl font-bold">Управление пользователями</h1>
                </div>
                <p className="text-muted-foreground">
                    Управление ролями пользователей в системе
                </p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
                    {success}
                </div>
            )}

            <div className="bg-card border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">Пользователь</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Роль</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Действия</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            {user.avatar ? (
                                                <Image
                                                    src={user.avatar}
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <UserIcon className="h-5 w-5 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Создан: {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm">{user.email}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {editingUser === user.id ? (
                                        <select
                                            className="rounded-md border px-3 py-1 text-sm"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            autoFocus
                                            onBlur={() => setEditingUser(null)}
                                        >
                                            <option value="USER">Пользователь</option>
                                            <option value="EDITOR">Редактор</option>
                                            <option value="ADMIN">Администратор</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                                                {getRoleLabel(user.role)}
                                            </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingUser(user.id)}
                                        className="flex items-center gap-2"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Изменить роль
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}