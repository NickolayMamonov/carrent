export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    pricePerDay: number;
    type: string;
    features: string[];
    availability: boolean;
    image: string;
    description: string;
    specifications: {
        transmission: string;
        fuelType: string;
        seats: number;
        luggage: number;
        mileage: string;
    };
}