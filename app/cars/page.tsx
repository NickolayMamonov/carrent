import { Button } from "@/components/ui/button";
import CarFilter from "@/components/cars/CarFilter";
import CarGrid from "@/components/cars/CarGrid";
import { Search, SlidersHorizontal } from "lucide-react";

export default function CarsPage() {
    return (
        <div className="space-y-8 py-6">
            {/* Hero Section */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">Find Your Perfect Rental Car</h1>
                <p className="text-lg text-muted-foreground">
                    Choose from our wide selection of vehicles for any occasion
                </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by make, model, or type..."
                        className="w-full rounded-lg border pl-10 pr-4 py-2 text-base"
                    />
                </div>
                <CarFilter />
            </div>

            {/* Car Grid */}
            <CarGrid />
        </div>
    );
}