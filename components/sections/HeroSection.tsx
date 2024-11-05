import { Button } from "@/components/ui/button";

export const HeroSection = () => {
    return (
        <section className="relative py-20 flex flex-col items-center text-center space-y-8">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary to-background" />
            <div className="relative space-y-4 max-w-3xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold">
                    Найдите идеальный автомобиль для любой поездки
                </h1>
                <p className="text-xl text-muted-foreground">
                    Выбирайте из нашего широкого ассортимента премиальных автомобилей по выгодным ценам
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <a href="/cars">
                        <Button size="lg" className="text-lg px-8">
                            Смотреть автомобили
                        </Button>
                    </a>
                    <a href="/how-it-works">
                        <Button size="lg" variant="outline" className="text-lg px-8">
                            Как это работает
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
};