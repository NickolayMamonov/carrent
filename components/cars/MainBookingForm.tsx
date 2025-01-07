'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import { addDays } from "date-fns";
import { ru } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface BookingFormProps {
    pricePerDay: number;
    carId: string;
}

interface BookedDates {
    startDate: Date;
    endDate: Date;
}

interface BookedDateResponse {
    startDate: string;
    endDate: string;
}

interface BookedDatesApiResponse {
    bookedDates: BookedDateResponse[];
}

interface ApiError {
    status: number;
    message: string;
}

interface BookingError {
    error?: string;
    status?: number;
}

const MainBookingForm = ({ carId, pricePerDay }: BookingFormProps) => {
    const { user } = useAuth();
    const isEditorOrAdmin = user?.role === 'EDITOR' || user?.role === 'ADMIN';

    if (isEditorOrAdmin) {
        return (
            <div className="border rounded-lg p-6 sticky top-24">
                <div className="flex items-start gap-4">
                    <Info className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                        <h3 className="font-semibold mb-2">Редакторский доступ</h3>
                        <p className="text-muted-foreground text-sm">
                            Вы просматриваете эту страницу с правами редактора.
                            Функция бронирования автомобилей доступна только для обычных пользователей.
                        </p>
                    </div>
                </div>
                <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between items-center font-semibold">
                        <span>Стоимость:</span>
                        <span className="text-xl">{pricePerDay.toLocaleString()} ₽/день</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <BookingForm carId={carId} pricePerDay={pricePerDay} />
    );
};

export default MainBookingForm;

const BookingForm = ({ pricePerDay, carId }: BookingFormProps) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDates, setLoadingDates] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookedDates, setBookedDates] = useState<BookedDates[]>([]);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const response = await fetch(`/api/cars/${carId}/booked-dates`);
                if (!response.ok) {
                    const data = await response.json();
                    throw {
                        status: response.status,
                        message: data.error
                    };
                }
                const data = await response.json() as BookedDatesApiResponse;
                const dates = data.bookedDates.map((booking: BookedDateResponse) => ({
                    startDate: new Date(booking.startDate),
                    endDate: new Date(booking.endDate)
                }));
                setBookedDates(dates);
            } catch (error: unknown) {
                console.error('Booking error:', error);
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    const err = error as BookingError;
                    setError(err.error || 'Произошла ошибка при бронировании');
                }
            } finally {
                setLoadingDates(false);
            }
        };

        fetchBookedDates();
    }, [carId]);

    const calculateTotalPrice = () => {
        if (!dateRange?.from || !dateRange?.to) return 0;

        const start = dateRange.from;
        const end = dateRange.to;
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

        if (!dateRange?.from || !dateRange?.to) {
            setError('Выберите даты аренды');
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
                    startDate: dateRange.from,
                    endDate: dateRange.to,
                    extras: {
                        insurance: selectedFeatures.includes('insurance'),
                        childSeat: selectedFeatures.includes('childSeat'),
                        gps: selectedFeatures.includes('gps'),
                        additionalDriver: false
                    },
                    totalPrice: calculateTotalPrice()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.error
                } as ApiError;
            }

            router.push('/dashboard');
        } catch (error: unknown) {
            console.error('Booking error:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                const err = error as BookingError;
                setError(err.error || 'Произошла ошибка при бронировании');
            }
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
                {loadingDates ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                ) : (
                    <div className="border rounded-md p-3">
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            locale={ru}
                            disabled={[
                                { before: new Date() },
                                ...bookedDates.map(booking => ({
                                    from: booking.startDate,
                                    to: booking.endDate
                                }))
                            ]}
                            numberOfMonths={1}
                            defaultMonth={new Date()}
                            toDate={addDays(new Date(), 365)}
                            className="rounded-lg"
                            classNames={{
                                day_disabled: "text-muted-foreground opacity-50 line-through cursor-not-allowed pointer-events-none",
                                day_today: "bg-accent text-accent-foreground",
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                day_range_middle: "bg-accent/50 text-accent-foreground",
                                day_hidden: "invisible",
                                day_outside: "text-muted-foreground opacity-50",
                            }}
                        />
                    </div>
                )}
                {dateRange?.from && (
                    <div className="text-sm text-muted-foreground">
                        Выбранный период: {dateRange.from.toLocaleDateString('ru-RU')}
                        {dateRange.to ? ` - ${dateRange.to.toLocaleDateString('ru-RU')}` : ''}
                    </div>
                )}
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

            {dateRange?.from && dateRange?.to && (
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
                disabled={loading || !dateRange?.from || !dateRange?.to}
            >
                {loading ? 'Оформление...' : 'Забронировать'}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
                Бесплатная отмена за 24 часа до начала аренды
            </div>
        </div>
    );
};

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