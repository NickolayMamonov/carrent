'use client'

import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, Menu, X } from "lucide-react";
import { useState } from "react";

const NavItems = [
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

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
            <Container>
                <div className="flex h-20 items-center justify-between"> {/* Увеличена высота навбара */}
                    {/* Logo & Brand */}
                    <Link href="/" className="flex items-center gap-3">
                        <Car className="h-8 w-8" /> {/* Увеличена иконка */}
                        <span className="font-bold text-2xl hidden sm:block">RentCar</span> {/* Увеличен логотип */}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {NavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-base font-medium transition-colors hover:text-primary" // Увеличен размер текста навигации
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        <SignedOut>
                            <div className="hidden sm:flex items-center gap-3">
                                <Link href="/sign-in">
                                    <Button
                                        variant="outline"
                                        className="text-base px-6 py-2 h-11" // Увеличены кнопки
                                    >
                                        Sign in
                                    </Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button
                                        className="text-base px-6 py-2 h-11" // Увеличены кнопки
                                    >
                                        Start Renting
                                    </Button>
                                </Link>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/dashboard" className="hidden sm:block">
                                <Button
                                    variant="outline"
                                    className="text-base px-6 py-2 h-11" // Увеличены кнопки
                                >
                                    Мои аренды
                                </Button>
                            </Link>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-11 w-11", // Увеличен аватар
                                        userButtonPopoverCard: "shadow-lg",
                                        userButtonPopoverActionButton: "text-base" // Увеличен текст в меню пользователя
                                    }
                                }}
                            />
                        </SignedIn>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden hover:bg-accent rounded-md p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="h-7 w-7" /> // Увеличена иконка меню
                            ) : (
                                <Menu className="h-7 w-7" /> // Увеличена иконка меню
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="absolute top-20 left-0 right-0 bg-background border-b md:hidden">
                        <Container>
                            <nav className="flex flex-col py-6 gap-4"> {/* Увеличены отступы */}
                                {NavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-lg px-3 py-2 hover:text-primary transition-colors" // Увеличен размер текста
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <SignedOut>
                                    <div className="flex flex-col gap-3 pt-6 border-t mt-2"> {/* Увеличены отступы */}
                                        <Link
                                            href="/sign-in"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full text-base h-11" // Увеличены кнопки
                                            >
                                                Sign in
                                            </Button>
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Button
                                                className="w-full text-base h-11" // Увеличены кнопки
                                            >
                                                Start Renting
                                            </Button>
                                        </Link>
                                    </div>
                                </SignedOut>
                                <SignedIn>
                                    <Link
                                        href="/dashboard"
                                        className="text-lg px-3 py-2 hover:text-primary transition-colors" // Увеличен размер текста
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Rentals
                                    </Link>
                                </SignedIn>
                            </nav>
                        </Container>
                    </div>
                )}
            </Container>
        </div>
    );
}

export default NavBar;