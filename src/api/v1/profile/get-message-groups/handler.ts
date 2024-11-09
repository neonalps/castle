import { AuthenticationError } from "@src/api/error/authentication-error";
import { GetMessageGroupsResponseDto } from "@src/models/external/dto/get-message-gorups-response";
import { MessageGroupDto } from "@src/models/external/dto/message-group";
import { ProfileDao } from "@src/models/internal/dao/profile";
import { MessageGroupService } from "@src/modules/message-group/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isNotDefined, requireNonNull } from "@src/util/common";

export class GetMessageGroupsHandler implements RouteHandler<void, GetMessageGroupsResponseDto> {

    private readonly messageGroupService: MessageGroupService;

    constructor(messageGroupService: MessageGroupService) {
        this.messageGroupService = requireNonNull(messageGroupService);
    }

    public async handle(context: AuthenticationContext, _: void): Promise<GetMessageGroupsResponseDto> {
        const profile = context.profile;
        if (isNotDefined(profile)) {
            throw new AuthenticationError("Profile could not be found");
        }

        const messageGroups = await this.messageGroupService.getForProfile(profile as ProfileDao);

        const dtos: MessageGroupDto[] = messageGroups.map(messageGroup => {
            return {
                id: messageGroup.publicId,
                isGlobalAppMessageGroup: isNotDefined(messageGroup.profileId),
                name: null,
            };
        })

        return {
            messageGroups: dtos,
        };
    }

}