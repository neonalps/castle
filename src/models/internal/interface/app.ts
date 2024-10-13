export interface AppDaoInterface {
    id: number;
    publicId: string;
    name: string;
    baseUrl: string;
    messageGroupId: number;
    enabled: boolean;
    createdAt: Date;
}