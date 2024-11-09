import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { RefreshTokenHandler } from "@src/api/v1/auth/refresh-token/handler";
import { RefreshTokenRequestDto } from "@src/models/external/dto/refresh-token-response";
import { TokenResponseDto } from "@src/models/external/dto/token-response";

export class RefreshTokenRouteProvider implements RouteProvider<RefreshTokenRequestDto, TokenResponseDto> {

    private readonly handler: RefreshTokenHandler;

    constructor(handler: RefreshTokenHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<RefreshTokenRequestDto, TokenResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                    refreshToken: { type: 'string' },
                },
            }
        };

        return {
            name: 'RefreshAccessToken',
            method: 'POST',
            path: '/api/v1/auth/refresh-token',
            schema, 
            handler: this.handler,
            authenticated: false,
        };
    }

}