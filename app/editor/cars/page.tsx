'use client';

import {useState, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Car} from '@/lib/types/car';
import {Plus} from "lucide-react";
import Link from 'next/link';
import {EditorCarCard} from "@/components/cars/EditorCarCard";
import { Pagination } from "@/components/ui/pagination";
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface PaginationData {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

export default function EditorCarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        pages: 1,
        currentPage: 1,
        limit: 9
    });

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '1');
        fetchCars(page);
    }, [searchParams]);

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

    const handlePageChange = (page: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page', page.toString());
        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.push(`${pathname}${query}`);
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
                        <Plus className="h-4 w-4"/>
                        Добавить автомобиль
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                    <EditorCarCard key={car.id} car={car}/>
                ))}
            </div>

            {pagination.pages > 1 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.pages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}