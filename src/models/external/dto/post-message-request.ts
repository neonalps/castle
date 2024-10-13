import { CreateMessageDto } from "@src/models/internal/dto/create-message";

export interface PostMessageRequestDto {
    merkle?: string;
    messages: CreateMessageDto[];
}