// src/order/order.controller.ts
import { Controller, Post, Body, Request, Patch, Param, Get, Req, ParseIntPipe, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../common/decorators/public.decorator';
// import { Role } from '../auth/role.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { RolesGuard } from '../common/guard/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //get all user orders (admin role)
  @Get()
  @Roles('admin')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  //update user order (admin role)
  @Patch(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.UpdateOrderStatus(Number(id), dto);
  }

  @Get('product/:productId/history')
  @Roles('admin')
  getProductOrderHistory(@Param('productId', ParseIntPipe) productId: number) {
    return this.orderService.getOrderHistoryByProduct(productId);
  }

  // Sales trends
  @Get('sales-trends')
  getSalesTrends(@Query('period') period: 'day' | 'month' = 'day' ) {
    return this.orderService.getSalesTrends(period);
  }

  //customer side on orders and checkout 
  // @Get('my')
  // async getMyOrders(@Request() req) {
  //   console.log('req.user:', req.user);
  //   return this. orderService.getUserOrders(req.user.userId);
  // }
  
  // @Post()
  // create(@Body() dto: CreateOrderDto, @Request() req) {
  //   const userId = req.user.userId; // extracted from token
  //   return this.orderService.createOrder(userId, dto);
  // }


  //user side
  @Get('my')
  async getMyOrders(@Req() req) {
    console.log('req.user:', req.user);
    return this.orderService.getMyOrders(req.user.userId);
  }

  @Post('checkout')
  checkout(@Request() req) {
    console.log('req.user:', req.user);
    return this.orderService.checkout(req.user.userId);
  }
}



