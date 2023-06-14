import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class createMessageDto {
    @IsNotEmpty()
    messageContent: string

    // @IsNumber()
    userId: number
    
    // @IsNumber()
    roomId: number
}