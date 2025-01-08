import {getAuthUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';


interface UpdateData {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}


export async function PUT(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({error: 'Не авторизован'}, {status: 401});
        }

        const {firstName, lastName, email, currentPassword, newPassword} = await request.json();

        if (email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: {email},
            });
            if (existingUser) {
                return NextResponse.json(
                    {error: 'Email уже используется'},
                    {status: 400}
                );
            }
        }

        const updateData: UpdateData = {
            firstName,
            lastName,
            email,
        };

        if (newPassword) {
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return NextResponse.json(
                    {error: 'Неверный текущий пароль'},
                    {status: 400}
                );
            }

            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await prisma.user.update({
            where: {id: user.id},
            data: updateData,
        });

        const {password: _, ...userWithoutPassword} = updatedUser;
        return NextResponse.json({user: userWithoutPassword});
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            {error: 'Внутренняя ошибка сервера'},
            {status: 500}
        );
    }
}