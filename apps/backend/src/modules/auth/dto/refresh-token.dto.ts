import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
    @IsString()
    @ApiProperty({
        example: 'Refresh Token'
    })
    refreshToken!: string;
}