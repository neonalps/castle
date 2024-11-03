export class CreateProfileDto {
    private _publicId!: string;
    private _appId!: number;
    private _hashedLogin!: string;
 
    constructor(builder: CreateProfileDtoBuilder) {
       this._publicId = builder.publicId;
       this._appId = builder.appId;
       this._hashedLogin = builder.hashedLogin;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get appId(): number {
       return this._appId;
    }
 
    public get hashedLogin(): string {
       return this._hashedLogin;
    }
 
    public static get Builder(): CreateProfileDtoBuilder {
       return new CreateProfileDtoBuilder();
    }
 }
 
 class CreateProfileDtoBuilder {
    private _publicId!: string;
    private _appId!: number;
    private _hashedLogin!: string;
 
    public withPublicId(publicId: string): CreateProfileDtoBuilder {
       this._publicId = publicId;
       return this;
    }
 
    public withAppId(appId: number): CreateProfileDtoBuilder {
       this._appId = appId;
       return this;
    }
 
    public withHashedLogin(hashedLogin: string): CreateProfileDtoBuilder {
       this._hashedLogin = hashedLogin;
       return this;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get appId(): number {
       return this._appId;
    }
 
    public get hashedLogin(): string {
       return this._hashedLogin;
    }
 
    build(): CreateProfileDto {
       return new CreateProfileDto(this);
    }
 }