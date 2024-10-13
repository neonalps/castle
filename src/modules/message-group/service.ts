import { requireNonNull } from "@src/util/common";
import { MessageGroupMapper } from "@src/modules/message-group/mapper";
import { validateNotNull } from "@src/util/validation";
import { MessageGroupDao } from "@src/models/internal/dao/message-group";

export class MessageGroupService {

    private readonly mapper;

    constructor(mapper: MessageGroupMapper) {
        this.mapper = requireNonNull(mapper);
    }

    public getByProfileId(profileId: number): Promise<MessageGroupDao | null> {
        validateNotNull(profileId, "profileId");

        return this.mapper.getByProfileId(profileId);
    }

}