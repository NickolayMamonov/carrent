interface ErrorResponse {
    response?: {
        data?: {
            error?: string;
        };
    };
    message?: string;
    status?: number;
}

export function handleClientError(error: ErrorResponse): string {    // Если есть ответ от API с сообщением об ошибке
    if (typeof error === 'object' && error !== null) {
        // Проверяем наличие response с данными
        if (error.response?.data?.error) {
            return error.response.data.error;
        }

        // Проверяем наличие сообщения в ошибке
        if (error.message) {
            return error.message;
        }

        // Проверяем статус ошибки
        if (error.status) {
            switch (error.status) {
                case 400:
                    return 'Некорректный запрос';
                case 401:
                    return 'Необходима авторизация';
                case 403:
                    return 'Доступ запрещен';
                case 404:
                    return 'Ресурс не найден';
                case 409:
                    return 'Конфликт данных';
                case 422:
                    return 'Ошибка валидации данных';
                case 429:
                    return 'Слишком много запросов';
                case 500:
                    return 'Внутренняя ошибка сервера';
                case 502:
                    return 'Сервер временно недоступен';
                case 503:
                    return 'Сервис временно недоступен';
                default:
                    return 'Произошла ошибка';
            }
        }
    }

    // Если ошибка пришла в виде строки
    if (typeof error === 'string') {
        return error;
    }

    // Возвращаем общее сообщение об ошибке, если не смогли определить конкретную причину
    return 'Произошла непредвиденная ошибка';
}