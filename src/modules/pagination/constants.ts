export interface PaginationParams<T> {
    lastSeen: T;
    limit: number;
}

export interface PaginationQueryParams {
    nextPageKey?: string;
    limit?: number;
}

export const MAX_LIMIT = 100;