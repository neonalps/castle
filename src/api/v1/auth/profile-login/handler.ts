import { ProfileLoginRequestDto } from "@src/models/external/dto/profile-login-request";
import { ProfileLoginResponseDto } from "@src/models/external/dto/profile-login-response";
import { AuthService } from "@src/modules/auth/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { requireNonNull } from "@src/util/common";

export class ProfileLoginHandler implements RouteHandler<ProfileLoginRequestDto, ProfileLoginResponseDto> {

    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = requireNonNull(authService);
    }

    public async handle(_: AuthenticationContext, dto: ProfileLoginRequestDto): Promise<ProfileLoginResponseDto> {
        const publicProfileAuthTokenId = await this.authService.handleProfileLogin(dto);

        return {
            authTokenId: publicProfileAuthTokenId,
        };
    }

}