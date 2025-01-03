'use client';

import { useEffect, useState } from 'react';
import { CarFront, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Booking {
    id: string;
    car: {
        make: string;
        model: string;
        year: number;
        image: string;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

const statusMap = {
    PENDING: { label: 'Ожидает подтверждения', color: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Подтверждено', color: 'bg-green-100 text-green-800' },
    IN_PROGRESS: { label: 'В процессе', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: 'Завершено', color: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: 'Отменено', color: 'bg-red-100 text-red-800' },
};

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings/user');
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

        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId: string) => {
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
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
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
                    <h1 className="text-2xl font-bold">Мои аренды</h1>
                    <p className="text-muted-foreground">
                        Управляйте своими бронированиями и просматривайте историю аренд
                    </p>
                </div>

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
                                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg overflow-hidden">
                                        {booking.car.image ? (
                                            <img
                                                src={booking.car.image}
                                                alt={`${booking.car.make} ${booking.car.model}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <CarFront className="h-12 w-12 text-muted-foreground" />
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
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(booking.startDate).toLocaleDateString('ru-RU')} -{' '}
                                                        {new Date(booking.endDate).toLocaleDateString('ru-RU')}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${
                                                    statusMap[booking.status].color
                                                }`}
                                            >
                                                {statusMap[booking.status].label}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="text-lg font-semibold">
                                                {booking.totalPrice.toLocaleString()} ₽
                                            </div>
                                            {booking.status === 'PENDING' && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                >
                                                    Отменить бронирование
                                                </Button>
                                            )}
                                            {booking.status === 'COMPLETED' && (
                                                <Button>Забронировать снова</Button>
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