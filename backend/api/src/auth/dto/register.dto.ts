import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsNumber } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
  message: 'Username can only contain letters, numbers and underscores',
})
    email!:string;

    @IsString()
    @IsNotEmpty()
    fullname!:string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
  message: 'matric can only contain letters, numbers and underscores',
})
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


    @IsNumber()
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