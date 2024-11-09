import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { StoreEncryptedLocalKeyHandler } from "@src/api/v1/profile/store-local-key/handler";
import { ProfileService } from "@src/modules/profile/service";
import { Dependencies } from "@src/di/dependencies";
import { StoreEncryptedLocalKeyRouteProvider } from "@src/api/v1/profile/store-local-key/route-provider";
import { MessageGroupService } from "@src/modules/message-group/service";
import { GetMessageGroupsHandler } from "@src/api/v1/profile/get-message-groups/handler";
import { GetMessageGroupsRouteProvider } from "@src/api/v1/profile/get-message-groups/route-provider";

export function getProfileRouteProviders(): RouteProvider<any, any>[] {
    const messageGroupService = dependencyManager.get<MessageGroupService>(Dependencies.MessageGroupService);
    const profileService = dependencyManager.get<ProfileService>(Dependencies.ProfileService);

    const getMessageGroupsHandler = new GetMessageGroupsHandler(messageGroupService);
    const storeLocalKeyHandler = new StoreEncryptedLocalKeyHandler(profileService);

    return [
        new GetMessageGroupsRouteProvider(getMessageGroupsHandler),
        new StoreEncryptedLocalKeyRouteProvider(storeLocalKeyHandler),
    ];
}