import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class AuthDto {
  // @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  // @IsNotEmpty()
  image: string;
  // @IsString()
  // @IsNotEmpty()
  auth: boolean;
  // @IsString()
  // @IsNotEmpty()
  token: string;
}
