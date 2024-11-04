import { Car, Calendar, CreditCard, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: Car,
        title: "Choose Your Car",
        description: "Browse our selection of vehicles and choose the perfect car for your needs."
    },
    {
        icon: Calendar,
        title: "Select Dates",
        description: "Pick your preferred pickup and return dates and location."
    },
    {
        icon: CreditCard,
        title: "Book & Pay",
        description: "Complete your booking with our secure payment system."
    },
    {
        icon: CheckCircle,
        title: "Enjoy Your Ride",
        description: "Pick up your car and enjoy your journey with our premium service."
    }
];

export default function HowItWorksPage() {
    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">How RentCar Works</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Renting a car has never been easier. Follow these simple steps to get started.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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

            <div className="mt-16 text-center">
                <h2 className="text-2xl font-semibold mb-8">Why Choose RentCar?</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Best Prices</h3>
                        <p className="text-muted-foreground">Competitive rates and no hidden fees</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">24/7 Support</h3>
                        <p className="text-muted-foreground">Always here to help when you need us</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Clean Cars</h3>
                        <p className="text-muted-foreground">All vehicles thoroughly cleaned and sanitized</p>
                    </div>
                </div>
            </div>
        </div>
    );
}