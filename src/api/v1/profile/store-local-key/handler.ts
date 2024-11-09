import { AuthenticationError } from "@src/api/error/authentication-error";
import { StoreEncryptedLocalKeyRequestDto } from "@src/models/external/dto/store-encrypted-local-key-request";
import { ProfileService } from "@src/modules/profile/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isNotDefined, requireNonNull } from "@src/util/common";

export class StoreEncryptedLocalKeyHandler implements RouteHandler<StoreEncryptedLocalKeyRequestDto, void> {

    private readonly profileService: ProfileService;

    constructor(profileService: ProfileService) {
        this.profileService = requireNonNull(profileService);
    }

    public async handle(context: AuthenticationContext, dto: StoreEncryptedLocalKeyRequestDto): Promise<void> {
        const profileId = context.profile?.id;
        if (isNotDefined(profileId)) {
            throw new AuthenticationError("Profile ID could not be found");
        }

        await this.profileService.storeEncryptedLocalKey(profileId as number, dto.encryptedLocalKey);
    }

}