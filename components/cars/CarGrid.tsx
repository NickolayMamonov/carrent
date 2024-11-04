'use client'

import { Car } from "@/lib/types/car";
import CarCard from "./CarCard";

const DEMO_CARS: Car[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    pricePerDay: 65,
    type: 'Sedan',
    images: ['/cars/camry.jpg'],
    features: ['Automatic', 'Bluetooth', 'Cruise Control'],
    availability: true,
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    pricePerDay: 85,
    type: 'SUV',
    images: ['/cars/crv.jpg'],
    features: ['AWD', 'Backup Camera', 'Apple CarPlay'],
    availability: true,
  },
  // Добавьте больше демо-автомобилей по необходимости
];

export default function CarGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {DEMO_CARS.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}