import { AuthenticationError } from "@src/api/error/authentication-error";
import { IllegalStateError } from "@src/api/error/illegal-state-error";
import { MessageDto } from "@src/models/external/dto/message";
import { PaginatedResponseDto } from "@src/models/external/dto/paginated-response";
import { ReadMessageRequestDto } from "@src/models/external/dto/read-message-request";
import { MessageService, ReadMessagePaginationParams } from "@src/modules/message/service";
import { PaginationService } from "@src/modules/pagination/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isDefined, isNotDefined, requireNonNull } from "@src/util/common";

export class ReadMessageHandler implements RouteHandler<ReadMessageRequestDto, PaginatedResponseDto<MessageDto>> {

    private readonly messageService: MessageService;
    private readonly paginationService: PaginationService;

    constructor(messageService: MessageService, paginationService: PaginationService) {
        this.messageService = requireNonNull(messageService);
        this.paginationService = requireNonNull(paginationService);
    }

    public async handle(context: AuthenticationContext, dto: ReadMessageRequestDto): Promise<PaginatedResponseDto<MessageDto>> {
        const profileId = context.profile?.id;
        if (isNotDefined(profileId)) {
            throw new AuthenticationError("Profile could not be found");
        }

        if (isDefined(dto.nextPageKey) && (isDefined(dto.limit) || isDefined(dto.clientId) || isDefined(dto.timestamp))) {
            throw new IllegalStateError("When nextPageKey is passed no other query parameters are allowed");
        }

        if (isNotDefined(dto.nextPageKey) && isNotDefined(dto.clientId)) {
            throw new IllegalStateError("Missing mandatory query parameter clientId");
        }

        if (isNotDefined(dto.nextPageKey) && isNotDefined(dto.timestamp)) {
            throw new IllegalStateError("Missing mandatory query parameter timestamp");
        }

        const paginationParams = this.getPaginationParams(dto);

        const messages = await this.messageService.readMessages(profileId as number, paginationParams);

        const messageDtos: MessageDto[] = messages.map(item => {
            return {
                timestamp: item.timestamp,
                content: item.content,
                isEncrypted: item.isEncrypted,
            };
        })

        return {
            items: messageDtos,
            nextPageKey: this.buildNextPageKey(messageDtos, paginationParams),
        }
    }

    private buildNextPageKey(items: MessageDto[], oldParams: ReadMessagePaginationParams): string | undefined {
        if (items.length < oldParams.limit) {
            return;
        }

        const newParams: ReadMessagePaginationParams = {
            limit: oldParams.limit,
            clientId: oldParams.clientId,
            lastSeen: this.paginationService.getLastElement(items).timestamp,
        };

        return this.paginationService.encode(newParams);
    }

    private getPaginationParams(dto: ReadMessageRequestDto): ReadMessagePaginationParams {
        if (!dto.nextPageKey) {
            const limit: number = dto.limit || 50;
            const timestamp: string = dto.timestamp;
            const clientId: string = dto.clientId;

            return {
                limit,
                clientId,
                lastSeen: timestamp,
            };
        }

        return this.paginationService.decode<ReadMessagePaginationParams>(dto.nextPageKey);
    }

}