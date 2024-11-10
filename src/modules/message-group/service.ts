import { isNotDefined, removeNull, requireNonNull } from "@src/util/common";
import { MessageGroupMapper } from "@src/modules/message-group/mapper";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { MessageGroupDao } from "@src/models/internal/dao/message-group";
import { AppService } from "@src/modules/app/service";
import { ProfilePermissionService } from "@src/modules/profile-permission/service";
import { Permission } from "@src/models/internal/enum/permission";
import { ProfileDao } from "@src/models/internal/dao/profile";
import { IllegalStateError } from "@src/api/error/illegal-state-error";
import { AppDao } from "@src/models/internal/dao/app";
import { CreateMessageGroupDto } from "@src/models/internal/dto/create-message-group";

export class MessageGroupService {

    private readonly appService: AppService;
    private readonly mapper: MessageGroupMapper;
    private readonly profilePermissionService: ProfilePermissionService;

    constructor(appService: AppService, mapper: MessageGroupMapper, profilePermissionService: ProfilePermissionService) {
        this.appService = requireNonNull(appService);
        this.mapper = requireNonNull(mapper);
        this.profilePermissionService = requireNonNull(profilePermissionService);
    }

    public async create(dto: CreateMessageGroupDto): Promise<MessageGroupDao> {
        validateNotNull(dto, "dto");
        validateNotBlank(dto.publicId, "dto.publicId");

        const messageGroupId = await this.mapper.create(dto);
        const messageGroup = await this.getById(messageGroupId);
        if (messageGroup === null) {
            throw new IllegalStateError("Failed to create message group");
        }
        
        return messageGroup;
    }

    public getById(id: number): Promise<MessageGroupDao | null> {
        validateNotNull(id, "id");

        return this.mapper.getById(id);
    }

    public getByPublicId(publicId: string): Promise<MessageGroupDao | null> {
        validateNotNull(publicId, "publicId");

        return this.mapper.getByPublicId(publicId);
    }

    public getByProfileId(profileId: number): Promise<MessageGroupDao | null> {
        validateNotNull(profileId, "profileId");

        return this.mapper.getByProfileId(profileId);
    }

    public async canProfileWriteToMessageGroup(profile: ProfileDao, checkMessageGroup: MessageGroupDao): Promise<boolean> {
        validateNotNull(profile, "profile");
        validateNotNull(checkMessageGroup, "checkMessageGroup");

        // is it the profile's personal message group?
        const profileMessageGroup = await this.getByProfileId(profile.id);
        if (profileMessageGroup !== null && profileMessageGroup.id === checkMessageGroup.id) {
            return true;
        }

        // does the profile have global app message permission?
        const hasGlobalMessageWritePermission = await this.profilePermissionService.hasPermission(profile.id, Permission.GlobalMessageWrite);
        if (!hasGlobalMessageWritePermission) {
            return false;
        }

        // is it the app's global message group?
        const app = await this.appService.getById(profile.appId);
        return app !== null && app.messageGroupId === checkMessageGroup.id;
    }

    public async canProfileReadFromMessageGroup(profile: ProfileDao, checkMessageGroup: MessageGroupDao): Promise<boolean> {
        validateNotNull(profile, "profile");
        validateNotNull(checkMessageGroup, "checkMessageGroup");

        // is it the profile's personal message group?
        const profileMessageGroup = await this.getByProfileId(profile.id);
        if (profileMessageGroup !== null && profileMessageGroup.id === checkMessageGroup.id) {
            return true;
        }

        // is it the app's global message group?
        const app = await this.appService.getById(profile.appId);
        return app !== null && app.messageGroupId === checkMessageGroup.id;
    }

    public async getForProfile(profile: ProfileDao): Promise<MessageGroupDao[]> {
        validateNotNull(profile, "profile");

        const potentialMessageGroups = await Promise.all([
            this.getByProfileId(profile.id),
            this.getAppMessageGroupIfPermissionPresent(profile),
        ]);

        return potentialMessageGroups.filter(removeNull) as MessageGroupDao[];
    }

    private async getAppMessageGroupIfPermissionPresent(profile: ProfileDao): Promise<MessageGroupDao | null> {
        const hasGlobalMessageWritePermission = await this.profilePermissionService.hasPermission(profile.id, Permission.GlobalMessageWrite);
        if (!hasGlobalMessageWritePermission) {
            return null;
        }

        const app = await this.appService.getById(profile.appId);
        if (isNotDefined(app)) {
            throw new IllegalStateError(`Failed to load profile app`);
        }

        const appMessageGroupId = (app as AppDao).messageGroupId;
        if (isNotDefined(appMessageGroupId)) {
            return null;
        }        

        return this.getById(appMessageGroupId);
    }

}