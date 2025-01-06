'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Car } from '@/lib/types/car';
import { Plus } from "lucide-react";
import Link from 'next/link';
import { EditorCarCard } from "@/components/cars/EditorCarCard";

export default function EditorCarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await fetch('/api/cars');
            if (response.ok) {
                const data = await response.json();
                setCars(data.cars.map((car: any) => ({
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Управление автомобилями</h1>
                    <p className="text-muted-foreground">
                        Добавление и редактирование автомобилей
                    </p>
                </div>
                <Link href="/editor/cars/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Добавить автомобиль
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                    <EditorCarCard key={car.id} car={car} />
                ))}
            </div>
        </div>
    );
}