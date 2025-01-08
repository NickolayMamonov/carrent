import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const user = await getAuthUser();

        if (!user || !['ADMIN', 'EDITOR'].includes(user.role)) {
            return NextResponse.json(
                { error: 'Нет доступа' },
                { status: 403 }
            );
        }

        const data = await request.json();

        // Создаем автомобиль
        const car = await prisma.car.create({
            data: {
                make: data.make,
                model: data.model,
                year: data.year,
                pricePerDay: data.pricePerDay,
                type: data.type,
                features: data.features || [],
                images: data.images || [],
                description: data.description || '',
                createdBy: user.id,
                lastModifiedBy: user.id,
                availability: true,
                specifications: {
                    create: {
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
        console.error('Error creating car:', error);
        return NextResponse.json(
            { error: 'Ошибка при создании автомобиля' },
            { status: 500 }
        );
    }
}