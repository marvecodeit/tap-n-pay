import { IsEmail, IsString, IsNotEmpty, isNotEmpty  } from "class-validator";

export class loginDto {
 @IsString()
 @IsNotEmpty()
 identifier:string;   //Email + Matric No 
 
 @IsString()
 @IsNotEmpty()
 password:string;
}