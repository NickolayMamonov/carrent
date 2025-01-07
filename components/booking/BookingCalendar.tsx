'use client';

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from 'react-day-picker';
import { ru } from 'date-fns/locale';

interface BookedDates {
    startDate: string;
    endDate: string;
}

interface BookingCalendarProps {
    carId: string;
    onDateRangeChange: (range: DateRange | undefined) => void;
}

export default function BookingCalendar({ carId, onDateRangeChange }: BookingCalendarProps) {
    const [date, setDate] = useState<DateRange | undefined>();
    const [bookedDates, setBookedDates] = useState<BookedDates[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const response = await fetch(`/api/cars/${carId}/booked-dates`);
                if (response.ok) {
                    const data = await response.json();
                    setBookedDates(data.bookedDates);
                }
            } catch (error) {
                console.error('Error fetching booked dates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookedDates();
    }, [carId]);

    const isDateDisabled = (date: Date) => {
        if (!date) return false;

        return bookedDates.some(booking => {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);

            // Устанавливаем время в полночь для корректного сравнения
            const compareDate = new Date(date);
            compareDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            return compareDate >= startDate && compareDate <= endDate;
        });
    };

    const handleSelect = (range: DateRange | undefined) => {
        if (range && range.from && range.to) {
            // Проверяем каждый день в выбранном диапазоне
            const currentDate = new Date(range.from);
            while (currentDate <= range.to) {
                if (isDateDisabled(currentDate)) {
                    // Если хотя бы один день в диапазоне недоступен, не обновляем состояние
                    return;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        setDate(range);
        onDateRangeChange(range);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <Calendar
            mode="range"
            selected={date}
            onSelect={handleSelect}
            locale={ru}
            disabled={[
                { before: new Date() }, // Отключаем прошедшие даты
                { dayOfWeek: [] }, // Добавьте сюда дни недели, если нужно их отключить
                isDateDisabled // Наша функция для отключения забронированных дат
            ]}
            defaultMonth={new Date()}
            numberOfMonths={1}
            showOutsideDays={true}
            className="rounded-md border"
            classNames={{
                day_disabled: "text-muted-foreground opacity-50 line-through cursor-not-allowed",
            }}
        />
    );
}