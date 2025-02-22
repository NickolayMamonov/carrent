import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import Container from "@/components/Container";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "RentCar",
    description: "Rent a car of your choice",
    icons: {icon: '/logo.svg'}
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="flex flex-col min-h-screen bg-secondary">
            <NavBar/>
            <section className="flex-grow">
                <Container>
                    {children}
                </Container>
            </section>
        </main>
        </body>
        </html>
    );
}