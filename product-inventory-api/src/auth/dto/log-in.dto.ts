import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'admin@example.com', description: 'Your log in email' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'password123', description: 'Your log in password'})
    password: string;
}