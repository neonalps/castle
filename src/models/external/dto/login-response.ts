import { TokenResponseDto } from "@src/models/external/dto/token-response";

export interface LoginResponseDto {
    identity: {
        publicId: string;
        encryptedLocalKey: string | null;
    };
    token: TokenResponseDto;
}