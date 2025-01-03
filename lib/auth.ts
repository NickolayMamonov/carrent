import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export async function getAuthUser() {
    const token = cookies().get('auth-token')?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        return user;
    } catch (error) {
        return null;
    }
}

export async function validateAndRefreshToken() {
    const token = cookies().get('auth-token')?.value;
    const refreshToken = cookies().get('refresh-token')?.value;

    if (!token || !refreshToken) {
        return null;
    }

    try {
        // Проверяем основной токен
        jwt.verify(token, process.env.JWT_SECRET!);
        return token;
    } catch (error) {
        // Если основной токен истёк, пробуем обновить через refresh token
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as { userId: string };

            const savedToken = await prisma.refreshToken.findFirst({
                where: {
                    token: refreshToken,
                    userId: decoded.userId,
                    expiresAt: { gt: new Date() },
                },
            });

            if (!savedToken) {
                return null;
            }

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user) {
                return null;
            }

            // Создаем новый токен
            const newToken = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '1d' }
            );

            // Обновляем куки
            cookies().set('auth-token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });

            return newToken;
        } catch {
            return null;
        }
    }
}