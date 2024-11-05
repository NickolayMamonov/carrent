import { Car, Calendar, CreditCard, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: Car,
        title: "Выберите автомобиль",
        description: "Просмотрите наш автопарк и выберите автомобиль, который подходит именно вам"
    },
    {
        icon: Calendar,
        title: "Укажите даты",
        description: "Выберите удобные даты и время для получения и возврата автомобиля"
    },
    {
        icon: CreditCard,
        title: "Оформите бронь",
        description: "Заполните необходимые данные и оплатите аренду любым удобным способом"
    },
    {
        icon: CheckCircle,
        title: "Получите автомобиль",
        description: "Заберите автомобиль в назначенное время и наслаждайтесь поездкой"
    }
];

const features = [
    {
        title: "Выгодные цены",
        description: "Прозрачное ценообразование без скрытых платежей"
    },
    {
        title: "Круглосуточная поддержка",
        description: "Наши специалисты всегда готовы помочь вам"
    },
    {
        title: "Чистые автомобили",
        description: "Все автомобили проходят тщательную подготовку перед выдачей"
    }
];

export default function HowItWorksPage() {
    return (
        <div className="py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Как работает RentCar</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Аренда автомобиля никогда не была такой простой. Следуйте этим шагам, чтобы начать.
                </p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
                {steps.map((step, index) => (
                    <div key={index} className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <step.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                ))}
            </div>

            {/* Requirements Section */}
            <div className="bg-secondary py-16 px-4 mb-20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">Требования для аренды</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Документы</h3>
                            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                <li>Паспорт гражданина РФ</li>
                                <li>Водительское удостоверение (стаж от 2 лет)</li>
                                <li>Действующая банковская карта на ваше имя</li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Условия</h3>
                            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                <li>Возраст не менее 21 года</li>
                                <li>Депозит (сумма зависит от класса автомобиля)</li>
                                <li>Чистая кредитная история</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">Преимущества RentCar</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}