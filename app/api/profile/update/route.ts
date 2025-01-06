import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
        }

        const { firstName, lastName, email, currentPassword, newPassword } = await request.json();

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

        // Объект с данными для обновления
        const updateData: any = {
            firstName,
            lastName,
            email,
        };

        // Если передан новый пароль, проверяем текущий и обновляем
        if (newPassword) {
            // Проверяем текущий пароль
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return NextResponse.json(
                    { error: 'Неверный текущий пароль' },
                    { status: 400 }
                );
            }

            // Хешируем новый пароль
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        // Обновляем данные пользователя
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
        });

        // Возвращаем данные пользователя без пароля
        const { password: _, ...userWithoutPassword } = updatedUser;
        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}