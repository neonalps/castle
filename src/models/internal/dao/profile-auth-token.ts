import { ProfileAuthTokenDaoInterface } from "@src/models/internal/interface/profile-auth-token";

export class ProfileAuthTokenDao {
    private _id!: number;
    private _publicId!: string;
    private _profileId!: number;
    private _authToken!: string;
    private _authTokenIssuedAt!: Date;
    private _authTokenExpiresAt!: Date;
 
    constructor(builder: ProfileAuthTokenDaoBuilder) {
       this._id = builder.id;
       this._publicId = builder.publicId;
       this._profileId = builder.profileId;
       this._authToken = builder.authToken;
       this._authTokenIssuedAt = builder.authTokenIssuedAt;
       this._authTokenExpiresAt = builder.authTokenExpiresAt;
    }
 
    public get id(): number {
       return this._id;
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

    public static fromDaoInterface(item: ProfileAuthTokenDaoInterface): ProfileAuthTokenDao {
        return this.Builder
            .withId(item.id)
            .withPublicId(item.publicId)
            .withProfileId(item.profileId)
            .withAuthToken(item.authToken)
            .withAuthTokenIssuedAt(item.authTokenIssuedAt)
            .withAuthTokenExpiresAt(item.authTokenExpiresAt)
            .build();
    }
 
    public static get Builder(): ProfileAuthTokenDaoBuilder {
       return new ProfileAuthTokenDaoBuilder();
    }
 }
 
 class ProfileAuthTokenDaoBuilder {
    private _id!: number;
    private _publicId!: string;
    private _profileId!: number;
    private _authToken!: string;
    private _authTokenIssuedAt!: Date;
    private _authTokenExpiresAt!: Date;
 
    public withId(id: number): ProfileAuthTokenDaoBuilder {
       this._id = id;
       return this;
    }
 
    public withPublicId(publicId: string): ProfileAuthTokenDaoBuilder {
       this._publicId = publicId;
       return this;
    }
 
    public withProfileId(profileId: number): ProfileAuthTokenDaoBuilder {
       this._profileId = profileId;
       return this;
    }
 
    public withAuthToken(authToken: string): ProfileAuthTokenDaoBuilder {
       this._authToken = authToken;
       return this;
    }
 
    public withAuthTokenIssuedAt(authTokenIssuedAt: Date): ProfileAuthTokenDaoBuilder {
       this._authTokenIssuedAt = authTokenIssuedAt;
       return this;
    }
 
    public withAuthTokenExpiresAt(authTokenExpiresAt: Date): ProfileAuthTokenDaoBuilder {
       this._authTokenExpiresAt = authTokenExpiresAt;
       return this;
    }
 
    public get id(): number {
       return this._id;
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
 
    build(): ProfileAuthTokenDao {
       return new ProfileAuthTokenDao(this);
    }
 }