import { Shield, Users, Trophy, Timer } from "lucide-react";

const stats = [
    { number: "1000+", label: "Довольных клиентов" },
    { number: "50+", label: "Автомобилей в парке" },
    { number: "5", label: "Лет на рынке" },
    { number: "24/7", label: "Поддержка клиентов" },
];

const values = [
    {
        icon: Shield,
        title: "Надёжность",
        description: "Мы гарантируем безопасность и качество наших услуг"
    },
    {
        icon: Users,
        title: "Клиентоориентированность",
        description: "Индивидуальный подход к каждому клиенту"
    },
    {
        icon: Trophy,
        title: "Качество",
        description: "Только проверенные и обслуженные автомобили"
    },
    {
        icon: Timer,
        title: "Оперативность",
        description: "Быстрое оформление и выдача автомобилей"
    }
];

export default function AboutPage() {
    return (
        <div className="py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">О компании RentCar</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Мы предоставляем услуги аренды премиальных автомобилей с 2019 года,
                    делая ваши поездки комфортными и незабываемыми
                </p>
            </div>

            {/* Stats */}
            <div className="bg-secondary py-16 px-4 mb-20">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                            <div className="text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Story */}
            <div className="max-w-4xl mx-auto px-4 mb-20">
                <h2 className="text-2xl font-bold mb-6">Наша история</h2>
                <div className="prose prose-lg">
                    <p className="text-muted-foreground">
                        RentCar начала свою деятельность в 2019 году с небольшого парка из 10 автомобилей.
                        За пять лет работы мы значительно расширили автопарк и географию присутствия,
                        став одним из лидеров рынка аренды премиальных автомобилей.
                    </p>
                    <p className="text-muted-foreground mt-4">
                        Наша миссия — сделать аренду автомобилей максимально простой и доступной,
                        предоставляя клиентам первоклассный сервис и широкий выбор автомобилей.
                    </p>
                </div>
            </div>

            {/* Our Values */}
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8 text-center">Наши ценности</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <div key={index} className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <value.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{value.title}</h3>
                            <p className="text-muted-foreground">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}