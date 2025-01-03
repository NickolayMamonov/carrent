// app/api/bookings/create/route.ts
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

        // Проверяем, существует ли автомобиль
        const car = await prisma.car.findUnique({
            where: { id: carId }
        });

        if (!car) {
            return NextResponse.json(
                { error: 'Автомобиль не найден' },
                { status: 404 }
            );
        }

        // Проверяем, не забронирован ли автомобиль на эти даты
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
                { error: 'Автомобиль уже забронирован на выбранные даты' },
                { status: 400 }
            );
        }

        // Создаем бронирование
        const booking = await prisma.$transaction(async (prisma) => {
            // Создаем основную запись бронирования
            const newBooking = await prisma.booking.create({
                data: {
                    carId,
                    userId: user.id,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    totalPrice,
                    status: 'PENDING'
                }
            });

            // Создаем запись о дополнительных услугах
            await prisma.bookingExtras.create({
                data: {
                    bookingId: newBooking.id,
                    insurance: extras.insurance || false,
                    gps: extras.gps || false,
                    childSeat: extras.childSeat || false,
                    additionalDriver: extras.additionalDriver || false
                }
            });

            // Возвращаем бронирование со всеми связанными данными
            return prisma.booking.findUnique({
                where: { id: newBooking.id },
                include: {
                    car: true,
                    extras: true
                }
            });
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