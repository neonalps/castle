import { Sql } from "@src/db/db";
import { MessageGroupDao } from "@src/models/internal/dao/message-group";
import { MessageGroupDaoInterface } from "@src/models/internal/interface/message-group";
import { requireNonNull } from "@src/util/common";
import { PendingQuery, Row } from "postgres";

export class MessageGroupMapper {

    private readonly sql: Sql;

    constructor(sql: Sql) {
        this.sql = requireNonNull(sql);
    }

    public async getByProfileId(profileId: number): Promise<MessageGroupDao | null> {
        const result = await this.sql<MessageGroupDaoInterface[]>`
                ${ this.commonMessageGroupSelect() }
                where
                    profile_id = ${ profileId }
            `;
    
            if (!result || result.length === 0) {
                return null;
            }
    
            return MessageGroupDao.fromDaoInterface(result[0]);
    }

    private commonMessageGroupSelect(): PendingQuery<Row[]> {
        return this.sql`
            select
                id,
                profile_id
            from
                message_group`;
    }

}