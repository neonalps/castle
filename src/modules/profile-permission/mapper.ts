import { Sql } from "@src/db/db";
import { Permission } from "@src/models/internal/enum/permission";
import { ProfilePermissionDaoInterface } from "@src/models/internal/interface/profile-permission";
import { requireNonNull } from "@src/util/common";

export class ProfilePermissionMapper {

    private readonly sql: Sql;

    constructor(sql: Sql) {
        this.sql = requireNonNull(sql);
    }

    public async createForProfileId(profileId: number, permissions: Set<Permission>): Promise<void> {
        const permissionString = Array.from(permissions).join(" ");

        await this.sql<ProfilePermissionDaoInterface[]>`
            insert into profile_permissions (profile_id, permission) values (${profileId}, ${permissionString})
        `;
    }

    public async getByProfileId(profileId: number): Promise<Set<Permission>> {
        const result = await this.sql<ProfilePermissionDaoInterface[]>`
            select
                permission
            from
                profile_permissions
            where
                profile_id = ${ profileId }
        `;

        if (!result || result.length === 0) {
            return new Set();
        }

        const permissions = result[0].permission.split(" ")
            .filter(item => Object.values(Permission).includes(item as Permission))
            .map(item => item as Permission);

        return new Set(permissions);
    }

    public async deleteByProfileId(profileId: number): Promise<void> {
        await this.sql<ProfilePermissionDaoInterface[]>`
            delete from
                profile_permissions
            where
                profile_id = ${ profileId }
        `;
    }

}