// app/cars/[id]/BookingForm.tsx
'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';

interface AdditionalFeature {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface BookingFormProps {
    pricePerDay: number;
    carId: string;
}

const additionalFeatures: AdditionalFeature[] = [
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
    },
    {
        id: 'additionalDriver',
        name: 'Дополнительный водитель',
        description: 'Возможность управления ещё одним водителем',
        price: 800,
    }
];

const BookingForm: React.FC<BookingFormProps> = ({ pricePerDay, carId }) => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null,
    });
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFeatureToggle = (featureId: string) => {
        setSelectedFeatures(prev =>
            prev.includes(featureId)
                ? prev.filter(id => id !== featureId)
                : [...prev, featureId]
        );
    };

    const calculateTotalPrice = () => {
        if (!selectedDates.start || !selectedDates.end) return 0;

        const days = Math.ceil(
            (selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24)
        );

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

        if (!selectedDates.start || !selectedDates.end) {
            setError('Пожалуйста, выберите даты аренды');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/bookings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId,
                    startDate: selectedDates.start,
                    endDate: selectedDates.end,
                    extras: {
                        insurance: selectedFeatures.includes('insurance'),
                        childSeat: selectedFeatures.includes('childSeat'),
                        gps: selectedFeatures.includes('gps'),
                        additionalDriver: selectedFeatures.includes('additionalDriver')
                    },
                    totalPrice: calculateTotalPrice()
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка при создании бронирования');
            }

            router.push('/dashboard');
        } catch (err) {
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

            {/* Date Selection */}
            <div className="space-y-4">
                <h3 className="font-semibold">Даты аренды</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Получение</label>
                        <input
                            type="date"
                            className="w-full rounded-md border px-3 py-2 mt-1"
                            onChange={(e) => setSelectedDates(prev => ({
                                ...prev,
                                start: e.target.value ? new Date(e.target.value) : null
                            }))}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Возврат</label>
                        <input
                            type="date"
                            className="w-full rounded-md border px-3 py-2 mt-1"
                            onChange={(e) => setSelectedDates(prev => ({
                                ...prev,
                                end: e.target.value ? new Date(e.target.value) : null
                            }))}
                            min={selectedDates.start?.toISOString().split('T')[0]}
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
                            <input
                                type="checkbox"
                                className="mt-1"
                                checked={selectedFeatures.includes(feature.id)}
                                onChange={() => handleFeatureToggle(feature.id)}
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

            {/* Total Price */}
            {selectedDates.start && selectedDates.end && (
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
                disabled={loading || !selectedDates.start || !selectedDates.end}
            >
                {loading ? 'Оформление...' : 'Забронировать'}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
                Бесплатная отмена за 24 часа до начала аренды
            </div>
        </div>
    );
};

export default BookingForm;