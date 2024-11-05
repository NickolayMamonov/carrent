'use client'

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { PriceRange } from "@/lib/types/filters";

interface FilterOption {
    label: string;
    value: string;
}

const vehicleTypes: FilterOption[] = [
    { label: 'Седан', value: 'Седан' },
    { label: 'Кроссовер', value: 'Кроссовер' },
    { label: 'Спорткар', value: 'Спорткар' },
    { label: 'Минивэн', value: 'Минивэн' }
];

const features: FilterOption[] = [
    { label: 'Климат-контроль', value: 'Климат-контроль' },
    { label: 'Кожаный салон', value: 'Кожаный салон' },
    { label: 'Панорамная крыша', value: 'Панорамная крыша' },
    { label: 'Автопилот', value: 'Автопилот' }
];

interface CarFilterProps {
    selectedTypes: string[];
    selectedFeatures: string[];
    priceRange?: PriceRange;
    onTypeToggle: (type: string) => void;
    onFeatureToggle: (feature: string) => void;
    onPriceRangeChange: (range: PriceRange) => void;
}

export const CarFilter = ({
                              selectedTypes,
                              selectedFeatures,
                              priceRange,
                              onTypeToggle,
                              onFeatureToggle,
                              onPriceRangeChange
                          }: CarFilterProps) => {
    const [filtersVisible, setFiltersVisible] = useState(false);

    const handlePriceChange = (min: string, max: string) => {
        const minValue = parseInt(min) || 0;
        const maxValue = parseInt(max) || 0;
        if (maxValue > 0) {
            onPriceRangeChange({ min: minValue, max: maxValue });
        }
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="flex items-center gap-2"
            >
                <SlidersHorizontal className="h-5 w-5" />
                Фильтры
            </Button>

            {filtersVisible && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border bg-background p-4 shadow-lg z-50">
                    <div className="space-y-4">
                        {/* Price Range */}
                        <div>
                            <label className="text-sm font-medium">Цена за день</label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="number"
                                    placeholder="От"
                                    value={priceRange?.min || ''}
                                    onChange={(e) => handlePriceChange(e.target.value, (priceRange?.max || '').toString())}
                                    className="w-full rounded border px-3 py-1"
                                />
                                <input
                                    type="number"
                                    placeholder="До"
                                    value={priceRange?.max || ''}
                                    onChange={(e) => handlePriceChange((priceRange?.min || '').toString(), e.target.value)}
                                    className="w-full rounded border px-3 py-1"
                                />
                            </div>
                        </div>

                        {/* Vehicle Type */}
                        <div>
                            <label className="text-sm font-medium">Тип автомобиля</label>
                            <div className="mt-1 space-y-2">
                                {vehicleTypes.map((type) => (
                                    <label key={type.value} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedTypes.includes(type.value)}
                                            onChange={() => onTypeToggle(type.value)}
                                            className="rounded"
                                        />
                                        <span>{type.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <label className="text-sm font-medium">Особенности</label>
                            <div className="mt-1 space-y-2">
                                {features.map((feature) => (
                                    <label key={feature.value} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedFeatures.includes(feature.value)}
                                            onChange={() => onFeatureToggle(feature.value)}
                                            className="rounded"
                                        />
                                        <span>{feature.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};