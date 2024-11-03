import { PaginationQueryParams } from "@src/modules/pagination/constants";

export interface ReadMessageRequestDto extends PaginationQueryParams {
    messageGroupId: string;
    clientId: string;
    timestamp: string;
}