'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { useLogout } from '@/hooks/auth/useLogout';
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, Menu, X, Users, FileEdit, LucideIcon, User, CalendarRange } from "lucide-react";
import { useState } from "react";

interface NavItem {
    label: string;
    href: string;
    icon?: LucideIcon;
}

// Базовые пункты меню для неавторизованных пользователей
const baseNavItems: NavItem[] = [
    {
        label: 'Поиск автомобиля',
        href: '/cars',
    },
    {
        label: 'Как это работает',
        href: '/how-it-works',
    },
    {
        label: 'О нас',
        href: '/about',
    },
    {
        label: 'Контакты',
        href: '/contact',
    },
];

// Пункты меню для авторизованного пользователя
const userNavItems: NavItem[] = [
    {
        label: 'Мои бронирования',
        href: '/dashboard',
    },
    {
        label: 'Профиль',
        href: '/profile',
    },
];

// Пункты меню для редактора
const editorNavItems: NavItem[] = [
    {
        label: 'Управление автомобилями',
        href: '/editor/cars',
        icon: FileEdit,
    },
    {
        label: 'Управление бронированиями',
        href: '/editor/bookings',
        icon: CalendarRange,
    }
];

// Пункты меню для администратора
const adminNavItems: NavItem[] = [
    {
        label: 'Управление пользователями',
        href: '/admin/users',
        icon: Users,
    }
];

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();
    const { logout, loading: logoutLoading } = useLogout();

    const getNavItems = (): NavItem[] => {
        if (!user) {
            return baseNavItems;
        }

        if (user.role === 'ADMIN') {
            return [
                ...editorNavItems,
                ...adminNavItems,
                ...baseNavItems.slice(1),
                userNavItems[1],
            ];
        }

        if (user.role === 'EDITOR') {
            return [
                ...editorNavItems,
                ...baseNavItems.slice(1),
                userNavItems[1],
            ];
        }

        return [...baseNavItems, ...userNavItems];
    };

    const renderUserInfo = () => {
        if (!user) {
            return <></>;
        }

        return (
            <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10">
                                <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="text-sm">
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-muted-foreground">{user.email}</div>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="text-base h-11"
                    onClick={() => logout()}
                    disabled={logoutLoading}
                >
                    Выйти
                </Button>
            </div>
        );
    };

    const renderMobileUserInfo = () => {
        if (!user) {
            return <></>;
        }

        return (
            <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10">
                            <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-muted-foreground text-sm">{user.email}</div>
                </div>
            </div>
        );
    };

    const navItems = getNavItems();

    return (
        <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
            <Container>
                <div className="flex h-20 items-center justify-between">
                    {/* Logo & Brand */}
                    <Link href="/" className="flex items-center gap-3">
                        <Car className="h-8 w-8" />
                        <span className="font-bold text-2xl hidden sm:block">RentCar</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-base font-medium transition-colors hover:text-primary"
                            >
                                <span className="flex items-center gap-2">
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link href="/sign-in">
                                    <Button variant="outline" className="text-base px-6 py-2 h-11">
                                        Войти
                                    </Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button className="text-base px-6 py-2 h-11">
                                        Регистрация
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            renderUserInfo()
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden hover:bg-accent rounded-md p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="h-7 w-7" />
                            ) : (
                                <Menu className="h-7 w-7" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="absolute top-20 left-0 right-0 bg-background border-b md:hidden">
                        <Container>
                            <nav className="flex flex-col py-6 gap-4">
                                {user && renderMobileUserInfo()}
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-lg px-3 py-2 hover:text-primary transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="flex items-center gap-2">
                                            {item.icon && <item.icon className="h-4 w-4" />}
                                            {item.label}
                                        </span>
                                    </Link>
                                ))}

                                {/* Mobile Auth Buttons */}
                                {!user ? (
                                    <div className="flex flex-col gap-3 pt-6 border-t mt-2">
                                        <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="outline" className="w-full text-base h-11">
                                                Войти
                                            </Button>
                                        </Link>
                                        <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                                            <Button className="w-full text-base h-11">
                                                Регистрация
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="pt-6 border-t mt-2">
                                        <Button
                                            variant="outline"
                                            className="w-full text-base h-11"
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            disabled={logoutLoading}
                                        >
                                            Выйти
                                        </Button>
                                    </div>
                                )}
                            </nav>
                        </Container>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default NavBar;