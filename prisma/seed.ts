// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Очистка существующих данных
    await prisma.car.deleteMany()
    await prisma.user.deleteMany()

    // Создание админа
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            isVerified: true,
        },
    })

    // Создание автомобилей
    await prisma.car.create({
        data: {
            id: 'camry-2023',
            make: 'Toyota',
            model: 'Camry',
            year: 2023,
            pricePerDay: 4500,
            type: 'Седан',
            features: ['Автомат', 'Климат-контроль', 'Круиз-контроль', 'Подогрев сидений'],
            images: ['/vehicles/toyota-camry.png'],
            availability: true,
            description: 'Toyota Camry - это комфортабельный седан бизнес-класса',
            createdBy: admin.id,
            lastModifiedBy: admin.id,
            specifications: {
                create: {
                    transmission: 'Автоматическая',
                    fuelType: 'Бензин',
                    seats: 5,
                    luggage: 480
                }
            }
        }
    })

    await prisma.car.create({
        data: {
            id: 'bmw-x5-2023',
            make: 'BMW',
            model: 'X5',
            year: 2023,
            pricePerDay: 11000,
            type: 'Кроссовер',
            features: ['Полный привод', 'Кожаный салон', 'Панорамная крыша', 'Автопилот'],
            images: ['/vehicles/bmw-x5.png'],
            availability: true,
            description: 'BMW X5 - роскошный среднеразмерный кроссовер',
            createdBy: admin.id,
            lastModifiedBy: admin.id,
            specifications: {
                create: {
                    transmission: 'Автоматическая',
                    fuelType: 'Бензин',
                    seats: 5,
                    luggage: 650
                }
            }
        }
    })

    console.log('Seed data created successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })