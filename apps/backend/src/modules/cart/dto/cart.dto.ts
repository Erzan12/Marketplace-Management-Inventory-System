import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class AddCartDto {
    @IsString()
    @ApiProperty({
        example: "productId"
    })
    productId!: string;

    @IsInt()
    @ApiProperty({
        example: "quantity"
    })
    quantity!: number;
}