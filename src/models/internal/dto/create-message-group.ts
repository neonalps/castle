export class CreateMessageGroupDto {
    private _publicId!: string;
    private _profileId!: number | null;
 
    constructor(builder: CreateMessageGroupDtoBuilder) {
       this._publicId = builder.publicId;
       this._profileId = builder.profileId;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get profileId(): number | null {
       return this._profileId;
    }
 
    public static get Builder(): CreateMessageGroupDtoBuilder {
       return new CreateMessageGroupDtoBuilder();
    }
 }
 
 class CreateMessageGroupDtoBuilder {
    private _publicId!: string;
    private _profileId!: number | null;
 
    public withPublicId(publicId: string): CreateMessageGroupDtoBuilder {
       this._publicId = publicId;
       return this;
    }
 
    public withProfileId(profileId: number | null): CreateMessageGroupDtoBuilder {
       this._profileId = profileId;
       return this;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get profileId(): number | null {
       return this._profileId;
    }
 
    build(): CreateMessageGroupDto {
       return new CreateMessageGroupDto(this);
    }
 }