import { Car } from "@/lib/types/car";

export const CARS: Car[] = [
    {
        id: 'camry-2023',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        pricePerDay: 4500,
        type: 'Седан',
        features: ['Автомат', 'Климат-контроль', 'Круиз-контроль', 'Подогрев сидений', 'Камера заднего вида', 'Apple CarPlay'],
        availability: true,
        image: '/vehicles/toyota-camry.png',
        description: 'Toyota Camry - это комфортабельный седан бизнес-класса, сочетающий в себе элегантный дизайн, высокий уровень комфорта и надежность.',
        specifications: {
            transmission: 'Автоматическая',
            fuelType: 'Бензин',
            seats: 5,
            luggage: 480,
            mileage: 'Без ограничений',
        }
    },
    {
        id: 'crv-2023',
        make: 'Honda',
        model: 'CR-V',
        year: 2023,
        pricePerDay: 5500,
        type: 'Кроссовер',
        features: ['Полный привод', 'Камера 360', 'Apple CarPlay', 'Панорамная крыша', 'Климат-контроль', 'Кожаный салон'],
        availability: true,
        image: '/vehicles/honda-crv.png',
        description: 'Honda CR-V - это современный кроссовер, который предлагает просторный салон, высокий уровень безопасности и отличную управляемость.',
        specifications: {
            transmission: 'Вариатор',
            fuelType: 'Бензин',
            seats: 5,
            luggage: 590,
            mileage: 'Без ограничений',
        }
    },
    {
        id: 'mercedes-e-2023',
        make: 'Mercedes-Benz',
        model: 'E-класс',
        year: 2023,
        pricePerDay: 9500,
        type: 'Седан',
        features: ['Кожаный салон', 'Навигация', 'Массаж сидений', 'Премиум аудио', 'Автопилот', 'Панорамная крыша'],
        availability: true,
        image: '/vehicles/mercedes-e.png',
        description: 'Mercedes-Benz E-класса - это воплощение роскоши и комфорта. Автомобиль оснащен передовыми технологиями и обеспечивает максимальный комфорт.',
        specifications: {
            transmission: 'Автоматическая',
            fuelType: 'Бензин',
            seats: 5,
            luggage: 540,
            mileage: 'Без ограничений',
        }
    },
    {
        id: 'bmw-x5-2023',
        make: 'BMW',
        model: 'X5',
        year: 2023,
        pricePerDay: 11000,
        type: 'Кроссовер',
        features: ['Полный привод', 'Матричные фары', 'Пневмоподвеска', 'Премиум аудио', 'Вентиляция сидений', 'Панорамная крыша'],
        availability: true,
        image: '/vehicles/bmw-x5.png',
        description: 'BMW X5 - это роскошный среднеразмерный кроссовер, который сочетает в себе комфорт, производительность и современные технологии.',
        specifications: {
            transmission: 'Автоматическая',
            fuelType: 'Бензин',
            seats: 5,
            luggage: 650,
            mileage: 'Без ограничений',
        }
    }
];

export const getCarById = (id: string): Car | undefined => {
    return CARS.find(car => car.id === id);
};

export const getFeaturedCars = (limit: number = 4): Car[] => {
    return CARS.slice(0, limit);
};