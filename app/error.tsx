'use client';

import ErrorPage from "@/components/error/ErrorPage";

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function Error({ error }: ErrorProps) {
    return (
        <ErrorPage
            code={500}
            title="Что-то пошло не так"
            description={
                error?.message ||
                "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже."
            }
            showBackButton={false}
            showHomeButton={true}
        />
    );
}