import { ProfileDaoInterface } from "@src/models/internal/interface/profile";

export class ProfileDao {
    private _id!: number;
    private _publicId!: string;
    private _appId!: number;
    private _hashedLogin!: string;
    private _encryptedLocalKey!: string | null;
    private _createdAt!: Date;
 
    constructor(builder: ProfileDaoBuilder) {
       this._id = builder.id;
       this._publicId = builder.publicId;
       this._appId = builder.appId;
       this._hashedLogin = builder.hashedLogin;
       this._encryptedLocalKey = builder.encryptedLocalKey;
       this._createdAt = builder.createdAt;
    }
 
    public get id(): number {
       return this._id;
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
 
    public get encryptedLocalKey(): string | null {
       return this._encryptedLocalKey;
    }
 
    public get createdAt(): Date {
       return this._createdAt;
    }
 
    public static get Builder(): ProfileDaoBuilder {
       return new ProfileDaoBuilder();
    }

    public static fromDaoInterface(item: ProfileDaoInterface): ProfileDao {
        return this.Builder
            .withId(item.id)
            .withPublicId(item.publicId)
            .withAppId(item.appId)
            .withHashedLogin(item.hashedLogin)
            .withEncryptedLocalKey(item.encryptedLocalKey)
            .withCreatedAt(item.createdAt)
            .build();
    }
 }
 
 class ProfileDaoBuilder {
    private _id!: number;
    private _publicId!: string;
    private _appId!: number;
    private _hashedLogin!: string;
    private _encryptedLocalKey!: string | null;
    private _createdAt!: Date;
 
    public withId(id: number): ProfileDaoBuilder {
       this._id = id;
       return this;
    }
 
    public withPublicId(publicId: string): ProfileDaoBuilder {
       this._publicId = publicId;
       return this;
    }
 
    public withAppId(appId: number): ProfileDaoBuilder {
       this._appId = appId;
       return this;
    }
 
    public withHashedLogin(hashedLogin: string): ProfileDaoBuilder {
       this._hashedLogin = hashedLogin;
       return this;
    }
 
    public withEncryptedLocalKey(encryptedLocalKey: string | null): ProfileDaoBuilder {
       this._encryptedLocalKey = encryptedLocalKey;
       return this;
    }
 
    public withCreatedAt(createdAt: Date): ProfileDaoBuilder {
       this._createdAt = createdAt;
       return this;
    }
 
    public get id(): number {
       return this._id;
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
 
    public get encryptedLocalKey(): string | null {
       return this._encryptedLocalKey;
    }
 
    public get createdAt(): Date {
       return this._createdAt;
    }
 
    build(): ProfileDao {
       return new ProfileDao(this);
    }
 }