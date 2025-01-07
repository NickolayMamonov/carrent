'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import {CarFront, Calendar, Info} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatPrice } from '@/lib/utils/format';

interface BookingExtras {
    insurance: boolean;
    gps: boolean;
    childSeat: boolean;
    additionalDriver: boolean;
}

interface Booking {
    id: string;
    car: {
        make: string;
        model: string;
        year: number;
        images: string[];
        specifications: {
            transmission: string | null;
            fuelType: string | null;
            seats: number | null;
        } | null;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    extras: BookingExtras;
}

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelLoading, setCancelLoading] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        try {
            const response = await fetch('/api/bookings/user');
            if (response.ok) {
                const data = await response.json();
                setBookings(data.bookings);
            }
        } catch (error) {
            setError('Ошибка при загрузке бронирований');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Вы уверены, что хотите отменить бронирование?')) {
            return;
        }

        setCancelLoading(bookingId);
        try {
            const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: 'POST',
            });

            if (response.ok) {
                setBookings(bookings.map(booking =>
                    booking.id === bookingId
                        ? { ...booking, status: 'CANCELLED' }
                        : booking
                ));
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка при отмене бронирования');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setError(error instanceof Error ? error.message : 'Произошла ошибка при отмене бронирования');
        } finally {
            setCancelLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold">Мои бронирования</h1>
                    <p className="text-muted-foreground">
                        Управляйте своими бронированиями и просматривайте историю аренд
                    </p>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-card border rounded-lg">
                        <CarFront className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">У вас пока нет аренд</h2>
                        <p className="text-muted-foreground mb-4">
                            Начните с выбора автомобиля из нашего каталога
                        </p>
                        <a href="/cars">
                            <Button>Выбрать автомобиль</Button>
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-card border rounded-lg p-6"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Car Image */}
                                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg overflow-hidden relative">
                                        {booking.car.images[0] ? (
                                            <Image
                                                src={booking.car.images[0]}
                                                alt={`${booking.car.make} ${booking.car.model}`}
                                                width={192}
                                                height={128}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <CarFront className="h-12 w-12 text-muted-foreground"/>
                                            </div>
                                        )}
                                    </div>

                                    {/* Booking Details */}
                                    <div className="flex-grow space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {booking.car.make} {booking.car.model} {booking.car.year}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(booking.startDate).toLocaleDateString('ru-RU')} -{' '}
                                                        {new Date(booking.endDate).toLocaleDateString('ru-RU')}
                                                    </div>
                                                    {booking.car.specifications && (
                                                        <>
                                                            <div>
                                                                Трансмиссия: {booking.car.specifications.transmission}
                                                            </div>
                                                            <div>
                                                                Мест: {booking.car.specifications.seats}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={getStatusBadgeClass(booking.status)}>
                                                {getStatusLabel(booking.status)}
                                            </span>
                                        </div>

                                        {/* Дополнительные услуги */}
                                        {hasExtras(booking.extras) && (
                                            <div className="flex flex-wrap gap-2">
                                                {booking.extras.insurance && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                        Страховка
                                                    </span>
                                                )}
                                                {booking.extras.gps && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        GPS
                                                    </span>
                                                )}
                                                {booking.extras.childSeat && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                        Детское кресло
                                                    </span>
                                                )}
                                                {booking.extras.additionalDriver && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                                        Дополнительный водитель
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {booking.status === 'CONFIRMED' && (
                                            <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <Info className="h-5 w-5 text-green-600 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium text-green-900">Бронирование подтверждено</h4>
                                                        <p className="text-sm text-green-800">
                                                            Для получения автомобиля, пожалуйста, прибудите по адресу: <strong>ул. Примерная, 123</strong> в выбранную дату.
                                                            При себе необходимо иметь:
                                                        </p>
                                                        <ul className="text-sm text-green-800 mt-2 space-y-1 list-disc list-inside">
                                                            <li>Паспорт</li>
                                                            <li>Водительское удостоверение</li>
                                                            <li>Банковскую карту для внесения депозита</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-lg font-semibold">
                                                    {formatPrice(booking.totalPrice)} ₽
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Оплата при получении
                                                </div>
                                            </div>
                                            {booking.status === 'PENDING' && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    disabled={cancelLoading === booking.id}
                                                >
                                                    {cancelLoading === booking.id ? 'Отмена...' : 'Отменить бронирование'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function getStatusBadgeClass(status: string) {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
        case 'PENDING':
            return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'CONFIRMED':
            return `${baseClasses} bg-green-100 text-green-800`;
        case 'IN_PROGRESS':
            return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'COMPLETED':
            return `${baseClasses} bg-gray-100 text-gray-800`;
        case 'CANCELLED':
            return `${baseClasses} bg-red-100 text-red-800`;
        default:
            return baseClasses;
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case 'PENDING':
            return 'Ожидает подтверждения';
        case 'CONFIRMED':
            return 'Подтверждено';
        case 'IN_PROGRESS':
            return 'В процессе';
        case 'COMPLETED':
            return 'Завершено';
        case 'CANCELLED':
            return 'Отменено';
        default:
            return status;
    }
}

function hasExtras(extras: BookingExtras) {
    return extras.insurance || extras.gps || extras.childSeat || extras.additionalDriver;
}