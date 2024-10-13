import { Sql } from "@src/db/db";
import { AppDao } from "@src/models/internal/dao/app";
import { CreateAppDto } from "@src/models/internal/dto/create-app";
import { AppDaoInterface } from "@src/models/internal/interface/app";
import { requireNonNull } from "@src/util/common";
import { PendingQuery, Row } from "postgres";

export class AppMapper {

    private readonly sql: Sql;

    constructor(sql: Sql) {
        this.sql = requireNonNull(sql);
    }

    public async getById(id: number): Promise<AppDao | null> {
        const result = await this.sql<AppDaoInterface[]>`
            ${ this.commonAppSelect() }
            where
                id = ${ id }
        `;

        if (!result || result.length === 0) {
            return null;
        }


        return AppDao.fromDaoInterface(result[0]);
    }

    public async create(dto: CreateAppDto): Promise<number> {
        const result = await this.sql`
            insert into app
                (public_id, name, base_url, enabled, created_at)
            values
                (${ dto.publicId }, ${ dto.name }, ${ dto.baseUrl }, ${ dto.enabled }, now())
            returning id
        `;
    
        return result[0].id;
    }

    private commonAppSelect(): PendingQuery<Row[]> {
        return this.sql`
            select
                id,
                public_id,
                name,
                base_url,
                enabled,
                created_at
            from
                app`;
    }

}