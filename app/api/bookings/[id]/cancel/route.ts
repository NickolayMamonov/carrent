import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteContext {
    params: { id: string }
}

export async function POST(request: Request, context: RouteContext) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: context.params.id },
        });

        if (!booking) {
            return NextResponse.json(
                { error: 'Бронирование не найдено' },
                { status: 404 }
            );
        }

        if (booking.userId !== user.id) {
            return NextResponse.json(
                { error: 'Нет прав для отмены бронирования' },
                { status: 403 }
            );
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'CANCELLED' },
        });

        return NextResponse.json({ booking: updatedBooking });
    } catch (_error) {
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}