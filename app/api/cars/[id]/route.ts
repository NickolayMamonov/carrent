import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const car = await prisma.car.findUnique({
            where: { id: params.id },
            include: {
                specifications: true
            }
        });

        if (!car) {
            return NextResponse.json(
                { error: 'Автомобиль не найден' },
                { status: 404 }
            );
        }

        return NextResponse.json(car);
    } catch (error) {
        console.error('Error fetching car:', error);
        return NextResponse.json(
            { error: 'Ошибка при получении данных автомобиля' },
            { status: 500 }
        );
    }
}