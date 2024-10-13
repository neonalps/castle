import dependencyManager from "./manager";
import { Dependencies } from "./dependencies";
import sql from "@src/db/db";
import { AppMapper } from "@src/modules/app/mapper";
import { AppService } from "@src/modules/app/service";
import { ProfileMapper } from "@src/modules/profile/mapper";
import { ProfileService } from "@src/modules/profile/service";
import { MessageMapper } from "@src/modules/message/mapper";
import { MessageService } from "@src/modules/message/service";
import { PaginationService } from "@src/modules/pagination/service";
import { MessageGroupService } from "@src/modules/message-group/service";
import { MessageGroupMapper } from "@src/modules/message-group/mapper";

export class DependencyHelper {

    private constructor() {}

    public static initDependencies(): void {
        dependencyManager.registerAll(this.getDependencies());
    }

    private static getDependencies(): Map<Dependencies, any> {

        const sqlInstance = sql;

        const appMapper = new AppMapper(sqlInstance);
        const appService = new AppService(appMapper);

        const messageGroupMapper = new MessageGroupMapper(sql);
        const messageGroupService = new MessageGroupService(messageGroupMapper);

        const messageMapper = new MessageMapper(sqlInstance);
        const messageService = new MessageService(messageMapper);

        const paginationService = new PaginationService();

        const profileMapper = new ProfileMapper(sqlInstance);
        const profileService = new ProfileService(profileMapper);

        const dependencies: Map<Dependencies, any> = new Map();

        dependencies.set(Dependencies.AppMapper, appMapper);
        dependencies.set(Dependencies.AppService, appService);
        dependencies.set(Dependencies.MessageGroupMapper, messageGroupMapper);
        dependencies.set(Dependencies.MessageGroupService, messageGroupService);
        dependencies.set(Dependencies.MessageMapper, messageMapper);
        dependencies.set(Dependencies.MessageService, messageService);
        dependencies.set(Dependencies.PaginationService, paginationService);
        dependencies.set(Dependencies.ProfileMapper, profileMapper);
        dependencies.set(Dependencies.ProfileService, profileService);
        
        return dependencies;
    }

}