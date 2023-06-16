import { IsNotEmpty } from "class-validator";

export class ChangeRoleInfoDto {
    @IsNotEmpty()
    userId: number

    @IsNotEmpty()
    roleId: number

    @IsNotEmpty()
    changeId: number

    @IsNotEmpty()
    roomId: number
}


