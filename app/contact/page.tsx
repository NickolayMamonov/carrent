import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactInfo = [
    {
        icon: Phone,
        title: "Телефон",
        details: ["+7 (999) 123-45-67", "+7 (999) 765-43-21"],
        action: "tel:+79991234567"
    },
    {
        icon: Mail,
        title: "Email",
        details: ["info@rentcar.ru", "support@rentcar.ru"],
        action: "mailto:info@rentcar.ru"
    },
    {
        icon: MapPin,
        title: "Адрес",
        details: ["ул. Примерная, 123", "Москва, Россия"],
        action: "https://maps.google.com"
    },
    {
        icon: Clock,
        title: "Режим работы",
        details: ["Пн-Пт: 9:00 - 20:00", "Сб-Вс: 10:00 - 18:00"],
    }
];

export default function ContactPage() {
    return (
        <div className="py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Свяжитесь с нами</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Мы всегда готовы ответить на ваши вопросы и помочь с выбором автомобиля
                </p>
            </div>

            {/* Contact Information */}
            <div className="max-w-6xl mx-auto px-4 mb-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contactInfo.map((item, index) => (
                        <div key={index} className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <item.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <div className="space-y-1">
                                {item.details.map((detail, idx) => (
                                    <p key={idx} className="text-muted-foreground">{detail}</p>
                                ))}
                            </div>
                            {item.action && (
                                <a href={item.action} className="block">
                                    <Button variant="outline" className="w-full">
                                        {item.title === "Телефон" ? "Позвонить" :
                                            item.title === "Email" ? "Написать" :
                                                "Показать на карте"}
                                    </Button>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-card border rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Отправить сообщение</h2>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Имя</label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border px-3 py-2"
                                    placeholder="Введите ваше имя"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full rounded-md border px-3 py-2"
                                    placeholder="Введите ваш email"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Тема</label>
                            <input
                                type="text"
                                className="w-full rounded-md border px-3 py-2"
                                placeholder="Укажите тему сообщения"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Сообщение</label>
                            <textarea
                                className="w-full rounded-md border px-3 py-2 h-32 resize-none"
                                placeholder="Введите ваше сообщение"
                            />
                        </div>
                        <Button className="w-full">Отправить сообщение</Button>
                    </form>
                </div>
            </div>

            {/* Map Section */}
            <div className="max-w-6xl mx-auto px-4 mt-20">
                <div className="aspect-[21/9] bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Здесь будет карта</p>
                </div>
            </div>
        </div>
    );
}