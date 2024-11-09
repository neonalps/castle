export interface ProfileDaoInterface {
    id: number;
    publicId: string;
    appId: number;
    hashedLogin: string;
    encryptedLocalKey: string | null;
    createdAt: Date;
}