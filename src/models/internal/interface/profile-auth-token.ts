export interface ProfileAuthTokenDaoInterface {
    id: number;
    publicId: string;
    profileId: number;
    authToken: string;
    authTokenIssuedAt: Date;
    authTokenExpiresAt: Date;
}