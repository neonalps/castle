export class CreateProfileAuthTokenDto {
    private _publicId!: string;
    private _profileId!: number;
    private _authToken!: string;
    private _authTokenIssuedAt!: Date;
    private _authTokenExpiresAt!: Date;
 
    constructor(builder: CreateProfileAuthTokenDtoBuilder) {
       this._publicId = builder.publicId;
       this._profileId = builder.profileId;
       this._authToken = builder.authToken;
       this._authTokenIssuedAt = builder.authTokenIssuedAt;
       this._authTokenExpiresAt = builder.authTokenExpiresAt;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get profileId(): number {
       return this._profileId;
    }
 
    public get authToken(): string {
       return this._authToken;
    }
 
    public get authTokenIssuedAt(): Date {
       return this._authTokenIssuedAt;
    }
 
    public get authTokenExpiresAt(): Date {
       return this._authTokenExpiresAt;
    }
 
    public static get Builder(): CreateProfileAuthTokenDtoBuilder {
       return new CreateProfileAuthTokenDtoBuilder();
    }
 }
 
 class CreateProfileAuthTokenDtoBuilder {
    private _publicId!: string;
    private _profileId!: number;
    private _authToken!: string;
    private _authTokenIssuedAt!: Date;
    private _authTokenExpiresAt!: Date;
 
    public withPublicId(publicId: string): CreateProfileAuthTokenDtoBuilder {
       this._publicId = publicId;
       return this;
    }
 
    public withProfileId(profileId: number): CreateProfileAuthTokenDtoBuilder {
       this._profileId = profileId;
       return this;
    }
 
    public withAuthToken(authToken: string): CreateProfileAuthTokenDtoBuilder {
       this._authToken = authToken;
       return this;
    }
 
    public withAuthTokenIssuedAt(authTokenIssuedAt: Date): CreateProfileAuthTokenDtoBuilder {
       this._authTokenIssuedAt = authTokenIssuedAt;
       return this;
    }
 
    public withAuthTokenExpiresAt(authTokenExpiresAt: Date): CreateProfileAuthTokenDtoBuilder {
       this._authTokenExpiresAt = authTokenExpiresAt;
       return this;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get profileId(): number {
       return this._profileId;
    }
 
    public get authToken(): string {
       return this._authToken;
    }
 
    public get authTokenIssuedAt(): Date {
       return this._authTokenIssuedAt;
    }
 
    public get authTokenExpiresAt(): Date {
       return this._authTokenExpiresAt;
    }
 
    build(): CreateProfileAuthTokenDto {
       return new CreateProfileAuthTokenDto(this);
    }
 }