import jwt from "jsonwebtoken";
import { ProfileLoginRequestDto } from "@src/models/external/dto/profile-login-request";
import { ProfileAuthTokenService } from "@src/modules/profile-auth-token/service";
import { isNotDefined, requireNonNull } from "@src/util/common";
import { validateNotBlank, validateNotEmpty, validateNotNull } from "@src/util/validation";
import { AppService } from "@src/modules/app/service";
import { IllegalStateError } from "@src/api/error/illegal-state-error";
import { ProfileService } from "@src/modules/profile/service";
import { EmailService } from "@src/modules/email/service";
import { RedeemAuthTokenRequestDto } from "@src/models/external/dto/redeem-auth-token-request";
import { AuthToken } from "@src/models/external/classes/auth-token";
import { TimeSource } from "@src/util/date";
import { Jwt } from "@src/models/external/interface/jwt";
import { ProfileDao } from "@src/models/internal/dao/profile";
import { Scope } from "@src/models/internal/enum/scope";
import { TokenResponseDto } from "@src/models/external/dto/token-response";
import { parseJwt } from "@src/util/token";

export interface TokenConfig {
    accessTokenValiditySeconds: number;
    refreshTokenValiditySeconds: number;
    audience: string;
    issuer: string;
    signingKey: string;
}

export class AuthService {

    public static readonly SCOPE_USER = "user";

    private static readonly TOKEN_TYPE_ACCESS = "ACCESS";
    private static readonly TOKEN_TYPE_REFRESH = "REFRESH";

    private readonly appService: AppService;
    private readonly emailService: EmailService;
    private readonly profileService: ProfileService;
    private readonly profileAuthTokenService: ProfileAuthTokenService;
    private readonly timeSource: TimeSource;
    private readonly tokenConfig: TokenConfig;

    constructor(
        appService: AppService, 
        emailService: EmailService,
        profileService: ProfileService, 
        profileAuthTokenService: ProfileAuthTokenService,
        timeSource: TimeSource,
        tokenConfig: TokenConfig,
    ) {
        this.appService = requireNonNull(appService);
        this.emailService = requireNonNull(emailService);
        this.profileService = requireNonNull(profileService);
        this.profileAuthTokenService = requireNonNull(profileAuthTokenService);
        this.timeSource = requireNonNull(timeSource);
        this.tokenConfig = requireNonNull(tokenConfig);

        this.validateConfig();
    }

    public async handleProfileLogin(loginRequestDto: ProfileLoginRequestDto): Promise<string> {
        validateNotNull(loginRequestDto, "loginRequestDto");
        validateNotNull(loginRequestDto.publicAppId, "loginRequestDto.publicAppId");
        validateNotBlank(loginRequestDto.email, "loginRequestDto.email");

        const app = await this.appService.getByPublicId(loginRequestDto.publicAppId);
        if (app === null || !app.enabled) {
            throw new IllegalStateError("No enabled app with this ID could be found");
        }

        const profile = await this.profileService.getOrCreate(app, loginRequestDto.email);

        const profileAuthToken = await this.profileAuthTokenService.createForProfile(profile.id);

        await this.emailService.send(loginRequestDto.email, this.getReadableTokenString(profileAuthToken.authToken));

        return profileAuthToken.publicId;
    }

    public async redeemAuthToken(redeemTokenDto: RedeemAuthTokenRequestDto): Promise<ProfileDao> {
        validateNotNull(redeemTokenDto, "redeemTokenDto");
        validateNotBlank(redeemTokenDto.authTokenId, "redeemTokenDto.authTokenId");
        validateNotBlank(redeemTokenDto.authTokenValue, "redeemTokenDto.authTokenValue");

        const profileId = await this.profileAuthTokenService.redeemAuthTokenForProfileId(redeemTokenDto.authTokenId, redeemTokenDto.authTokenValue);
        if (isNotDefined(profileId)) {
            throw new IllegalStateError("No profile ID found for auth token");
        }

        const profile = await this.profileService.getById(profileId);
        if (profile === null) {
            throw new IllegalStateError("No profile found for auth token");
        }

        return profile;
    }

    private getReadableTokenString(token: string): string {
        return [token.substring(0, 4), token.substring(4)].join("-")
    }

    public createSignedAccessToken(subject: string, scopes: Set<Scope>): string {
        const accessToken = this.issueAccessToken(subject, scopes);
        return this.signToken(accessToken.convertToJwt());
    }

    public createSignedRefreshToken(subject: string, scopes: Set<Scope>): string {
        const refreshToken = this.issueRefreshToken(subject, scopes);
        return this.signToken(refreshToken.convertToJwt());
    }

    public validateAndRenewRefreshToken(oldRefreshToken: string): TokenResponseDto {
        const parsedToken = parseJwt(oldRefreshToken);

        const type = parsedToken["type"] as string;
        validateNotBlank(type, "type");
        if (type !== AuthService.TOKEN_TYPE_REFRESH) {
            throw new Error("Invalid token type");
        }

        const issuer = parsedToken["iss"] as string;
        validateNotBlank(issuer, "issuer");
        if (issuer !== this.tokenConfig.issuer) {
            throw new Error("Invalid token issuer");
        }

        const audience = parsedToken["aud"] as string;
        validateNotBlank(audience, "audience");
        if (audience !== this.tokenConfig.audience) {
            throw new Error("Invalid token audience");
        }

        const expiresAt = parsedToken["exp"] as number;
        validateNotNull(expiresAt, "expiresAt");
        if (this.timeSource.getDateFromUnixTimestamp(expiresAt) < this.timeSource.getNow()) {
            throw new Error(`Refresh token has already expired`);
        }

        const userId = parsedToken["sub"] as string;
        validateNotBlank(userId, "userId");

        const scopes = parsedToken["scp"] as Set<Scope>;
        validateNotEmpty(scopes, "scopes");

        return {
            accessToken: this.createSignedAccessToken(userId, scopes),
            refreshToken: this.createSignedRefreshToken(userId, scopes),
        }
    }
    
    private issueAccessToken(subject: string, scopes: Set<Scope>): AuthToken {
        const now = this.timeSource.getCurrentUnixTimestamp();
        const expiresAt = now + this.tokenConfig.accessTokenValiditySeconds;

        return AuthToken.Builder
            .withTokenType(AuthService.TOKEN_TYPE_ACCESS)
            .withIssuer(this.tokenConfig.issuer)
            .withAudience(this.tokenConfig.audience)
            .withSubject(subject)
            .withScopes(scopes)
            .withIssuedAt(now)
            .withNotBefore(now)
            .withExpiresAt(expiresAt)
            .build();
    }

    private issueRefreshToken(subject: string, scopes: Set<string>): AuthToken {
        const now = this.timeSource.getCurrentUnixTimestamp();
        const expiresAt = now + this.tokenConfig.refreshTokenValiditySeconds;

        return AuthToken.Builder
            .withTokenType(AuthService.TOKEN_TYPE_REFRESH)
            .withIssuer(this.tokenConfig.issuer)
            .withAudience(this.tokenConfig.audience)
            .withSubject(subject)
            .withScopes(scopes)
            .withIssuedAt(now)
            .withNotBefore(now)
            .withExpiresAt(expiresAt)
            .build();
    }
    
    private signToken(token: Jwt): string {
        return jwt.sign(token, this.tokenConfig.signingKey);
    }

    private validateConfig(): void {
        validateNotNull(this.tokenConfig.accessTokenValiditySeconds, "tokenConfig.accessTokenValiditySeconds");
        validateNotNull(this.tokenConfig.refreshTokenValiditySeconds, "tokenConfig.refreshTokenValiditySeconds");
        validateNotBlank(this.tokenConfig.issuer, "tokenConfig.issuer");
        validateNotBlank(this.tokenConfig.audience, "tokenConfig.audience");
        validateNotBlank(this.tokenConfig.signingKey, "tokenConfig.signingKey");
    }

}