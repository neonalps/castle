import { merkle, Timestamp } from "@src/crdt";
import { TrieNode } from "@src/crdt/merkle";
import { Sql } from "@src/db/db";
import { MessageDao } from "@src/models/internal/dao/message";
import { CreateMessageDto } from "@src/models/internal/dto/create-message";
import { MessageDaoInterface } from "@src/models/internal/interface/message";
import { MessageGroupMerkleDaoInterface } from "@src/models/internal/interface/message-group-merkle";
import { isNotDefined, requireNonNull } from "@src/util/common";
import { deserializeMerkle, serializeMerkle } from "@src/util/message";

export class MessageMapper {

    private readonly sql: Sql;

    constructor(sql: Sql) {
        this.sql = requireNonNull(sql);
    }

    public async postMessages(messageGroupId: number, messageDtos: CreateMessageDto[]): Promise<TrieNode> {
        const messages: MessageDaoInterface[] = messageDtos.map(item => {
            return {
                messageGroupId,
                timestamp: item.timestamp,
                content: item.content,
                isEncrypted: item.isEncrypted,
            };
        });

        return this.sql.begin(async transaction => {
            const profileMerkle: string | null = await this.getMessageGroupMerkle(transaction, messageGroupId);

            let currentMerkle: TrieNode = deserializeMerkle(profileMerkle);

            if (messages.length === 0) {
                return currentMerkle;
            }

            // inserts all messages in one statement and returns the timestamp value of the messages that were actually inserted
            const insertTimestampsResult = await transaction`
                insert into message ${ transaction(messages, "timestamp", "messageGroupId", "content", "isEncrypted") } 
                    on conflict do nothing returning timestamp
            `;

            if (isNotDefined(insertTimestampsResult)) {
                throw new Error("Failed to write messages");
            }

            const insertedTimestamps: string[] = insertTimestampsResult.map(item => item.timestamp);
            for (const insertedTimestamp of insertedTimestamps) {
                const parsedTimestamp = Timestamp.parse(insertedTimestamp);
                if (parsedTimestamp === null) {
                    console.warn(`Failed to parse timestamp '${insertedTimestamp}'`);
                    continue;
                }

                currentMerkle = merkle.insert(currentMerkle, parsedTimestamp);
                console.info("inserted timestamp", insertedTimestamp);
            }

            currentMerkle = merkle.prune(currentMerkle);

            const serializedMerkle = serializeMerkle(currentMerkle);
            await transaction`update message_group set merkle = ${serializedMerkle} where id = ${messageGroupId}`;

            return currentMerkle;
        });
    }

    public async readMessages(messageGroupId: number, clientId: string, lastSeenTimestamp: string, limit: number): Promise<MessageDao[]> {
        const wildcardPrefixedClientId = `%${clientId}`;

        const result = await this.sql<MessageDaoInterface[]>`
            select 
                timestamp,
                content,
                is_encrypted
            from
                message 
            where 
                message_group_id = ${messageGroupId} and 
                timestamp > ${lastSeenTimestamp} and 
                timestamp not like ${wildcardPrefixedClientId} 
            order by
                timestamp asc
            limit ${limit}
        `;

        if (!result || result.length === 0) {
            return [];
        }

        return result.map(item => {
            return MessageDao.Builder
                .withMessageGroupId(messageGroupId)
                .withTimestamp(item.timestamp)
                .withContent(item.content)
                .withIsEncrypted(item.isEncrypted)
                .build();
        });
    }

    private async getMessageGroupMerkle(sql: Sql, messageGroupId: number): Promise<string | null> {
        const result = await sql<MessageGroupMerkleDaoInterface[]>`select merkle from message_group where id = ${messageGroupId}`;
        if (!result || result.length === 0) {
            return null;
        }

        return result[0].merkle;
    }

}