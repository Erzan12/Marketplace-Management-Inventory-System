import { IsString, IsOptional, IsNumber, Min, IsPositive, IsInt } from 'class-validator'

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsInt()
  @IsNumber()
  categoryId: number; // required for connect
}
