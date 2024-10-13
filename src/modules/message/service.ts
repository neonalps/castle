import { merkle, Timestamp } from "@src/crdt";
import { TrieNode } from "@src/crdt/merkle";
import { MessageDao } from "@src/models/internal/dao/message";
import { CreateMessageDto } from "@src/models/internal/dto/create-message";
import { MessageMapper } from "@src/modules/message/mapper";
import { requireNonNull } from "@src/util/common";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { PaginationParams } from "@src/modules/pagination/constants";

export interface ReadMessagePaginationParams extends PaginationParams<string> {
    clientId: string;
};

export class MessageService {

    private readonly mapper: MessageMapper;

    constructor(mapper: MessageMapper) {
        this.mapper = requireNonNull(mapper);
    }

    public postMessages(messageGroupId: number, messages: CreateMessageDto[]): Promise<TrieNode> {
        validateNotNull(messageGroupId, "messageGroupId");
        validateNotNull(messages, "messages");

        return this.mapper.postMessages(messageGroupId, messages);
    }

    public readMessages(messageGroupId: number, params: ReadMessagePaginationParams): Promise<MessageDao[]> {
        validateNotNull(messageGroupId, "messageGroupId");
        validateNotNull(params, "params");
        validateNotBlank(params.clientId, "params.clientId");
        validateNotNull(params.limit, "params.limit");
        validateNotNull(params.lastSeen, "params.lastSeen");

        return this.mapper.readMessages(messageGroupId, params.clientId, params.lastSeen, params.limit);
    }

    public calculateMessageDiff(first: TrieNode, second: TrieNode): string | null {
        validateNotNull(first, "first");
        validateNotNull(second, "second");

        const diffTime = merkle.diff(first, second);
        if (!diffTime) {
            return null;
        }

        return new Timestamp(diffTime, 0, '0').toString();
    }

}