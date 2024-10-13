import { RouteProvider } from "@src/router/types";
import { getMessageRouteProviders } from "@src/api/v1/message/message-providers";

export function getRouteProviders(): RouteProvider<any, any>[] {
    return [ 
        ...getMessageRouteProviders(),
    ];
}