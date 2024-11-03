import { requireNonNull } from "@src/util/common";
import { ProfileMapper } from "./mapper";
import { CreateProfileDto } from "@src/models/internal/dto/create-profile";
import { ProfileDao } from "@src/models/internal/dao/profile";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { IllegalStateError } from "@src/api/error/illegal-state-error";
import { AppDao } from "@src/models/internal/dao/app";
import { CryptoService } from "@src/modules/crypto/service";
import { UuidSource } from "@src/util/uuid";

export class ProfileService {

    private readonly cryptoService: CryptoService;
    private readonly mapper: ProfileMapper;
    private readonly uuidSource: UuidSource;

    constructor(cryptoService: CryptoService, mapper: ProfileMapper, uuidSource: UuidSource) {
        this.cryptoService = requireNonNull(cryptoService);
        this.mapper = requireNonNull(mapper);
        this.uuidSource = requireNonNull(uuidSource);
    }

    public async create(dto: CreateProfileDto): Promise<ProfileDao> {
        validateNotNull(dto, "dto");

        const profileId = await this.mapper.create(dto);

        const profile = await this.mapper.getById(profileId);
        if (!profile) {
            throw new IllegalStateError("Failed to create profile");
        }

        return profile;
    }

    public getById(id: number): Promise<ProfileDao | null> {
        validateNotNull(id, "id");

        return this.mapper.getById(id);
    }

    public getByPublicId(publicId: string): Promise<ProfileDao | null> {
        validateNotBlank(publicId, "publicId");

        return this.mapper.getByPublicId(publicId);
    }

    public async getOrCreate(app: AppDao, email: string): Promise<ProfileDao> {
        const login = [email, app.publicId].join(":");
        const loginHash = this.cryptoService.hash(login);

        const profile = await this.mapper.getByHashedLogin(loginHash);
        if (profile !== null) {
            return profile;
        }

        const createDto = CreateProfileDto.Builder
            .withPublicId(this.uuidSource.getRandomUuid())
            .withAppId(app.id)
            .withHashedLogin(loginHash)
            .build();

        return this.create(createDto);
    }

}