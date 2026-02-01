import { Controller, Post, Body, Request, Patch, Param, Get, Req, ParseIntPipe, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Authenticated, Roles, Public } from '../common/decorators/public.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Admin only - Get all orders
  @Authenticated()
  @Get()
  @Roles('admin')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  // Admin only - Update order status
  @Authenticated()
  @Patch(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.UpdateOrderStatus(Number(id), dto);
  }

  // Admin only - Get product order history
  @Authenticated()
  @Get('product/:productId/history')
  @Roles('admin')
  getProductOrderHistory(@Param('productId', ParseIntPipe) productId: number) {
    return this.orderService.getOrderHistoryByProduct(productId);
  }

  // Admin only - Sales trends
  @Authenticated()
  @Get('sales-trends')
  @Roles('admin')
  getSalesTrends(@Query('period') period: 'day' | 'month' = 'day' ) {
    return this.orderService.getSalesTrends(period);
  }

  // User - Get my orders
  @Authenticated()
  @Get('my')
  async getMyOrders(@Req() req) {
    return this.orderService.getMyOrders(req.user.userId);
  }

  // User - Checkout
  @Authenticated()
  @Post('checkout')
  checkout(@Request() req) {
    return this.orderService.checkout(req.user.userId);
  }
}
