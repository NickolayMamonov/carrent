import { Car } from "@/lib/types/car";
import { CarCard } from "@/components/cars/CarCard";

interface CarGridProps {
  cars: Car[];
}

export const CarGrid = ({ cars }: CarGridProps) => {
  if (cars.length === 0) {
    return (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">
            По вашему запросу ничего не найдено
          </p>
        </div>
    );
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
            <CarCard key={car.id} car={car} />
        ))}
      </div>
  );
};