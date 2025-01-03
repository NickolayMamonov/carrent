// app/cars/page.tsx
import { CarsContainer } from "@/components/cars/CarsContainer";

export default function CarsPage() {
    return (
        <div className="space-y-8 py-6">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">Найдите свой идеальный автомобиль</h1>
                <p className="text-lg text-muted-foreground">
                    Выбирайте из нашей коллекции премиальных автомобилей для любых целей
                </p>
            </div>

            <CarsContainer />
        </div>
    );
}