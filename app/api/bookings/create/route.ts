import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
        }

        const { carId, startDate, endDate, extras, totalPrice } = await request.json();

        // Проверяем доступность автомобиля на выбранные даты
        const existingBooking = await prisma.booking.findFirst({
            where: {
                carId,
                status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
                OR: [
                    {
                        AND: [
                            { startDate: { lte: new Date(startDate) } },
                            { endDate: { gte: new Date(startDate) } },
                        ],
                    },
                    {
                        AND: [
                            { startDate: { lte: new Date(endDate) } },
                            { endDate: { gte: new Date(endDate) } },
                        ],
                    },
                ],
            },
        });

        if (existingBooking) {
            return NextResponse.json(
                { error: 'Автомобиль недоступен на выбранные даты' },
                { status: 400 }
            );
        }

        // Создаем бронирование с дополнительными услугами
        const booking = await prisma.booking.create({
            data: {
                carId,
                userId: user.id,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPrice,
                status: 'PENDING',
                extras: {
                    create: extras
                }
            },
            include: {
                car: true,
                extras: true
            }
        });

        return NextResponse.json({ booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Ошибка при создании бронирования' },
            { status: 500 }
        );
    }
}