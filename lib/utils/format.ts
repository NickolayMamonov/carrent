export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
};