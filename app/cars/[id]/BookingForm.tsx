// BookingForm.tsx - Клиентский компонент
'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface AdditionalFeature {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface BookingFormProps {
    pricePerDay: number;
}

const additionalFeatures: AdditionalFeature[] = [
    {
        id: 'insurance',
        name: 'Страхование',
        description: 'Полное КАСКО',
        price: 1500,
    },
    {
        id: 'driver',
        name: 'Водитель',
        description: 'Профессиональный водитель',
        price: 5000,
    },
    {
        id: 'childSeat',
        name: 'Детское кресло',
        description: 'Для детей от 9 месяцев',
        price: 500,
    },
];

const BookingForm: React.FC<BookingFormProps> = ({ pricePerDay }) => {
    const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null,
    });

    return (
        <div className="border rounded-lg p-6 space-y-6 sticky top-24">
            <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{pricePerDay.toLocaleString()} ₽</span>
                <span className="text-muted-foreground">/день</span>
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
                <h3 className="font-semibold">Выберите даты</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Начало</label>
                        <input
                            type="date"
                            className="w-full rounded-md border px-3 py-2 mt-1"
                            onChange={(e) => setSelectedDates(prev => ({ ...prev, start: new Date(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Конец</label>
                        <input
                            type="date"
                            className="w-full rounded-md border px-3 py-2 mt-1"
                            onChange={(e) => setSelectedDates(prev => ({ ...prev, end: new Date(e.target.value) }))}
                        />
                    </div>
                </div>
            </div>

            {/* Additional Features */}
            <div className="space-y-4">
                <h3 className="font-semibold">Дополнительные услуги</h3>
                <div className="space-y-3">
                    {additionalFeatures.map((feature) => (
                        <label key={feature.id} className="flex items-start gap-3">
                            <input type="checkbox" className="mt-1" />
                            <div className="flex-grow">
                                <div className="font-medium">{feature.name}</div>
                                <div className="text-sm text-muted-foreground">{feature.description}</div>
                            </div>
                            <div className="text-sm font-medium">
                                {feature.price.toLocaleString()} ₽/день
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <Button className="w-full">
                Забронировать
            </Button>

            <div className="text-sm text-muted-foreground text-center">
                Бесплатная отмена за 24 часа до начала аренды
            </div>
        </div>
    );
};

export default BookingForm;