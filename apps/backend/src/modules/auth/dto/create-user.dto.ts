import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'sample@gmail.com', description: 'This is the user email'})
    email!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'password', description: 'The password of the user'})
    password!: string;
}