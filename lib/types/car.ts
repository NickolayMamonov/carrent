export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    pricePerDay: number;
    type: string;
    images: string[];
    features: string[];
    availability: boolean;
    description?: string;
    specifications?: {
        transmission?: string;
        fuelType?: string;
        seats?: number;
        luggage?: number;
        mileage?: string;
    };
}

export interface CarFilter {
    priceRange?: {
        min: number;
        max: number;
    };
    types?: string[];
    features?: string[];
    availability?: boolean;
}