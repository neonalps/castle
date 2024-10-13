export interface ProfileDaoInterface {
    id: number;
    publicId: string;
    appId: number;
    hashedEmail: string;
    encryptedLocalKey: string;
    createdAt: Date;
}