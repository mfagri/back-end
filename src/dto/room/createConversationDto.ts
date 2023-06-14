import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class createConversationDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number
    
    @IsNumber()
    @IsNotEmpty()
    joinWithId: number
}