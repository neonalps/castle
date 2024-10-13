import { AppDaoInterface } from "../interface/app";

export class AppDao {
    private _id!: number;
    private _publicId!: string;
    private _name!: string;
    private _baseUrl!: string;
    private _messageGroupId!: number;
    private _enabled!: boolean;
    private _createdAt!: Date;
 
    constructor(builder: AppDaoBuilder) {
       this._id = builder.id;
       this._publicId = builder.publicId;
       this._name = builder.name;
       this._baseUrl = builder.baseUrl;
       this._messageGroupId = builder.messageGroupId;
       this._enabled = builder.enabled;
       this._createdAt = builder.createdAt;
    }
 
    public get id(): number {
       return this._id;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get name(): string {
       return this._name;
    }
 
    public get baseUrl(): string {
       return this._baseUrl;
    }

    public get messageGroupId(): number {
      return this._messageGroupId;
    }
 
    public get enabled(): boolean {
       return this._enabled;
    }
 
    public get createdAt(): Date {
       return this._createdAt;
    }
 
    public static get Builder(): AppDaoBuilder {
       return new AppDaoBuilder();
    }

    public static fromDaoInterface(item: AppDaoInterface): AppDao {
        return this.Builder
            .withId(item.id)
            .withPublicId(item.publicId)
            .withName(item.name)
            .withBaseUrl(item.baseUrl)
            .withMessageGroupId(item.messageGroupId)
            .withEnabled(item.enabled)
            .withCreatedAt(item.createdAt)
            .build();
    }
 }
 
 class AppDaoBuilder {
    private _id!: number;
    private _publicId!: string;
    private _name!: string;
    private _baseUrl!: string;
    private _messageGroupId!: number;
    private _enabled!: boolean;
    private _createdAt!: Date;
 
    public withId(id: number): AppDaoBuilder {
       this._id = id;
       return this;
    }
 
    public withPublicId(publicId: string): AppDaoBuilder {
       this._publicId = publicId;
       return this;
    }
 
    public withName(name: string): AppDaoBuilder {
       this._name = name;
       return this;
    }
 
    public withBaseUrl(baseUrl: string): AppDaoBuilder {
       this._baseUrl = baseUrl;
       return this;
    }

    public withMessageGroupId(messageGroupId: number): AppDaoBuilder {
      this._messageGroupId = messageGroupId;
      return this;
    }
 
    public withEnabled(enabled: boolean): AppDaoBuilder {
       this._enabled = enabled;
       return this;
    }
 
    public withCreatedAt(createdAt: Date): AppDaoBuilder {
       this._createdAt = createdAt;
       return this;
    }
 
    public get id(): number {
       return this._id;
    }
 
    public get publicId(): string {
       return this._publicId;
    }
 
    public get name(): string {
       return this._name;
    }
 
    public get baseUrl(): string {
       return this._baseUrl;
    }

    public get messageGroupId(): number {
      return this._messageGroupId;
    }
 
    public get enabled(): boolean {
       return this._enabled;
    }
 
    public get createdAt(): Date {
       return this._createdAt;
    }
 
    build(): AppDao {
       return new AppDao(this);
    }
 }