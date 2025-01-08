// lib/types/car.ts
export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    pricePerDay: number;
    type: string;
    features: string[];
    availability: boolean;
    image?: string | null;
    images: string[];
    description: string | null;
    specifications: {
        id: string;
        transmission: string | null;
        fuelType: string | null;
        seats: number | null;
        luggage: number | null;
        mileage: string | null;
        carId: string;
    } | null;
    createdBy: string;
    lastModifiedBy: string;
    createdAt: Date;
    updatedAt: Date;
}