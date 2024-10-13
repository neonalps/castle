import { Sql } from "@src/db/db";
import { ProfileDao } from "@src/models/internal/dao/profile";
import { CreateProfileDto } from "@src/models/internal/dto/create-profile";
import { ProfileDaoInterface } from "@src/models/internal/interface/profile";
import { requireNonNull } from "@src/util/common";
import { PendingQuery, Row } from "postgres";

export class ProfileMapper {

    private readonly sql: Sql;

    constructor(sql: Sql) {
        this.sql = requireNonNull(sql);
    }

    public async getById(id: number): Promise<ProfileDao | null> {
        const result = await this.sql<ProfileDaoInterface[]>`
            ${ this.commonProfileSelect() }
            where
                id = ${ id }
        `;

        if (!result || result.length === 0) {
            return null;
        }

        return ProfileDao.fromDaoInterface(result[0]);
    }

    public async getByPublicId(publicId: string): Promise<ProfileDao | null> {
        const result = await this.sql<ProfileDaoInterface[]>`
            ${ this.commonProfileSelect() }
            where
                public_id = ${ publicId }
        `;

        if (!result || result.length === 0) {
            return null;
        }

        return ProfileDao.fromDaoInterface(result[0]);
    }

    public async create(dto: CreateProfileDto): Promise<number> {
        const result = await this.sql`
            insert into profile
                (public_id, app_id, hashed_email, encrypted_local_key, created_at)
            values
                (${ dto.publicId }, ${ dto.appId }, ${ dto.hashedEmail }, ${ dto.encryptedLocalKey }, now())
            returning id
        `;
    
        return result[0].id;
    }

    private commonProfileSelect(): PendingQuery<Row[]> {
        return this.sql`
            select
                id,
                public_id,
                hashed_email,
                encrypted_local_key,
                created_at
            from
                project`;
    }

}