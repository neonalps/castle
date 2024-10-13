import { MessageDto } from "@src/models/external/dto/message";
import { PaginatedResponseDto } from "@src/models/external/dto/paginated-response";
import { ReadMessageRequestDto } from "@src/models/external/dto/read-message-request";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { ReadMessageHandler } from "@src/api/v1/message/read/handler";
import { requireNonNull } from "@src/util/common";

export class ReadMessageRouteProvider implements RouteProvider<ReadMessageRequestDto, PaginatedResponseDto<MessageDto>> {

    private readonly handler: ReadMessageHandler;

    constructor(handler: ReadMessageHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<ReadMessageRequestDto, PaginatedResponseDto<MessageDto>> {
        const readMessageSchema: RequestSchema = {
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    clientId: { type: 'string' },
                    timestamp: { type: 'string' },
                    limit: { type: 'number' },
                    nextPageKey: { type: 'string' },
                },
            },
        };

        return {
            name: 'ReadMessage',
            method: 'GET',
            path: '/api/v1/message',
            schema: readMessageSchema,
            handler: this.handler,
            authenticated: false,   // TODO change
        }
    }

}