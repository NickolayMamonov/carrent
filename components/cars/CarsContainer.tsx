'use client';

import { CarSearch } from "./CarSearch";
import { CarFilter } from "./CarFilter";
import CarGrid from "./CarGrid"; // Изменен импорт на импорт по умолчанию
import { useCarFilters } from "@/hooks/useCarFilters";
import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Car } from "@/lib/types/car";

export const CarsContainer = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const pathname = usePathname();
    const isEditorPage = pathname.startsWith('/editor');
    const hasEditRights = user?.role === 'EDITOR' || user?.role === 'ADMIN';

    const {
        filters,
        updateSearch,
        updatePriceRange,
        toggleType,
        toggleFeature,
        filteredCars
    } = useCarFilters(cars);

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
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex flex-col md:flex-row gap-4 flex-grow">
                    <CarSearch value={filters.search} onSearch={updateSearch} />
                    <CarFilter
                        selectedTypes={filters.types}
                        selectedFeatures={filters.features}
                        priceRange={filters.priceRange}
                        onTypeToggle={toggleType}
                        onFeatureToggle={toggleFeature}
                        onPriceRangeChange={updatePriceRange}
                    />
                </div>
                {hasEditRights && isEditorPage && (
                    <Link href="/editor/cars/new">
                        <Button className="w-full md:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Добавить автомобиль
                        </Button>
                    </Link>
                )}
            </div>

            <CarGrid cars={filteredCars} isEditor={isEditorPage && hasEditRights} />
        </div>
    );
};