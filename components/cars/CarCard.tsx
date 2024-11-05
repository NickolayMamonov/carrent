import React from 'react';
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Car as CarType } from '@/lib/types/car';
import { formatPrice } from '@/lib/utils/format';

interface CarCardProps {
    car: CarType;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            <div className="relative h-48 w-full bg-muted">
                {car.image ? (
                    <img
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <Car className="h-12 w-12" />
                    </div>
                )}
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <h3 className="text-xl font-semibold">{car.make} {car.model}</h3>
                    <p className="text-muted-foreground">{car.year} • {car.type}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {car.features.slice(0, 3).map((feature) => (
                        <span
                            key={feature}
                            className="px-2 py-1 text-xs rounded-full bg-secondary"
                        >
              {feature}
            </span>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold">{formatPrice(car.pricePerDay)} ₽</span>
                        <span className="text-muted-foreground">/день</span>
                    </div>
                    <a href={`/cars/${car.id}`}>
                        <Button>Подробнее</Button>
                    </a>
                </div>
            </div>
        </div>
    );
};