import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../../shared/constants/enums.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @IsInt()
  productId!: string;

  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsNumber()
  @IsPositive()
  price!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

export class UpdateOrderStatusDto {
    @IsString()
    @IsNotEmpty()
    @IsEnum(OrderStatus, {
        message: 'Order status must be PENDING, PAID, SHIPPED,COMPLETED, CANCELLED'
    })
    @Type(() => String)
    @ApiProperty({
        enum: OrderStatus,
        example: OrderStatus.PENDING,
        description: 'The order status of this product'
    })
    status!: OrderStatus;
}