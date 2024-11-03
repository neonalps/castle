import { Sql } from "@src/db/db";
import { ProfileAuthTokenDao } from "@src/models/internal/dao/profile-auth-token";
import { CreateProfileAuthTokenDto } from "@src/models/internal/dto/create-profile-auth-token";
import { ProfileAuthTokenDaoInterface } from "@src/models/internal/interface/profile-auth-token";
import { requireNonNull } from "@src/util/common";
import { PendingQuery, Row } from "postgres";

export class ProfileAuthTokenMapper {

    private readonly sql: Sql;

    constructor(sql: Sql) {
        this.sql = requireNonNull(sql);
    }

    public async getById(id: number): Promise<ProfileAuthTokenDao | null> {
        const result = await this.sql<ProfileAuthTokenDaoInterface[]>`
            ${ this.commonProfileAuthTokenSelect() }
            where
                id = ${id}
        `;

        if (!result || result.length === 0) {
            return null;
        }

        return ProfileAuthTokenDao.fromDaoInterface(result[0]);
    }

    public async getByPublicId(publicId: string): Promise<ProfileAuthTokenDao | null> {
        const result = await this.sql<ProfileAuthTokenDaoInterface[]>`
            ${ this.commonProfileAuthTokenSelect() }
            where
                public_id = ${ publicId }
        `;

        if (!result || result.length === 0) {
            return null;
        }

        return ProfileAuthTokenDao.fromDaoInterface(result[0]);
    }

    public async create(dto: CreateProfileAuthTokenDto): Promise<number> {
        const result = await this.sql`
            insert into profile_auth_token
                (public_id, profile_id, auth_token, auth_token_issued_at, auth_token_expires_at)
            values
                (${ dto.publicId }, ${ dto.profileId }, ${ dto.authToken }, ${ dto.authTokenIssuedAt }, ${ dto.authTokenExpiresAt })
            returning id
        `;
    
        return result[0].id;
    }

    public async delete(id: number): Promise<void> {
        await this.sql`delete from profile_auth_token where id = ${id}`;
    }

    private commonProfileAuthTokenSelect(): PendingQuery<Row[]> {
        return this.sql`
            select
                id,
                public_id,
                profile_id,
                auth_token,
                auth_token_issued_at,
                auth_token_expires_at
            from
                profile_auth_token`;
    }

}