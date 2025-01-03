import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Очистка существующих данных
    await prisma.user.deleteMany()

    // Создание тестовых пользователей
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Администратор
    await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            isVerified: true,
        },
    })

    // Редактор
    await prisma.user.create({
        data: {
            email: 'editor@example.com',
            password: hashedPassword,
            firstName: 'Editor',
            lastName: 'User',
            role: 'EDITOR',
            isVerified: true,
        },
    })

    // Обычный пользователь
    await prisma.user.create({
        data: {
            email: 'user@example.com',
            password: hashedPassword,
            firstName: 'Regular',
            lastName: 'User',
            role: 'USER',
            isVerified: true,
        },
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