import { LoginResponseDto } from "@src/models/external/dto/login-response";
import { RedeemAuthTokenRequestDto } from "@src/models/external/dto/redeem-auth-token-request";
import { Permission } from "@src/models/internal/enum/permission";
import { Scope } from "@src/models/internal/enum/scope";
import { AuthService } from "@src/modules/auth/service";
import { ProfilePermissionService } from "@src/modules/profile-permission/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { removeNull, requireNonNull } from "@src/util/common";

export class RedeemAuthTokenHandler implements RouteHandler<RedeemAuthTokenRequestDto, LoginResponseDto> {

    private readonly authService: AuthService;
    private readonly profilePermissionService: ProfilePermissionService;

    constructor(authService: AuthService, profilePermissionService: ProfilePermissionService) {
        this.authService = requireNonNull(authService);
        this.profilePermissionService = requireNonNull(profilePermissionService);
    }

    public async handle(_: AuthenticationContext, dto: RedeemAuthTokenRequestDto): Promise<LoginResponseDto> {
        const profile = await this.authService.redeemAuthToken(dto);
        
        const publicProfileId = profile.publicId;
        
        const hasGlobalMessageWritePermission = await this.profilePermissionService.hasPermission(profile.id, Permission.GlobalMessageWrite);

        const scopes: Set<Scope> = new Set([
            Scope.User,
            hasGlobalMessageWritePermission ? Scope.AppMessageWrite : null,
        ].filter(removeNull) as Scope[]);
        
        return {
            identity: {
                publicId: publicProfileId,
                encryptedLocalKey: profile.encryptedLocalKey,
            },
            token: {
                accessToken: this.authService.createSignedAccessToken(publicProfileId, scopes),
                refreshToken: this.authService.createSignedRefreshToken(publicProfileId, scopes),
            }
        }
    }

}