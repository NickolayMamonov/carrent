import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getAuthUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Доступ запрещен' },
                { status: 403 }
            );
        }

        const { role } = await request.json();

        // Проверяем, что роль допустима
        if (!['USER', 'EDITOR', 'ADMIN'].includes(role)) {
            return NextResponse.json(
                { error: 'Недопустимая роль' },
                { status: 400 }
            );
        }

        // Запрещаем администратору менять свою роль
        if (params.id === user.id) {
            return NextResponse.json(
                { error: 'Нельзя изменить свою роль' },
                { status: 400 }
            );
        }

        // Обновляем роль пользователя
        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { role: role as 'USER' | 'EDITOR' | 'ADMIN' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                createdAt: true,
                isVerified: true,
            }
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}