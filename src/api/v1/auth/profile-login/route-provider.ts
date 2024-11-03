import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { ProfileLoginRequestDto } from "@src/models/external/dto/profile-login-request";
import { ProfileLoginHandler } from "@src/api/v1/auth/profile-login/handler";
import { ProfileLoginResponseDto } from "@src/models/external/dto/profile-login-response";

export class ProfileLoginRouteProvider implements RouteProvider<ProfileLoginRequestDto, ProfileLoginResponseDto> {

    private readonly handler: ProfileLoginHandler;

    constructor(handler: ProfileLoginHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<ProfileLoginRequestDto, ProfileLoginResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['publicAppId', 'email'],
                properties: {
                    publicAppId: { type: 'string' },
                    email: { type: 'string' },
                },
            },
        };

        return {
            name: 'ProfileLogin',
            method: 'POST',
            path: '/api/v1/auth/profile-login',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}