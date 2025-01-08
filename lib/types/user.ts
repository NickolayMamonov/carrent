export type UserRole = 'ADMIN' | 'EDITOR' | 'USER';

export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: UserRole;
    isVerified: boolean;
    verificationToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
}