// components/cars/CarsContainer.tsx
'use client'

import { CarSearch } from "./CarSearch";
import { CarFilter } from "./CarFilter";
import { CarGrid } from "./CarGrid";
import { useCarFilters } from "@/hooks/useCarFilters";
import { useEffect, useState } from "react";
import { Car } from "@/lib/types/car";

export const CarsContainer = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('/api/cars');
                if (response.ok) {
                    const data = await response.json();
                    setCars(data.cars.map((car: any) => ({
                        ...car,
                        pricePerDay: Number(car.pricePerDay),
                        image: car.images[0] || null,
                        description: car.description || ''
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

    const {
        filters,
        updateSearch,
        updatePriceRange,
        toggleType,
        toggleFeature,
        filteredCars
    } = useCarFilters(cars);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
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

            {/* Results */}
            <CarGrid cars={filteredCars} />
        </div>
    );
};