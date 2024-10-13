import { TrieNode } from "@src/crdt/merkle";
import { CreateMessageDto } from "@src/models/internal/dto/create-message";

export class PerformSyncDto {
    private _clientId!: string;
    private _messages!: Set<CreateMessageDto>;
    private _clientMerkle!: TrieNode;
 
    constructor(builder: PerformSyncDtoBuilder) {
       this._clientId = builder.clientId;
       this._messages = new Set(builder.messages);
       this._clientMerkle = builder.clientMerkle;
    }
 
    public get clientId(): string {
       return this._clientId;
    }
 
    public get messages(): Set<CreateMessageDto> {
       return new Set(this._messages);
    }
 
    public get clientMerkle(): TrieNode {
       return this._clientMerkle;
    }
 
    public static get Builder(): PerformSyncDtoBuilder {
       return new PerformSyncDtoBuilder();
    }
 }
 
 class PerformSyncDtoBuilder {
    private _clientId!: string;
    private _messages!: Set<CreateMessageDto>;
    private _clientMerkle!: TrieNode;
 
    public withClientId(clientId: string): PerformSyncDtoBuilder {
       this._clientId = clientId;
       return this;
    }
 
    public withMessages(messages: Set<CreateMessageDto>): PerformSyncDtoBuilder {
       this._messages = new Set(messages);
       return this;
    }
 
    public withClientMerkle(clientMerkle: TrieNode): PerformSyncDtoBuilder {
       this._clientMerkle = clientMerkle;
       return this;
    }
 
    public get clientId(): string {
       return this._clientId;
    }
 
    public get messages(): Set<CreateMessageDto> {
       return new Set(this._messages);
    }
 
    public get clientMerkle(): TrieNode {
       return this._clientMerkle;
    }
 
    build(): PerformSyncDto {
       return new PerformSyncDto(this);
    }
 }