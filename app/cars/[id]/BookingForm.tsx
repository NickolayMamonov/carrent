// app/cars/[id]/BookingForm.tsx
'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
    pricePerDay: number;
    carId: string;  // Убедимся, что принимаем carId как prop
}

const additionalFeatures = [
    {
        id: 'insurance',
        name: 'Страховка КАСКО',
        description: 'Полная страховая защита автомобиля',
        price: 1500,
    },
    {
        id: 'childSeat',
        name: 'Детское кресло',
        description: 'Для детей от 9 месяцев до 12 лет',
        price: 500,
    },
    {
        id: 'gps',
        name: 'GPS-навигатор',
        description: 'Навигационная система с картами',
        price: 300,
    }
];

export default function BookingForm({ pricePerDay, carId }: BookingFormProps) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [dates, setDates] = useState({ start: '', end: '' });
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateTotalPrice = () => {
        if (!dates.start || !dates.end) return 0;

        const start = new Date(dates.start);
        const end = new Date(dates.end);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const basePrice = days * pricePerDay;
        const featuresPrice = selectedFeatures.reduce((total, featureId) => {
            const feature = additionalFeatures.find(f => f.id === featureId);
            return total + (feature ? feature.price * days : 0);
        }, 0);

        return basePrice + featuresPrice;
    };

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            router.push('/sign-in?redirectTo=' + window.location.pathname);
            return;
        }

        if (!dates.start || !dates.end) {
            setError('Выберите даты аренды');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Выведем данные для отладки
            console.log('Sending booking data:', {
                carId,
                startDate: dates.start,
                endDate: dates.end,
                extras: {
                    insurance: selectedFeatures.includes('insurance'),
                    childSeat: selectedFeatures.includes('childSeat'),
                    gps: selectedFeatures.includes('gps'),
                    additionalDriver: false
                },
                totalPrice: calculateTotalPrice()
            });

            const response = await fetch('/api/bookings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId,
                    startDate: dates.start,
                    endDate: dates.end,
                    extras: {
                        insurance: selectedFeatures.includes('insurance'),
                        childSeat: selectedFeatures.includes('childSeat'),
                        gps: selectedFeatures.includes('gps'),
                        additionalDriver: false
                    },
                    totalPrice: calculateTotalPrice()
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка при создании бронирования');
            }

            router.push('/dashboard');
        } catch (err) {
            console.error('Booking error:', err);
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-lg p-6 space-y-6 sticky top-24">
            <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{pricePerDay.toLocaleString()} ₽</span>
                <span className="text-muted-foreground">/день</span>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold">Даты аренды</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Получение</label>
                        <input
                            type="date"
                            name="start"
                            className="w-full rounded-md border px-3 py-2 mt-1"
                            value={dates.start}
                            onChange={(e) => setDates({ ...dates, start: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Возврат</label>
                        <input
                            type="date"
                            name="end"
                            className="w-full rounded-md border px-3 py-2 mt-1"
                            value={dates.end}
                            onChange={(e) => setDates({ ...dates, end: e.target.value })}
                            min={dates.start || new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold">Дополнительные услуги</h3>
                <div className="space-y-3">
                    {additionalFeatures.map((feature) => (
                        <label key={feature.id} className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                className="mt-1"
                                checked={selectedFeatures.includes(feature.id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedFeatures([...selectedFeatures, feature.id]);
                                    } else {
                                        setSelectedFeatures(selectedFeatures.filter(id => id !== feature.id));
                                    }
                                }}
                            />
                            <div className="flex-grow">
                                <div className="font-medium">{feature.name}</div>
                                <div className="text-sm text-muted-foreground">{feature.description}</div>
                            </div>
                            <div className="text-sm font-medium whitespace-nowrap">
                                {feature.price.toLocaleString()} ₽/день
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {dates.start && dates.end && (
                <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-semibold">
                        <span>Итого:</span>
                        <span className="text-xl">{calculateTotalPrice().toLocaleString()} ₽</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="text-sm text-destructive">{error}</div>
            )}

            <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading || !dates.start || !dates.end}
            >
                {loading ? 'Оформление...' : 'Забронировать'}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
                Бесплатная отмена за 24 часа до начала аренды
            </div>
        </div>
    );
}