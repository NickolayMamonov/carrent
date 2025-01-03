// components/sections/FeaturedCarsSection.tsx
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/cars/CarCard";
import { getFeaturedCars } from '@/lib/data/cars';
import { type Car } from '@/lib/types/car';

export async function FeaturedCarsSection() {
    const featuredCars = await getFeaturedCars();

    return (
        <section className="px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Популярные автомобили</h2>
                    <a href="/cars">
                        <Button variant="outline">Все автомобили</Button>
                    </a>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {featuredCars.map((dbCar) => {
                        const car: Car = {
                            ...dbCar,
                            image: dbCar.images[0] || null,
                            pricePerDay: Number(dbCar.pricePerDay),
                            description: dbCar.description || '',
                        };
                        return <CarCard key={car.id} car={car} />;
                    })}
                </div>
            </div>
        </section>
    );
}