import { Shield, Clock, Heart, LucideIcon } from "lucide-react";

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: Shield,
        title: "Безопасно и надёжно",
        description: "Все наши автомобили регулярно обслуживаются и тщательно проверяются"
    },
    {
        icon: Clock,
        title: "Поддержка 24/7",
        description: "Наша служба поддержки всегда готова помочь вам"
    },
    {
        icon: Heart,
        title: "Лучшие цены",
        description: "Конкурентные цены без скрытых платежей и комиссий"
    }
];

export const FeatureSection = () => {
    return (
        <section className="px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Почему выбирают RentCar?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center space-y-4">
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                                <feature.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{feature.title}</h3>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};