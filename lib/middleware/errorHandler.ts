import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export function handleDatabaseError(error: unknown) {
    console.error('Database Error:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return NextResponse.json(
                    { error: 'Запись с такими данными уже существует' },
                    { status: 409 }
                );
            case 'P2025':
                return NextResponse.json(
                    { error: 'Запись не найдена' },
                    { status: 404 }
                );
            case 'P2003':
                return NextResponse.json(
                    { error: 'Нарушение ограничений внешнего ключа' },
                    { status: 400 }
                );
            default:
                return NextResponse.json(
                    { error: 'Ошибка базы данных' },
                    { status: 500 }
                );
        }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return NextResponse.json(
            { error: 'Некорректные данные запроса' },
            { status: 400 }
        );
    }

    return NextResponse.json(
        { error: 'Внутренняя ошибка сервера' },
        { status: 500 }
    );
}