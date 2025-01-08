'use client';

import Image from 'next/image';
import React from 'react';
import { Car, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Car as CarType } from '@/lib/types/car';
import { formatPrice } from '@/lib/utils/format';
import Link from 'next/link';
import {router} from "next/client";

interface EditorCarCardProps {
    car: CarType;
}

export const EditorCarCard: React.FC<EditorCarCardProps> = ({ car }) => {
    const handleDelete = async () => {
        if (!confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
            return;
        }

        try {
            const response = await fetch(`/api/editor/cars/${car.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/editor/cars?page=1'); // Добавили page=1 при редиректе
            }
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            <div className="relative h-48 w-full bg-muted">
                {car.images[0] ? (
                    <Image
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        fill={true}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <Car className="h-12 w-12"/>
                    </div>
                )}
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <h3 className="text-xl font-semibold">{car.make} {car.model}</h3>
                    <p className="text-muted-foreground">{car.year} • {car.type}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {car.features.slice(0, 3).map((feature) => (
                        <span
                            key={feature}
                            className="px-2 py-1 text-xs rounded-full bg-secondary"
                        >
                            {feature}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold">{formatPrice(car.pricePerDay)} ₽</span>
                        <span className="text-muted-foreground">/день</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/editor/cars/${car.id}`} className="flex-1">
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <Edit className="h-4 w-4" />
                            Редактировать
                        </Button>
                    </Link>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="px-3"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};