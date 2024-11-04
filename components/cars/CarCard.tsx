import { Car } from "@/lib/types/car";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface CarCardProps {
    car: Car;
}

export default function CarCard({ car }: CarCardProps) {
    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            {/* Car Image */}
            <div className="relative h-48 w-full">
                <Image
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Car Details */}
            <div className="p-4 space-y-4">
                <div>
                    <h3 className="text-xl font-semibold">{car.make} {car.model}</h3>
                    <p className="text-muted-foreground">{car.year} • {car.type}</p>
                </div>

                <div className="flex items-center gap-2">
                    {car.features.slice(0, 3).map((feature) => (
                        <span
                            key={feature}
                            className="px-2 py-1 text-xs rounded-full bg-secondary"
                        >
              {feature}
            </span>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold">${car.pricePerDay}</span>
                        <span className="text-muted-foreground">/day</span>
                    </div>
                    <Link href={`/cars/${car.id}`}>
                        <Button>View Details</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}