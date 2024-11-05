import React from 'react';
import { Shield, Users, Fuel, Gauge, Car as CarIcon, Check } from "lucide-react";
import BookingForm from './BookingForm';
import { getCarById } from '@/lib/data/cars';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

const CarDetailsPage = ({ params }: PageProps) => {
    const car = getCarById(params.id);

    if (!car) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <a href="/" className="hover:text-primary">Главная</a>
                    <span>/</span>
                    <a href="/cars" className="hover:text-primary">Автомобили</a>
                    <span>/</span>
                    <span className="text-foreground">{car.make} {car.model}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Car Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Images */}
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                            src={car.image}
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Car Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {car.make} {car.model} {car.year}
                            </h1>
                            <p className="text-xl text-muted-foreground">{car.type}</p>
                        </div>

                        <p className="text-lg">{car.description}</p>

                        {/* Specifications */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CarIcon className="h-5 w-5" />
                                    <span>Трансмиссия</span>
                                </div>
                                <p className="font-medium">{car.specifications.transmission}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Fuel className="h-5 w-5" />
                                    <span>Топливо</span>
                                </div>
                                <p className="font-medium">{car.specifications.fuelType}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-5 w-5" />
                                    <span>Мест</span>
                                </div>
                                <p className="font-medium">{car.specifications.seats}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Gauge className="h-5 w-5" />
                                    <span>Багажник</span>
                                </div>
                                <p className="font-medium">{car.specifications.luggage} л</p>
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Особенности и комплектация</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {car.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="space-y-6">
                    <BookingForm pricePerDay={car.pricePerDay} />
                </div>
            </div>
        </div>
    );
}

export default CarDetailsPage;