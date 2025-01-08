import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getAuthUser();

        if (!user || !['ADMIN', 'EDITOR'].includes(user.role)) {
            return NextResponse.json(
                { error: 'Нет доступа' },
                { status: 403 }
            );
        }

        const bookings = await prisma.booking.findMany({
            include: {
                car: {
                    select: {
                        id: true,
                        make: true,
                        model: true,
                        year: true,
                        images: true,
                        specifications: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    }
                },
                extras: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { error: 'Ошибка при получении бронирований' },
            { status: 500 }
        );
    }
}