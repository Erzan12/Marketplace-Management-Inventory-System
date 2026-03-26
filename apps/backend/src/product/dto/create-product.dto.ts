import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, IsPositive, IsInt, IsNotEmpty, isNotEmpty } from 'class-validator'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Iphone',
    description: 'Name of the product'
  })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Brand new iphone',
    description: 'Description of the product'
  })
  description?: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    example: 19000,
    description: 'Price of the product'
  })
  price!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    example: 2,
    description: 'Quantiy/No of amount of the product'
  })
  quantity!: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 2,
    description: 'The category ID the product belongs'
  })
  categoryId!: number; // required for connect

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Product slug',
    description: 'The slug must be unique'
  })
  slug!: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Store ID',
    description: 'The ID of the store'
  })
  storeId!: number;
}
