export class MessageDao {
    private _timestamp!: string;
    private _messageGroupId!: number;
    private _content!: string;
    private _isEncrypted!: boolean;
 
    constructor(builder: MessageDaoBuilder) {
       this._timestamp = builder.timestamp;
       this._messageGroupId = builder.messageGroupId;
       this._content = builder.content;
       this._isEncrypted = builder.isEncrypted;
    }
 
    public get timestamp(): string {
       return this._timestamp;
    }
 
    public get messageGroupId(): number {
       return this._messageGroupId;
    }
 
    public get content(): string {
       return this._content;
    }
 
    public get isEncrypted(): boolean {
       return this._isEncrypted;
    }
 
    public static get Builder(): MessageDaoBuilder {
       return new MessageDaoBuilder();
    }
 }
 
 class MessageDaoBuilder {
    private _timestamp!: string;
    private _messageGroupId!: number;
    private _content!: string;
    private _isEncrypted!: boolean;
 
    public withTimestamp(timestamp: string): MessageDaoBuilder {
       this._timestamp = timestamp;
       return this;
    }
 
    public withMessageGroupId(messageGroupId: number): MessageDaoBuilder {
       this._messageGroupId = messageGroupId;
       return this;
    }
 
    public withContent(content: string): MessageDaoBuilder {
       this._content = content;
       return this;
    }
 
    public withIsEncrypted(isEncrypted: boolean): MessageDaoBuilder {
       this._isEncrypted = isEncrypted;
       return this;
    }
 
    public get timestamp(): string {
       return this._timestamp;
    }
 
    public get messageGroupId(): number {
       return this._messageGroupId;
    }
 
    public get content(): string {
       return this._content;
    }
 
    public get isEncrypted(): boolean {
       return this._isEncrypted;
    }
 
    build(): MessageDao {
       return new MessageDao(this);
    }
 }