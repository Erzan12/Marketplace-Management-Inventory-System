import { Controller, Post, Body, Request, Patch, Param, Get, Req, ParseIntPipe, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/order.dto';
import {  Roles } from '../../common/decorators/public.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Admin only - Get all orders
  @Get()
  @Roles('admin')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  // Admin only - Update order status
  @Patch(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.UpdateOrderStatus(id, dto);
  }

  // Admin only - Get product order history
  @Get('product/:productId/history')
  @Roles('admin')
  getProductOrderHistory(@Param('productId', ParseIntPipe) productId: string) {
    return this.orderService.getOrderHistoryByProduct(productId);
  }

  // Admin only - Sales trends
  @Get('sales-trends')
  @Roles('admin')
  getSalesTrends(@Query('period') period: 'day' | 'month' = 'day' ) {
    return this.orderService.getSalesTrends(period);
  }

  // User - Get my orders
  @Get('my')
  async getMyOrders(@Req() req) {
    return this.orderService.getMyOrders(req.user.userId);
  }

  // User - Checkout
  @Post('checkout')
  checkout(@Request() req) {
    return this.orderService.checkout(req.user.userId);
  }
}
