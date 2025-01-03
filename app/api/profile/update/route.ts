import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
        }

        const { firstName, lastName, email } = await request.json();

        // Проверяем, не занят ли email другим пользователем
        if (email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return NextResponse.json(
                    { error: 'Email уже используется' },
                    { status: 400 }
                );
            }
        }

        // Обновляем профиль
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { firstName, lastName, email },
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}