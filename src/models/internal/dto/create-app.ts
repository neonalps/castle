export class CreateAppDto {
    private _publicId!: string;
    private _name!: string;
    private _baseUrl!: string;
    private _enabled!: boolean;
 
    constructor(builder: CreateAppDtoBuilder) {
       this._publicId = builder.publicId;
       this._name = builder.name;
       this._baseUrl = builder.baseUrl;
       this._enabled = builder.enabled;
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
 
    public get enabled(): boolean {
       return this._enabled;
    }
 
    public static get Builder(): CreateAppDtoBuilder {
       return new CreateAppDtoBuilder();
    }
 }
 
 class CreateAppDtoBuilder {
    private _publicId!: string;
    private _name!: string;
    private _baseUrl!: string;
    private _enabled!: boolean;
 
    public withPublicId(publicId: string): CreateAppDtoBuilder {
       this._publicId = publicId;
       return this;
    }
 
    public withName(name: string): CreateAppDtoBuilder {
       this._name = name;
       return this;
    }
 
    public withBaseUrl(baseUrl: string): CreateAppDtoBuilder {
       this._baseUrl = baseUrl;
       return this;
    }
 
    public withEnabled(enabled: boolean): CreateAppDtoBuilder {
       this._enabled = enabled;
       return this;
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
 
    public get enabled(): boolean {
       return this._enabled;
    }
 
    build(): CreateAppDto {
       return new CreateAppDto(this);
    }
 }