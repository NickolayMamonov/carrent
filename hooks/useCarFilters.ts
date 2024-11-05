'use client'

import { useState } from 'react';
import type { CarFilters, PriceRange } from '@/lib/types/filters';
import type { Car } from '@/lib/types/car';

const initialFilters: CarFilters = {
    search: '',
    types: [],
    features: []
};

export const useCarFilters = (cars: Car[]) => {
    const [filters, setFilters] = useState<CarFilters>(initialFilters);

    const updateSearch = (search: string) => {
        setFilters(prev => ({ ...prev, search }));
    };

    const updatePriceRange = (priceRange: PriceRange) => {
        setFilters(prev => ({ ...prev, priceRange }));
    };

    const toggleType = (type: string) => {
        setFilters(prev => ({
            ...prev,
            types: prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type]
        }));
    };

    const toggleFeature = (feature: string) => {
        setFilters(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const filteredCars = cars.filter(car => {
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                car.make.toLowerCase().includes(searchTerm) ||
                car.model.toLowerCase().includes(searchTerm) ||
                car.type.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }

        // Type filter
        if (filters.types.length > 0) {
            if (!filters.types.includes(car.type)) return false;
        }

        // Feature filter
        if (filters.features.length > 0) {
            const hasAllFeatures = filters.features.every(feature =>
                car.features.includes(feature)
            );
            if (!hasAllFeatures) return false;
        }

        // Price range filter
        if (filters.priceRange) {
            if (
                car.pricePerDay < filters.priceRange.min ||
                car.pricePerDay > filters.priceRange.max
            ) return false;
        }

        return true;
    });

    return {
        filters,
        updateSearch,
        updatePriceRange,
        toggleType,
        toggleFeature,
        filteredCars
    };
};