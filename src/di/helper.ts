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
import { UuidSource } from "@src/util/uuid";
import { TimeSource } from "@src/util/date";
import { CryptoService } from "@src/modules/crypto/service";
import { ProfileAuthTokenMapper } from "@src/modules/profile-auth-token/mapper";
import { ProfileAuthTokenConfig, ProfileAuthTokenService } from "@src/modules/profile-auth-token/service";
import { AuthService } from "@src/modules/auth/service";
import { EmailService } from "@src/modules/email/service";
import { getCryptoConfig, getTokenConfig } from "@src/config";
import { RandomSource } from "@src/util/random";
import { ProfilePermissionMapper } from "@src/modules/profile-permission/mapper";
import { ProfilePermissionService } from "@src/modules/profile-permission/service";

export class DependencyHelper {

    private constructor() {}

    public static initDependencies(): void {
        dependencyManager.registerAll(this.getDependencies());
    }

    private static getDependencies(): Map<Dependencies, any> {

        const sqlInstance = sql;

        const cryptoService = new CryptoService(getCryptoConfig());
        const emailService = new EmailService();
        const randomSource = new RandomSource();
        const timeSource = new TimeSource();
        const uuidSource = new UuidSource();

        const appMapper = new AppMapper(sqlInstance);
        const appService = new AppService(appMapper);

        const messageMapper = new MessageMapper(sqlInstance);
        const messageService = new MessageService(messageMapper);

        const paginationService = new PaginationService();

        const profileAuthTokenMapper = new ProfileAuthTokenMapper(sqlInstance);

        const profileAuthTokenConfig: ProfileAuthTokenConfig = {
            tokenLength: 8,
            validitySeconds: 600,
        };

        const profileAuthTokenService = new ProfileAuthTokenService(profileAuthTokenConfig, profileAuthTokenMapper, randomSource, timeSource, uuidSource);

        const profilePermissionMapper = new ProfilePermissionMapper(sqlInstance);
        const profilePermissionService = new ProfilePermissionService(profilePermissionMapper);

        const messageGroupMapper = new MessageGroupMapper(sql);
        const messageGroupService = new MessageGroupService(appService, messageGroupMapper, profilePermissionService);

        const profileMapper = new ProfileMapper(sqlInstance);
        const profileService = new ProfileService(cryptoService, profileMapper, messageGroupService, uuidSource);

        const authService = new AuthService(appService, emailService, profileService, profileAuthTokenService, timeSource, getTokenConfig());

        const dependencies: Map<Dependencies, any> = new Map();

        dependencies.set(Dependencies.AppMapper, appMapper);
        dependencies.set(Dependencies.AppService, appService);
        dependencies.set(Dependencies.AuthService, authService);
        dependencies.set(Dependencies.CryptoService, cryptoService);
        dependencies.set(Dependencies.EmailService, emailService);
        dependencies.set(Dependencies.MessageGroupMapper, messageGroupMapper);
        dependencies.set(Dependencies.MessageGroupService, messageGroupService);
        dependencies.set(Dependencies.MessageMapper, messageMapper);
        dependencies.set(Dependencies.MessageService, messageService);
        dependencies.set(Dependencies.PaginationService, paginationService);
        dependencies.set(Dependencies.ProfileAuthTokenMapper, profileAuthTokenMapper);
        dependencies.set(Dependencies.ProfileAuthTokenService, profileAuthTokenService);
        dependencies.set(Dependencies.ProfilePermissionMapper, profilePermissionMapper);
        dependencies.set(Dependencies.ProfilePermissionService, profilePermissionService);
        dependencies.set(Dependencies.ProfileMapper, profileMapper);
        dependencies.set(Dependencies.ProfileService, profileService);
        dependencies.set(Dependencies.RandomSource, randomSource);
        dependencies.set(Dependencies.TimeSource, timeSource);
        dependencies.set(Dependencies.UuidSource, uuidSource);
        
        return dependencies;
    }

}