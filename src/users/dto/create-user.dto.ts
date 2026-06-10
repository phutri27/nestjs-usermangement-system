import { IsString, IsInt, IsEmail } from 'class-validator' 

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsInt()
    age: number;
}
