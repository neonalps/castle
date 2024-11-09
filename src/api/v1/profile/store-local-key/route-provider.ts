import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { StoreEncryptedLocalKeyHandler } from "@src/api/v1/profile/store-local-key/handler";
import { requireNonNull } from "@src/util/common";
import { StoreEncryptedLocalKeyRequestDto } from "@src/models/external/dto/store-encrypted-local-key-request";

export class StoreEncryptedLocalKeyRouteProvider implements RouteProvider<StoreEncryptedLocalKeyRequestDto, void> {

    private readonly handler: StoreEncryptedLocalKeyHandler;

    constructor(handler: StoreEncryptedLocalKeyHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<StoreEncryptedLocalKeyRequestDto, void> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['encryptedLocalKey'],
                properties: {
                    encryptedLocalKey: { type: 'string' },
                },
            },
        };

        return {
            name: 'StoreEncryptedLocalKey',
            method: 'POST',
            path: '/api/v1/profile/store-local-key',
            schema,
            handler: this.handler,
            authenticated: true,
        }
    }

}