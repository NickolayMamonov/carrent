export interface PriceRange {
    min: number;
    max: number;
}

export interface CarFilters {
    search: string;
    priceRange?: PriceRange;
    types: string[];
    features: string[];
}