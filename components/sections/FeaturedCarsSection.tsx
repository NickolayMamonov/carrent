'use client';

import { Button } from "@/components/ui/button";
import CarCard from "@/components/cars/CarCard";
import React, { useState, useEffect } from 'react';
import type { Car } from "@/lib/types/car";
import Link from "next/link";

export default function FeaturedCarsSection() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('/api/cars');
                if (response.ok) {
                    const data = await response.json();
                    setCars(data.cars.slice(0, 4).map((car: any) => ({
                        ...car,
                        pricePerDay: Number(car.pricePerDay)
                    })));
                }
            } catch (error) {
                console.error('Error fetching cars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <section className="px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Популярные автомобили</h2>
                    <Link href="/cars">
                        <Button variant="outline">Все автомобили</Button>
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {cars.map((car) => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            </div>
        </section>
    );
}