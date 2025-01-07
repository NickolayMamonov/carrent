'use client';

import { CarSearch } from "./CarSearch";
import { CarFilter } from "./CarFilter";
import CarGrid from "./CarGrid";
import { useCarFilters } from "@/hooks/useCarFilters";
import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Pagination } from "@/components/ui/pagination";
import type { Car } from "@/lib/types/car";

interface PaginationData {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

export const CarsContainer = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        pages: 1,
        currentPage: 1,
        limit: 9
    });

    const { user } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
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

    const fetchCars = async (page: number = 1) => {
        try {
            const response = await fetch(`/api/cars?page=${page}&limit=${pagination.limit}`);
            if (response.ok) {
                const data = await response.json();
                setCars(data.cars.map((car: Car) => ({
                    ...car,
                    pricePerDay: Number(car.pricePerDay)
                })));
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '1');
        fetchCars(page);
    }, [searchParams]);

    const handlePageChange = (page: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page', page.toString());
        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.push(`${pathname}${query}`);
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

            {pagination.pages > 1 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.pages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};