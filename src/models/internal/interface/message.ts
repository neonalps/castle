export interface MessageDaoInterface {
    timestamp: string;
    messageGroupId: number;
    content: string;
    isEncrypted: boolean;
}