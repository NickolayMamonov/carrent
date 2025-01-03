import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        const refreshToken = cookies().get('refresh-token')?.value;

        if (refreshToken) {
            // Удаляем refresh token из базы
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }

        // Удаляем куки
        cookies().delete('auth-token');
        cookies().delete('refresh-token');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}