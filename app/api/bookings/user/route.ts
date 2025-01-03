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
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Преобразуем данные для фронтенда
        const formattedBookings = bookings.map(booking => ({
            id: booking.id,
            car: {
                make: booking.car.make,
                model: booking.car.model,
                year: booking.car.year,
                image: booking.car.images[0] || null,
            },
            startDate: booking.startDate.toISOString(),
            endDate: booking.endDate.toISOString(),
            totalPrice: booking.totalPrice,
            status: booking.status,
        }));

        return NextResponse.json({ bookings: formattedBookings });
    } catch (error) {
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}