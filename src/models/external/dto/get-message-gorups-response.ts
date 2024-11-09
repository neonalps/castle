import { MessageGroupDto } from "@src/models/external/dto/message-group";

export interface GetMessageGroupsResponseDto {
    messageGroups: MessageGroupDto[];
}