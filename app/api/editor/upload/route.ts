// app/api/editor/upload/route.ts
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Увеличиваем лимит для bodyParser
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: Request) {
    try {
        // Проверяем авторизацию
        const user = await getAuthUser();
        if (!user || !['ADMIN', 'EDITOR'].includes(user.role)) {
            return NextResponse.json(
                { error: 'Нет доступа' },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'Файл не найден' },
                { status: 400 }
            );
        }

        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Разрешены только изображения' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Создаем уникальное имя файла
        const uniqueId = uuidv4();
        const fileExtension = path.extname(file.name).toLowerCase();
        const fileName = `${uniqueId}${fileExtension}`;

        // Убедимся, что папка существует
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        try {
            await writeFile(path.join(uploadDir, fileName), buffer);
        } catch (error) {
            console.error('Error writing file:', error);
            return NextResponse.json(
                { error: 'Ошибка при сохранении файла' },
                { status: 500 }
            );
        }

        // Возвращаем URL файла
        return NextResponse.json({
            url: `/uploads/${fileName}`
        });

    } catch (error) {
        console.error('Error handling upload:', error);
        return NextResponse.json(
            { error: 'Ошибка при загрузке файла' },
            { status: 500 }
        );
    }
}