import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { ProfileLoginHandler } from "@src/api/v1/auth/profile-login/handler";
import { Dependencies } from "@src/di/dependencies";
import { AuthService } from "@src/modules/auth/service";
import { ProfileLoginRouteProvider } from "@src/api/v1/auth/profile-login/route-provider";

export function getAuthRouteProviders(): RouteProvider<any, any>[] {
    const authService = dependencyManager.get<AuthService>(Dependencies.AuthService);

    const profileLoginHandler = new ProfileLoginHandler(authService);

    return [
        new ProfileLoginRouteProvider(profileLoginHandler),
    ];
}