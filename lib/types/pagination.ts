export interface PaginationData {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationData;
}