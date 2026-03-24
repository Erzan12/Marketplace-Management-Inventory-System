import { IsEnum } from "class-validator";

export enum OrderStatus {
    pending = 'pending',
    paid = 'paid',
    shipped = 'shipped',
    completed = 'completed',
    cancelled = 'cancelled',
}

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}