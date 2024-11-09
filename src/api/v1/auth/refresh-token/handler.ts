import { RefreshTokenRequestDto } from "@src/models/external/dto/refresh-token-response";
import { TokenResponseDto } from "@src/models/external/dto/token-response";
import { AuthService } from "@src/modules/auth/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { requireNonNull } from "@src/util/common";

export class RefreshTokenHandler implements RouteHandler<RefreshTokenRequestDto, TokenResponseDto> {

    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = requireNonNull(authService);
    }

    public handle(_: AuthenticationContext, dto: RefreshTokenRequestDto): Promise<TokenResponseDto> {
        return Promise.resolve(this.authService.validateAndRenewRefreshToken(dto.refreshToken));
    }

}