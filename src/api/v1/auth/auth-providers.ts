import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { ProfileLoginHandler } from "@src/api/v1/auth/profile-login/handler";
import { Dependencies } from "@src/di/dependencies";
import { AuthService } from "@src/modules/auth/service";
import { ProfileLoginRouteProvider } from "@src/api/v1/auth/profile-login/route-provider";
import { RedeemAuthTokenHandler } from "@src/api/v1/auth/redeem-token/handler";
import { ProfilePermissionService } from "@src/modules/profile-permission/service";
import { RedeemAuthTokenRouteProvider } from "@src/api/v1/auth/redeem-token/route-provider";
import { RefreshTokenHandler } from "@src/api/v1/auth/refresh-token/handler";
import { RefreshTokenRouteProvider } from "@src/api/v1/auth/refresh-token/route-provider";

export function getAuthRouteProviders(): RouteProvider<any, any>[] {
    const authService = dependencyManager.get<AuthService>(Dependencies.AuthService);
    const profilePermissionService = dependencyManager.get<ProfilePermissionService>(Dependencies.ProfilePermissionService);

    const profileLoginHandler = new ProfileLoginHandler(authService);
    const redeemAuthTokenHandler = new RedeemAuthTokenHandler(authService, profilePermissionService);
    const refreshTokenHandler = new RefreshTokenHandler(authService);

    return [
        new ProfileLoginRouteProvider(profileLoginHandler),
        new RedeemAuthTokenRouteProvider(redeemAuthTokenHandler),
        new RefreshTokenRouteProvider(refreshTokenHandler),
    ];
}