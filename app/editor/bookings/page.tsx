'use client';

import { useState, useEffect } from 'react';
import { Car, Calendar, User as UserIcon, Loader2, Check, X, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/format';

interface BookingExtras {
    insurance: boolean;
    gps: boolean;
    childSeat: boolean;
    additionalDriver: boolean;
}

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'IN_PROGRESS' | 'COMPLETED';
    car: {
        id: string;
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
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string | null;
    };
    extras: BookingExtras;
}

export default function EditorBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/editor/bookings');
            if (response.ok) {
                const data = await response.json();
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId: string, status: Booking['status']) => {
        setActionLoading(bookingId);
        try {
            const response = await fetch(`/api/editor/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                setBookings(bookings.map(booking =>
                    booking.id === bookingId
                        ? { ...booking, status }
                        : booking
                ));
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Управление бронированиями</h1>
                <p className="text-muted-foreground">
                    Просмотр и управление бронированиями пользователей
                </p>
            </div>

            <div className="space-y-6">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="border rounded-lg p-6 bg-card"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Информация об автомобиле */}
                            <div className="lg:w-1/3">
                                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                                    {booking.car.images[0] ? (
                                        <img
                                            src={booking.car.images[0]}
                                            alt={`${booking.car.make} ${booking.car.model}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Car className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">
                                        {booking.car.make} {booking.car.model} {booking.car.year}
                                    </h3>
                                    {booking.car.specifications && (
                                        <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                            <div>Трансмиссия: {booking.car.specifications.transmission}</div>
                                            <div>Топливо: {booking.car.specifications.fuelType}</div>
                                            <div>Мест: {booking.car.specifications.seats}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Информация о бронировании */}
                            <div className="lg:w-2/3 space-y-6">
                                {/* Информация о клиенте */}
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        {booking.user.avatar ? (
                                            <img
                                                src={booking.user.avatar}
                                                alt=""
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="h-6 w-6 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {booking.user.firstName} {booking.user.lastName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {booking.user.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Детали бронирования */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="text-sm text-muted-foreground">Период аренды</div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(booking.startDate).toLocaleDateString('ru-RU')} -{' '}
                                                {new Date(booking.endDate).toLocaleDateString('ru-RU')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm text-muted-foreground">Статус</div>
                                        <span className={getStatusBadgeClass(booking.status)}>
                                            {getStatusLabel(booking.status)}
                                        </span>
                                    </div>
                                </div>

                                {/* Дополнительные услуги */}
                                {hasExtras(booking.extras) && (
                                    <div className="space-y-2">
                                        <div className="text-sm text-muted-foreground">Дополнительные услуги</div>
                                        <div className="flex flex-wrap gap-2">
                                            {booking.extras.insurance && (
                                                <span className="inline-flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    <Shield className="h-3 w-3" />
                                                    Страховка
                                                </span>
                                            )}
                                            {booking.extras.gps && (
                                                <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                    GPS
                                                </span>
                                            )}
                                            {booking.extras.childSeat && (
                                                <span className="inline-flex items-center gap-1 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                    Детское кресло
                                                </span>
                                            )}
                                            {booking.extras.additionalDriver && (
                                                <span className="inline-flex items-center gap-1 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                                    Дополнительный водитель
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Цена и действия */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <div className="text-2xl font-bold">
                                            {formatPrice(booking.totalPrice)} ₽
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Оплата при получении
                                        </div>
                                    </div>

                                    {booking.status === 'PENDING' && (
                                        <div className="flex gap-3 w-full sm:w-auto">
                                            <Button
                                                onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                                                disabled={actionLoading === booking.id}
                                                className="flex-1 sm:flex-none"
                                            >
                                                {actionLoading === booking.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Check className="h-4 w-4 mr-2" />
                                                )}
                                                Подтвердить
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                                                disabled={actionLoading === booking.id}
                                                className="flex-1 sm:flex-none"
                                            >
                                                {actionLoading === booking.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <X className="h-4 w-4 mr-2" />
                                                )}
                                                Отклонить
                                            </Button>
                                        </div>
                                    )}

                                    {booking.status === 'CONFIRMED' && (
                                        <Button
                                            onClick={() => handleStatusChange(booking.id, 'IN_PROGRESS')}
                                            disabled={actionLoading === booking.id}
                                        >
                                            Начать аренду
                                        </Button>
                                    )}

                                    {booking.status === 'IN_PROGRESS' && (
                                        <Button
                                            onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                                            disabled={actionLoading === booking.id}
                                        >
                                            Завершить аренду
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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