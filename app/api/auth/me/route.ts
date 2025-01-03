import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
        }

        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}