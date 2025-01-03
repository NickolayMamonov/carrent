// lib/data/cars.ts
import { prisma } from '@/lib/prisma';

export const getCarById = async (id: string) => {
    const car = await prisma.car.findUnique({
        where: { id },
        include: {
            specifications: true
        }
    });

    if (!car) {
        return null;
    }

    return {
        ...car,
        image: car.images[0] || null
    };
};

export const getFeaturedCars = async () => {
    const cars = await prisma.car.findMany({
        where: { availability: true },
        include: {
            specifications: true
        },
        take: 4
    });

    return cars.map(car => ({
        ...car,
        image: car.images[0] || null
    }));
};