import { IllegalStateError } from "@src/api/error/illegal-state-error";
import { AppDao } from "@src/models/internal/dao/app";
import { CreateAppDto } from "@src/models/internal/dto/create-app";
import { AppMapper } from "@src/modules/app/mapper";
import { requireNonNull } from "@src/util/common";
import { validateNotBlank, validateNotNull } from "@src/util/validation";

export class AppService {

    private readonly mapper: AppMapper;
    
    constructor(mapper: AppMapper) {
        this.mapper = requireNonNull(mapper);
    }

    public async create(dto: CreateAppDto): Promise<AppDao> {
        validateNotNull(dto, "dto");

        const appId = await this.mapper.create(dto);

        const app = await this.mapper.getById(appId);
        if (!app) {
            throw new IllegalStateError("Failed to create app");
        }

        return app;
    }

    public getById(id: number): Promise<AppDao | null> {
        validateNotNull(id, "id");

        return this.mapper.getById(id);
    }

    public getByPublicId(publicId: string): Promise<AppDao | null> {
        validateNotBlank(publicId, "publicId");

        return this.mapper.getByPublicId(publicId);
    }

}