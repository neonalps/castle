import { requireNonNull } from "@src/util/common";
import { ProfileMapper } from "./mapper";
import { CreateProfileDto } from "@src/models/internal/dto/create-profile";
import { ProfileDao } from "@src/models/internal/dao/profile";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { IllegalStateError } from "@src/api/error/illegal-state-error";

export class ProfileService {

    private readonly mapper: ProfileMapper;

    constructor(mapper: ProfileMapper) {
        this.mapper = requireNonNull(mapper);
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

}