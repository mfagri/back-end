import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class AuthDto {
  // @IsEmail()
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

  code: string;
}
