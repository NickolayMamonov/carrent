'use client';

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from "next/navigation";

interface ErrorPageProps {
    code?: number;
    title: string;
    description: string;
    showBackButton?: boolean;
    showHomeButton?: boolean;
}

export default function ErrorPage({
                                      code,
                                      title,
                                      description,
                                      showBackButton = true,
                                      showHomeButton = true
                                  }: ErrorPageProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            {code && (
                <h1 className="text-8xl font-bold text-primary/20">
                    {code}
                </h1>
            )}
            <h2 className="text-2xl font-bold mt-4 text-center">{title}</h2>
            <p className="mt-2 text-muted-foreground text-center max-w-md">
                {description}
            </p>
            <div className="flex gap-4 mt-8">
                {showBackButton && (
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Вернуться назад
                    </Button>
                )}
                {showHomeButton && (
                    <Link href="/">
                        <Button>
                            На главную
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}