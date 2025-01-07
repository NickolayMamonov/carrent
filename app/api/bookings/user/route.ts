import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
        }

        const bookings = await prisma.booking.findMany({
            where: { userId: user.id },
            include: {
                car: {
                    select: {
                        make: true,
                        model: true,
                        year: true,
                        images: true,
                        specifications: true,
                    },
                },
                extras: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ bookings });
    } catch (_error) {
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}