import ErrorPage from "@/components/error/ErrorPage";

export default function NotFound() {
    return (
        <ErrorPage
            code={404}
            title="Страница не найдена"
            description="Извините, мы не смогли найти страницу, которую вы ищете."
        />
    );
}