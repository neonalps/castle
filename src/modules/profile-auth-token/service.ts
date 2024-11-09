import { ProfileAuthTokenDao } from "@src/models/internal/dao/profile-auth-token";
import { CreateProfileAuthTokenDto } from "@src/models/internal/dto/create-profile-auth-token";
import { ProfileAuthTokenMapper } from "@src/modules/profile-auth-token/mapper";
import { requireNonNull } from "@src/util/common";
import { TimeSource } from "@src/util/date";
import { UuidSource } from "@src/util/uuid";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { IllegalStateError } from "@src/api/error/illegal-state-error";
import { RandomSource } from "@src/util/random";

export interface ProfileAuthTokenConfig {
    tokenLength: number;
    validitySeconds: number;
}

export class ProfileAuthTokenService {

    private static AUTH_TOKEN_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private readonly config: ProfileAuthTokenConfig;
    private readonly mapper: ProfileAuthTokenMapper;
    private readonly randomSource: RandomSource;
    private readonly timeSource: TimeSource;
    private readonly uuidSource: UuidSource;

    constructor(
        config: ProfileAuthTokenConfig,
        mapper: ProfileAuthTokenMapper,
        randomSource: RandomSource,
        timeSource: TimeSource,
        uuidSource: UuidSource,
    ) {
        this.config = requireNonNull(config);
        this.mapper = requireNonNull(mapper);
        this.randomSource = requireNonNull(randomSource);
        this.timeSource = requireNonNull(timeSource);
        this.uuidSource = requireNonNull(uuidSource);
    }

    public getByPublicId(publicId: string): Promise<ProfileAuthTokenDao | null> {
        validateNotBlank(publicId, "publicId");

        return this.mapper.getByPublicId(publicId);
    }

    public async createForProfile(profileId: number): Promise<ProfileAuthTokenDao> {
        validateNotNull(profileId, "profileId");

        const issuedAt = this.timeSource.getNow();
        const expiresAt = this.timeSource.addSeconds(issuedAt, this.config.validitySeconds);

        const createDto = CreateProfileAuthTokenDto.Builder
            .withPublicId(this.uuidSource.getRandomUuid())
            .withProfileId(profileId)
            .withAuthToken(this.randomSource.createRandomString(ProfileAuthTokenService.AUTH_TOKEN_CHARACTERS, this.config.tokenLength))
            .withAuthTokenIssuedAt(issuedAt)
            .withAuthTokenExpiresAt(expiresAt)
            .build();

        const createdAuthTokenId = await this.mapper.create(createDto);

        const createdAuthToken = await this.mapper.getById(createdAuthTokenId);
        if (createdAuthToken === null) {
            throw new IllegalStateError("Failed to create auth token");
        }

        return createdAuthToken;
    }

    public async redeemAuthTokenForProfileId(publicAuthTokenId: string, authTokenValue: string): Promise<number> {
        validateNotBlank(publicAuthTokenId, "publicAuthTokenId");
        validateNotBlank(authTokenValue, "authTokenValue");

        const authToken = await this.getByPublicId(publicAuthTokenId);
        if (authToken === null) {
            throw new IllegalStateError("No auth token with this ID was found");
        }

        if (this.timeSource.getNow() > authToken.authTokenExpiresAt) {
            throw new IllegalStateError("Auth token already expired");
        }

        if (authToken.authToken !== authTokenValue) {
            await this.delete(authToken.id);
            throw new IllegalStateError("Incorrect auth token value");
        }

        return authToken.profileId;
    }

    public delete(id: number): Promise<void> {
        validateNotNull(id, "id");

        return this.mapper.delete(id);
    }

}