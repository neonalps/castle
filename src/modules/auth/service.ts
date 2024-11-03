import { ProfileLoginRequestDto } from "@src/models/external/dto/profile-login-request";
import { ProfileAuthTokenService } from "@src/modules/profile-auth-token/service";
import { requireNonNull } from "@src/util/common";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { AppService } from "@src/modules/app/service";
import { IllegalStateError } from "@src/api/error/illegal-state-error";
import { ProfileService } from "@src/modules/profile/service";
import { EmailService } from "@src/modules/email/service";

export class AuthService {

    private readonly appService: AppService;
    private readonly emailService: EmailService;
    private readonly profileService: ProfileService;
    private readonly profileAuthTokenService: ProfileAuthTokenService;

    constructor(
        appService: AppService, 
        emailService: EmailService,
        profileService: ProfileService, 
        profileAuthTokenService: ProfileAuthTokenService
    ) {
        this.appService = requireNonNull(appService);
        this.emailService = requireNonNull(emailService);
        this.profileService = requireNonNull(profileService);
        this.profileAuthTokenService = requireNonNull(profileAuthTokenService);
    }

    public async handleProfileLogin(loginRequestDto: ProfileLoginRequestDto): Promise<string> {
        validateNotNull(loginRequestDto.publicAppId, "loginRequestDto.publicAppId");
        validateNotBlank(loginRequestDto.email, "loginRequestDto.email");

        const app = await this.appService.getByPublicId(loginRequestDto.publicAppId);
        if (app === null || !app.enabled) {
            throw new IllegalStateError("No enabled app with this ID could be found");
        }

        const profile = await this.profileService.getOrCreate(app, loginRequestDto.email);

        const profileAuthToken = await this.profileAuthTokenService.createForProfile(profile.id);

        const readableString = [
            profileAuthToken.authToken.substring(0, 3),
            profileAuthToken.authToken.substring(4, 7),
        ].join("-");
        await this.emailService.send(loginRequestDto.email, readableString);

        return profileAuthToken.publicId;
    }

}