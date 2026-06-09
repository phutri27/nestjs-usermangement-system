import { IsString, IsInt, IsEmail } from 'class-validator' 

export class CreateUserDto {
    @IsInt()    
    id: number;

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsInt()
    age: number;
}
