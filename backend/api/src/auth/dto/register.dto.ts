import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email!:string;

    @IsString()
    @IsNotEmpty()
    fullname!:string;

    @IsString()
    @IsNotEmpty()
    matric_id!:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message: 'Password must contain a letter, a number and a special character',
  })
    password!:string

    @IsString()
    @IsNotEmpty()
    level!:string;

    @IsString()
    @IsNotEmpty()
    phoneNumber!:string;

    @IsString()
    @IsNotEmpty()
    department!:string;

    @IsString()
    @IsNotEmpty()
    faculty!:string;
}