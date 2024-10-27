import { requireNonNull } from "@src/util/common";
import { ProfilePermissionMapper } from "@src/modules/profile-permission/mapper";
import { validateNotNull } from "@src/util/validation";
import { Permission } from "@src/models/internal/enum/permission";

export class ProfilePermissionService {

    private readonly mapper: ProfilePermissionMapper;

    constructor(mapper: ProfilePermissionMapper) {
        this.mapper = requireNonNull(mapper);
    }

    public async setPermissions(profileId: number, permissions: Set<Permission>): Promise<void> {
        validateNotNull(profileId, "profileId");
        validateNotNull(permissions, "permissions");

        await this.mapper.deleteByProfileId(profileId);
        await this.mapper.createForProfileId(profileId, permissions);
    }

    public async hasPermission(profileId: number, permission: Permission): Promise<boolean> {
        validateNotNull(profileId, "profileId");
        validateNotNull(permission, "permission");

        const permissions = await this.mapper.getByProfileId(profileId);
        return permissions.has(permission);
    }

}