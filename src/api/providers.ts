import { RouteProvider } from "@src/router/types";
import { getMessageRouteProviders } from "@src/api/v1/message/message-providers";
import { getAuthRouteProviders } from "@src/api/v1/auth/auth-providers";
import { getProfileRouteProviders } from "@src/api/v1/profile/profile-providers";

export function getRouteProviders(): RouteProvider<any, any>[] {
    return [ 
        ...getAuthRouteProviders(),
        ...getMessageRouteProviders(),
        ...getProfileRouteProviders(),
    ];
}