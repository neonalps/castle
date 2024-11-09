import { LoginResponseDto } from "@src/models/external/dto/login-response";
import { RedeemAuthTokenRequestDto } from "@src/models/external/dto/redeem-auth-token-request";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { RedeemAuthTokenHandler } from "@src/api/v1/auth/redeem-token/handler";
import { requireNonNull } from "@src/util/common";

export class RedeemAuthTokenRouteProvider implements RouteProvider<RedeemAuthTokenRequestDto, LoginResponseDto> {

    private readonly handler: RedeemAuthTokenHandler;

    constructor(handler: RedeemAuthTokenHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<RedeemAuthTokenRequestDto, LoginResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['authTokenId', 'authTokenValue'],
                properties: {
                    authTokenId: { type: 'string' },
                    authTokenValue: { type: 'string' },
                },
            },
        };

        return {
            name: 'RedeemAuthToken',
            method: 'POST',
            path: '/api/v1/auth/redeem-token',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}