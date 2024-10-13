import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { PostMessageHandler } from "@src/api/v1/message/post/handler";
import { MessageService } from "@src/modules/message/service";
import { Dependencies } from "@src/di/dependencies";
import { PostMessageRouteProvider } from "@src/api/v1/message/post/route-provider";
import { PaginationService } from "@src/modules/pagination/service";
import { ReadMessageHandler } from "./read/handler";
import { ReadMessageRouteProvider } from "./read/route-provider";

export function getMessageRouteProviders(): RouteProvider<any, any>[] {
    const messageService = dependencyManager.get<MessageService>(Dependencies.MessageService);
    const paginationService = dependencyManager.get<PaginationService>(Dependencies.PaginationService);

    const postMessageHandler = new PostMessageHandler(messageService);
    const readMessageHandler = new ReadMessageHandler(messageService, paginationService);

    return [
        new PostMessageRouteProvider(postMessageHandler),
        new ReadMessageRouteProvider(readMessageHandler),
    ];
}