import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/cars/CarCard";
import { getFeaturedCars } from '@/lib/data/cars';

export const FeaturedCarsSection = () => {
    const featuredCars = getFeaturedCars();

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
                    {featuredCars.map((car) => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            </div>
        </section>
    );
};