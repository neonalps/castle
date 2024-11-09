import { GetMessageGroupsResponseDto } from "@src/models/external/dto/get-message-gorups-response";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { GetMessageGroupsHandler } from "./handler";
import { requireNonNull } from "@src/util/common";

export class GetMessageGroupsRouteProvider implements RouteProvider<void, GetMessageGroupsResponseDto> {

    private readonly handler: GetMessageGroupsHandler;

    constructor(handler: GetMessageGroupsHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<void, GetMessageGroupsResponseDto> {
        const schema: RequestSchema = {};

        return {
            name: 'GetMessageGroups',
            method: 'GET',
            path: '/api/v1/profile/message-groups',
            schema,
            handler: this.handler,
            authenticated: true,
        }
    }

}