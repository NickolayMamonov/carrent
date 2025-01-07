import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const refreshToken = cookies().get('refresh-token')?.value;

        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }

        cookies().delete('auth-token');
        cookies().delete('refresh-token');

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}