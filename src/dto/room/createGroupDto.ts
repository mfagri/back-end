import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class createGroupDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number
    
    @IsNotEmpty()
    groupName: string

    @IsOptional()
    @IsNotEmpty()
    roomPicture: string
}