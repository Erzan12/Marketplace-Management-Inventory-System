import { Controller, Delete, Post, Get, Patch, Request, Param, Body, Req, BadRequestException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';

@Controller('orders')
export class CartController {
    constructor ( private readonly cartService: CartService) {}

    @Post('/cart')
    async addToCart(
        @Request() req, 
        @Body() body: { productId: string; quantity: number }
    ) {
        const userId = req.user?.userId;

        if (!userId || !body.productId) {
            throw new BadRequestException('Missing userId or productId');
        }
        return this.cartService.addToCart(userId, body.productId, body.quantity);
    }

    @Get('/my-cart')
    viewCart(@Request() req) {
        const userId = req.user.userId;
        return this.cartService.viewCart(userId);
    }

    @Patch()
    updateQuantity(
        @Req() req,
        @Body('productId') productId: string,
        @Body('quantity') quantity: number,
    ) {
        const userId = req.user.userId; // pulled from JWT (ensure auth middleware is used)
        return this.cartService.updateQuantity(userId, productId, quantity);
    }

    @Delete()
    removeFromCart(
        @Req() req, 
        @Body('productId') productId: string
    ) {
        const userId = req.user.userId;
        return this.cartService.removeFromCart(userId, productId);
    }
}
