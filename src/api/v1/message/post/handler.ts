import { AuthenticationError } from "@src/api/error/authentication-error";
import { PostMessageRequestDto } from "@src/models/external/dto/post-message-request";
import { PostMessageResponseDto } from "@src/models/external/dto/post-message-response";
import { MessageService } from "@src/modules/message/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isDefined, isNotDefined, requireNonNull } from "@src/util/common";
import { deserializeMerkle, serializeMerkle } from "@src/util/message";

export class PostMessageHandler implements RouteHandler<PostMessageRequestDto, PostMessageResponseDto> {

    private readonly messageService: MessageService;

    constructor(messageService: MessageService) {
        this.messageService = requireNonNull(messageService);
    }

    public async handle(context: AuthenticationContext, dto: PostMessageRequestDto): Promise<PostMessageResponseDto> {
        const messageGroupId = context.messageGroupId;
        if (isNotDefined(messageGroupId)) {
            throw new AuthenticationError("messageGroupId could not be found");
        }

        const messageGroupMerkle = await this.messageService.postMessages(messageGroupId as number, dto.messages);

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