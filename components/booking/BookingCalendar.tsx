import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';

interface BookedDates {
    startDate: Date;
    endDate: Date;
}

interface BookingCalendarProps {
    carId: string;
    onDateRangeChange: (range: DateRange | undefined) => void;
}

export function BookingCalendar({ carId, onDateRangeChange }: BookingCalendarProps) {
    const [date, setDate] = useState<DateRange | undefined>();
    const [bookedDates, setBookedDates] = useState<BookedDates[]>([]);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const response = await fetch(`/api/cars/${carId}/booked-dates`);
                if (response.ok) {
                    const data = await response.json();
                    setBookedDates(data.bookedDates.map((booking: any) => ({
                        startDate: new Date(booking.startDate),
                        endDate: new Date(booking.endDate)
                    })));
                }
            } catch (error) {
                console.error('Error fetching booked dates:', error);
            }
        };

        fetchBookedDates();
    }, [carId]);

    const isDateDisabled = (date: Date) => {
        return bookedDates.some(booking =>
            date >= booking.startDate && date <= booking.endDate
        );
    };

    return (
        <Calendar
            mode="range"
            selected={date}
            onSelect={(range) => {
                setDate(range);
                onDateRangeChange(range);
            }}
            numberOfMonths={2}
            disabled={isDateDisabled}
            defaultMonth={new Date()}
            fromDate={new Date()}
        />
    );
}