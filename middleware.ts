// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const publicRoutes = ['/', '/cars', '/about', '/contact', '/how-it-works', '/sign-in', '/sign-up'];
const protectedRoutes = ['/dashboard', '/profile'];
const adminRoutes = ['/admin'];
const editorRoutes = ['/editor'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Пропускаем публичные маршруты и API
    if (publicRoutes.includes(pathname) || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Проверяем токен
    const token = request.cookies.get('auth-token')?.value;
    const refreshToken = request.cookies.get('refresh-token')?.value;

    // Если нет токенов и маршрут защищённый, редиректим на авторизацию
    if (!token && !refreshToken) {
        if (protectedRoutes.some(route => pathname.startsWith(route)) ||
            adminRoutes.some(route => pathname.startsWith(route)) ||
            editorRoutes.some(route => pathname.startsWith(route))) {
            const url = new URL('/sign-in', request.url);
            url.searchParams.set('redirectTo', pathname);
            return NextResponse.redirect(url);
        }
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                role: string;
                userId: string;
            };

            // Проверка доступа к админским маршрутам
            if (pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Проверка доступа к маршрутам редактора
            if (pathname.startsWith('/editor') &&
                !['ADMIN', 'EDITOR'].includes(decoded.role)) {
                return NextResponse.redirect(new URL('/', request.url));
            }

            return NextResponse.next();
        } catch {
            // При невалидном токене пробуем использовать refresh token
            if (refreshToken) {
                const response = NextResponse.next();
                response.headers.set('x-refresh-token', refreshToken);
                return response;
            }

            // Если токен недействителен и нет refresh token, редиректим
            const response = NextResponse.redirect(new URL('/sign-in', request.url));
            response.cookies.delete('auth-token');
            response.cookies.delete('refresh-token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Защищаем все маршруты кроме публичных файлов
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};