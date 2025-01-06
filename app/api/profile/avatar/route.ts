import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
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
        const fileName = `avatar-${uniqueId}${fileExtension}`;

        // Убедимся, что папка существует
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
        try {
            await writeFile(path.join(uploadDir, fileName), buffer);
        } catch (error) {
            console.error('Error writing file:', error);
            return NextResponse.json(
                { error: 'Ошибка при сохранении файла' },
                { status: 500 }
            );
        }

        // Обновляем аватар пользователя в базе данных
        const avatarUrl = `/uploads/avatars/${fileName}`;
        await prisma.user.update({
            where: { id: user.id },
            data: { avatar: avatarUrl },
        });

        return NextResponse.json({ url: avatarUrl });
    } catch (error) {
        console.error('Error handling upload:', error);
        return NextResponse.json(
            { error: 'Ошибка при загрузке файла' },
            { status: 500 }
        );
    }
}