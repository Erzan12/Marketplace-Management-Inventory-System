import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ 
        example: 'sample@gmail.com', 
        description: 'This is the user email'
    })
    email!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ 
        example: 'password', 
        description: 'The password of the user'
    })
    password!: string;

    // @IsOptional()
    // @IsIn(['user','admin'])
    // @ApiProperty({ enum: Role, example: Role.user})
    // role?: Role;
}

export class CreateUserProfileDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Juan',
        description: 'User firstname'
    })
    firstName?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Not',
        description: 'User middle name it is optional',
    })
    middleName?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Not',
        description: 'User middle name, is optional',
    })
    lastName?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'User Avatar/Image',
        description: 'User profile image, is optional',
    })
    avatarURL?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'User current address location',
        description: 'User address, is optional',
    })
    address?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'User city location',
        description: 'User city, is optional',
    })
    city?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'User country',
        description: 'User country, is optional',
    })
    country?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'User bio',
        description: 'User bio, is optional',
    })
    bio?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'User phone number',
        description: 'User phone number, is optional',
    })
    phone?: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty({
        example: '2000-05-12',
        description: 'User date of birth, is optional',
    })
    dateOfBirth?: string;
}
