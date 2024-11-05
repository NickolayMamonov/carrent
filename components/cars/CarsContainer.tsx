'use client'

import { CarSearch } from "./CarSearch";
import { CarFilter } from "./CarFilter";
import { CarGrid } from "./CarGrid";
import { useCarFilters } from "@/hooks/useCarFilters";
import { CARS } from "@/lib/data/cars";

export const CarsContainer = () => {
    const {
        filters,
        updateSearch,
        updatePriceRange,
        toggleType,
        toggleFeature,
        filteredCars
    } = useCarFilters(CARS);

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