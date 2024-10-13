import { PostMessageRequestDto } from "@src/models/external/dto/post-message-request";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { PostMessageHandler } from "@src/api/v1/message/post/handler";
import { requireNonNull } from "@src/util/common";
import { PostMessageResponseDto } from "@src/models/external/dto/post-message-response";

export class PostMessageRouteProvider implements RouteProvider<PostMessageRequestDto, PostMessageResponseDto> {

    private readonly handler: PostMessageHandler;

    constructor(handler: PostMessageHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<PostMessageRequestDto, PostMessageResponseDto> {
        const postMessageSchema: RequestSchema = {
            body: {
                type: 'object',
                required: ["messages"],
                properties: {
                    messages: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['timestamp', 'content', 'isEncrypted'],
                            properties: {
                                timestamp: { type: 'string' },
                                content: { type: 'string' },
                                isEncrypted: { type: 'boolean' },
                            }
                        }
                    },
                    merkle: { type: 'string' },
                }
            },
        };

        return {
            name: 'PostMessage',
            method: 'POST',
            path: '/api/v1/message',
            schema: postMessageSchema,
            handler: this.handler,
            authenticated: false,   // TODO change
        }
    }

}