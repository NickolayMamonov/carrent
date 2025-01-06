import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const cars = await prisma.car.findMany({
            include: {
                specifications: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ cars });
    } catch (error) {
        console.error('Error fetching cars:', error);
        return NextResponse.json(
            { error: 'Ошибка при получении списка автомобилей' },
            { status: 500 }
        );
    }
}