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

        const data = await request.json();

        // Проверяем существование автомобиля
        const existingCar = await prisma.car.findUnique({
            where: { id: params.id }
        });

        if (!existingCar) {
            return NextResponse.json(
                { error: 'Автомобиль не найден' },
                { status: 404 }
            );
        }

        // Обновляем данные автомобиля
        const car = await prisma.car.update({
            where: { id: params.id },
            data: {
                make: data.make,
                model: data.model,
                year: data.year,
                type: data.type,
                pricePerDay: data.pricePerDay,
                description: data.description,
                features: data.features,
                images: data.images,
                lastModifiedBy: user.id,
                specifications: {
                    update: {
                        transmission: data.specifications.transmission,
                        fuelType: data.specifications.fuelType,
                        seats: data.specifications.seats,
                        luggage: data.specifications.luggage
                    }
                }
            },
            include: {
                specifications: true
            }
        });

        return NextResponse.json({ car });
    } catch (error) {
        console.error('Error updating car:', error);
        return NextResponse.json(
            { error: 'Ошибка при обновлении автомобиля' },
            { status: 500 }
        );
    }
}

export async function DELETE(
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

        await prisma.car.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting car:', error);
        return NextResponse.json(
            { error: 'Ошибка при удалении автомобиля' },
            { status: 500 }
        );
    }
}