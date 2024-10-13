export class CreateProfileDto {
    private _publicId!: string;
    private _appId!: number;
    private _hashedEmail!: string;
    private _encryptedLocalKey!: string;
 
    constructor(builder: CreateProfileDtoBuilder) {
       this._publicId = builder.publicId;
       this._appId = builder.appId;
       this._hashedEmail = builder.hashedEmail;
       this._encryptedLocalKey = builder.encryptedLocalKey;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get appId(): number {
       return this._appId;
    }
 
    public get hashedEmail(): string {
       return this._hashedEmail;
    }
 
    public get encryptedLocalKey(): string {
       return this._encryptedLocalKey;
    }
 
    public static get Builder(): CreateProfileDtoBuilder {
       return new CreateProfileDtoBuilder();
    }
 }
 
 class CreateProfileDtoBuilder {
    private _publicId!: string;
    private _appId!: number;
    private _hashedEmail!: string;
    private _encryptedLocalKey!: string;
 
    public withPublicId(publicId: string): CreateProfileDtoBuilder {
       this._publicId = publicId;
       return this;
    }
 
    public withAppId(appId: number): CreateProfileDtoBuilder {
       this._appId = appId;
       return this;
    }
 
    public withHashedEmail(hashedEmail: string): CreateProfileDtoBuilder {
       this._hashedEmail = hashedEmail;
       return this;
    }
 
    public withEncryptedLocalKey(encryptedLocalKey: string): CreateProfileDtoBuilder {
       this._encryptedLocalKey = encryptedLocalKey;
       return this;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get appId(): number {
       return this._appId;
    }
 
    public get hashedEmail(): string {
       return this._hashedEmail;
    }
 
    public get encryptedLocalKey(): string {
       return this._encryptedLocalKey;
    }
 
    build(): CreateProfileDto {
       return new CreateProfileDto(this);
    }
 }