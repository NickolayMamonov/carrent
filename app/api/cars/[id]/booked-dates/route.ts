import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Получаем все подтвержденные бронирования
        const bookings = await prisma.booking.findMany({
            where: {
                carId: params.id,
                status: {
                    in: ['CONFIRMED', 'IN_PROGRESS'] // Учитываем только подтвержденные и активные бронирования
                }
            },
            select: {
                startDate: true,
                endDate: true
            }
        });

        // Форматируем даты для возврата
        const bookedDates = bookings.map(booking => ({
            startDate: booking.startDate.toISOString(),
            endDate: booking.endDate.toISOString()
        }));

        return NextResponse.json({ bookedDates });
    } catch (error) {
        console.error('Error fetching booked dates:', error);
        return NextResponse.json(
            { error: 'Ошибка при получении дат бронирования' },
            { status: 500 }
        );
    }
}