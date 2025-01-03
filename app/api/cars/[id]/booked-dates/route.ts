import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                carId: params.id,
                status: {
                    in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
                },
                endDate: {
                    gte: new Date()
                }
            },
            select: {
                startDate: true,
                endDate: true
            }
        });

        return NextResponse.json({ bookedDates: bookings });
    } catch (error) {
        return NextResponse.json(
            { error: 'Ошибка при получении занятых дат' },
            { status: 500 }
        );
    }
}