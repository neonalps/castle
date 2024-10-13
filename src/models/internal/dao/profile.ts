import { ProfileDaoInterface } from "@src/models/internal/interface/profile";

export class ProfileDao {
    private _id!: number;
    private _publicId!: string;
    private _appId!: number;
    private _hashedEmail!: string;
    private _encryptedLocalKey!: string;
    private _createdAt!: Date;
 
    constructor(builder: ProfileDaoBuilder) {
       this._id = builder.id;
       this._publicId = builder.publicId;
       this._appId = builder.appId;
       this._hashedEmail = builder.hashedEmail;
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
 
    public get hashedEmail(): string {
       return this._hashedEmail;
    }
 
    public get encryptedLocalKey(): string {
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
            .withHashedEmail(item.hashedEmail)
            .withEncryptedLocalKey(item.encryptedLocalKey)
            .withCreatedAt(item.createdAt)
            .build();
    }
 }
 
 class ProfileDaoBuilder {
    private _id!: number;
    private _publicId!: string;
    private _appId!: number;
    private _hashedEmail!: string;
    private _encryptedLocalKey!: string;
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
 
    public withHashedEmail(hashedEmail: string): ProfileDaoBuilder {
       this._hashedEmail = hashedEmail;
       return this;
    }
 
    public withEncryptedLocalKey(encryptedLocalKey: string): ProfileDaoBuilder {
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
 
    public get hashedEmail(): string {
       return this._hashedEmail;
    }
 
    public get encryptedLocalKey(): string {
       return this._encryptedLocalKey;
    }
 
    public get createdAt(): Date {
       return this._createdAt;
    }
 
    build(): ProfileDao {
       return new ProfileDao(this);
    }
 }