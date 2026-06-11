import { IsString, IsInt, IsEmail, Min, MinLength } from 'class-validator' 

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsInt()
    @Min(0)
    age: number;

    @IsString()
    @MinLength(8)
    password: string
}
