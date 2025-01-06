import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Создание нового автомобиля
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

        const car = await prisma.car.create({
            data: {
                ...data,
                createdBy: user.id,
                lastModifiedBy: user.id,
                images: data.images || [],
                features: data.features || [],
                specifications: {
                    create: data.specifications
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

