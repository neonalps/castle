import { AuthenticationError } from "@src/api/error/authentication-error";
import { AuthorizationError } from "@src/api/error/authorization-error";
import { IllegalStateError } from "@src/api/error/illegal-state-error";
import { PostMessageRequestDto } from "@src/models/external/dto/post-message-request";
import { PostMessageResponseDto } from "@src/models/external/dto/post-message-response";
import { ProfileDao } from "@src/models/internal/dao/profile";
import { MessageGroupService } from "@src/modules/message-group/service";
import { MessageService } from "@src/modules/message/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isDefined, isNotDefined, requireNonNull } from "@src/util/common";
import { deserializeMerkle, serializeMerkle } from "@src/util/message";

export class PostMessageHandler implements RouteHandler<PostMessageRequestDto, PostMessageResponseDto> {

    private readonly messageGroupService: MessageGroupService;
    private readonly messageService: MessageService;

    constructor(messageGroupService: MessageGroupService, messageService: MessageService) {
        this.messageGroupService = requireNonNull(messageGroupService);
        this.messageService = requireNonNull(messageService);
    }

    public async handle(context: AuthenticationContext, dto: PostMessageRequestDto): Promise<PostMessageResponseDto> {
        const profile = context.profile;
        if (isNotDefined(profile)) {
            throw new AuthenticationError("Profile could not be found");
        }

        const messageGroup = await this.messageGroupService.getByPublicId(dto.messageGroupId);
        if (messageGroup === null) {
            throw new IllegalStateError("Message group could not be found");
        }

        const canWriteToMessageGroup = await this.messageGroupService.canProfileWriteToMessageGroup(profile as ProfileDao, messageGroup);
        if (!canWriteToMessageGroup) {
            throw new AuthorizationError("Profile is not authorized to write to this message group");
        }

        const messageGroupMerkle = await this.messageService.postMessages(messageGroup.id, dto.messages);

        const response: PostMessageResponseDto = {
            groupMerkle: serializeMerkle(messageGroupMerkle),
        };

        if (isDefined(dto.merkle)) {
            const clientMerkle = deserializeMerkle(dto.merkle);
            const messageDiff = this.messageService.calculateMessageDiff(messageGroupMerkle, clientMerkle);
            
            if (isDefined(messageDiff)) {
                response.diffTimestamp = messageDiff;
            }
        }

        return response;
    }

}