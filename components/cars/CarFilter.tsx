'use client'

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function CarFilter() {
    const [filtersVisible, setFiltersVisible] = useState(false);

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="flex items-center gap-2"
            >
                <SlidersHorizontal className="h-5 w-5" />
                Filters
            </Button>

            {filtersVisible && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border bg-background p-4 shadow-lg">
                    <div className="space-y-4">
                        {/* Price Range */}
                        <div>
                            <label className="text-sm font-medium">Price Range</label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="w-full rounded border px-3 py-1"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="w-full rounded border px-3 py-1"
                                />
                            </div>
                        </div>

                        {/* Vehicle Type */}
                        <div>
                            <label className="text-sm font-medium">Vehicle Type</label>
                            <div className="mt-1 space-y-2">
                                {['Sedan', 'SUV', 'Sports Car', 'Van'].map((type) => (
                                    <label key={type} className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded" />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <label className="text-sm font-medium">Features</label>
                            <div className="mt-1 space-y-2">
                                {['Air Conditioning', 'GPS', 'Bluetooth', 'Automatic'].map((feature) => (
                                    <label key={feature} className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded" />
                                        <span>{feature}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}