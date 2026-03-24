import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'sample@gmail.com', description: 'This is the user email'})
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'password', description: 'The password of the user'})
    password: string;

    @IsOptional()
    @IsIn(['user','admin'])
    @ApiProperty({ enum: Role, example: Role.user})
    role?: Role;
}