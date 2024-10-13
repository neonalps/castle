import { PaginationQueryParams } from "@src/modules/pagination/constants";

export interface ReadMessageRequestDto extends PaginationQueryParams {
    clientId: string;
    timestamp: string;
}