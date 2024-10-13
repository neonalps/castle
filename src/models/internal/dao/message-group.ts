import { MessageGroupDaoInterface } from "@src/models/internal/interface/message-group";

export class MessageGroupDao {
    private _id!: number;
    private _profileId!: number;
 
    constructor(builder: MessageGroupDaoBuilder) {
       this._id = builder.id;
       this._profileId = builder.profileId;
    }
 
    public get id(): number {
       return this._id;
    }
 
    public get profileId(): number {
       return this._profileId;
    }
 
    public static get Builder(): MessageGroupDaoBuilder {
       return new MessageGroupDaoBuilder();
    }

    public static fromDaoInterface(item: MessageGroupDaoInterface): MessageGroupDao {
        return this.Builder
            .withId(item.id)
            .withProfileId(item.profileId)
            .build();
    }
 }
 
 class MessageGroupDaoBuilder {
    private _id!: number;
    private _profileId!: number;
 
    public withId(id: number): MessageGroupDaoBuilder {
       this._id = id;
       return this;
    }
 
    public withProfileId(profileId: number): MessageGroupDaoBuilder {
       this._profileId = profileId;
       return this;
    }
 
    public get id(): number {
       return this._id;
    }
 
    public get profileId(): number {
       return this._profileId;
    }
 
    build(): MessageGroupDao {
       return new MessageGroupDao(this);
    }
 }