'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Calendar, Fuel, Users } from 'lucide-react';
import MainBookingForm from "@/components/cars/MainBookingForm";

interface CarDetails {
    id: string;
    make: string;
    model: string;
    year: number;
    type: string;
    pricePerDay: number;
    features: string[];
    description: string | null;
    images: string[];
    specifications: {
        transmission: string | null;
        fuelType: string | null;
        seats: number | null;
        luggage: number | null;
    } | null;
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
    const [car, setCar] = useState<CarDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await fetch(`/api/cars/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setCar({
                        ...data,
                        pricePerDay: Number(data.pricePerDay)
                    });
                    if (data.images.length > 0) {
                        setSelectedImage(data.images[0]);
                    }
                } else {
                    router.push('/cars');
                }
            } catch (error) {
                console.error('Error fetching car:', error);
                router.push('/cars');
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [params.id, router]);

    if (loading || !car) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images and Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Image */}
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        {selectedImage ? (
                            <Image
                                src={selectedImage}
                                alt={`${car.make} ${car.model}`}
                                width={800}
                                height={600}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Car className="h-20 w-20 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {car.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {car.images.map((image, index) => (
                                <button
                                    key={index}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                                        selectedImage === image ? 'border-primary' : 'border-transparent'
                                    }`}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <Image
                                        src={image}
                                        alt={`${car.make} ${car.model} view ${index + 1}`}
                                        fill={true}
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Car Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {car.make} {car.model} {car.year}
                            </h1>
                            <p className="text-lg text-muted-foreground">{car.type}</p>
                        </div>

                        {/* Specifications */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {car.specifications?.transmission && (
                                <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
                                    <Car className="h-6 w-6 mb-2" />
                                    <p className="text-sm font-medium">{car.specifications.transmission}</p>
                                    <p className="text-xs text-muted-foreground">Трансмиссия</p>
                                </div>
                            )}
                            {car.specifications?.fuelType && (
                                <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
                                    <Fuel className="h-6 w-6 mb-2" />
                                    <p className="text-sm font-medium">{car.specifications.fuelType}</p>
                                    <p className="text-xs text-muted-foreground">Топливо</p>
                                </div>
                            )}
                            {car.specifications?.seats && (
                                <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
                                    <Users className="h-6 w-6 mb-2" />
                                    <p className="text-sm font-medium">{car.specifications.seats} мест</p>
                                    <p className="text-xs text-muted-foreground">Вместимость</p>
                                </div>
                            )}
                            {car.specifications?.luggage && (
                                <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
                                    <Calendar className="h-6 w-6 mb-2" />
                                    <p className="text-sm font-medium">{car.specifications.luggage}л</p>
                                    <p className="text-xs text-muted-foreground">Багажник</p>
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Особенности</h2>
                            <div className="flex flex-wrap gap-2">
                                {car.features.map((feature) => (
                                    <span
                                        key={feature}
                                        className="px-3 py-1 bg-secondary rounded-full text-sm"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        {car.description && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Описание</h2>
                                <div className="prose max-w-none">
                                    <p className="text-muted-foreground">{car.description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Booking Form */}
                <div className="lg:col-span-1">
                    <MainBookingForm carId={car.id} pricePerDay={car.pricePerDay} />
                </div>
            </div>
        </div>
    );
}