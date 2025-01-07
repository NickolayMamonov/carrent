
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import {handleDatabaseError} from "@/lib/middleware/errorHandler";
import {Car} from "@/lib/types/car";

interface PaginationResponse {
    cars: Car[];
    pagination: {
        total: number;
        pages: number;
        currentPage: number;
        limit: number;
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');
        const skip = (page - 1) * limit;

        const total = await prisma.car.count();

        const rawCars = await prisma.car.findMany({
            include: {
                specifications: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit,
        });

        // Преобразуем Decimal в number
        const cars: Car[] = rawCars.map(car => ({
            ...car,
            pricePerDay: Number(car.pricePerDay),
            createdAt: new Date(car.createdAt),
            updatedAt: new Date(car.updatedAt)
        }));

        const response: PaginationResponse = {
            cars,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        return handleDatabaseError(error);
    }
}

