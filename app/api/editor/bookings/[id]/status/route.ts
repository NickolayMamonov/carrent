import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getAuthUser();

        if (!user || !['ADMIN', 'EDITOR'].includes(user.role)) {
            return NextResponse.json(
                { error: 'Нет доступа' },
                { status: 403 }
            );
        }

        const { status } = await request.json();

        // Проверяем существование бронирования
        const booking = await prisma.booking.findUnique({
            where: { id: params.id }
        });

        if (!booking) {
            return NextResponse.json(
                { error: 'Бронирование не найдено' },
                { status: 404 }
            );
        }

        // Обновляем статус
        const updatedBooking = await prisma.booking.update({
            where: { id: params.id },
            data: { status },
            include: {
                car: true,
                user: true
            }
        });

        return NextResponse.json({ booking: updatedBooking });
    } catch (error) {
        console.error('Error updating booking status:', error);
        return NextResponse.json(
            { error: 'Ошибка при обновлении статуса' },
            { status: 500 }
        );
    }
}