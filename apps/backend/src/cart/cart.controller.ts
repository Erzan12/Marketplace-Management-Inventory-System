import { Controller, Delete, Post, Get, Patch, Request, Param, Body, Req, BadRequestException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { Authenticated } from '../common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

// -- disabled jwt for testing in frontend will be comment out later
@ApiBearerAuth()
@Controller('orders')
export class CartController {
    constructor ( private readonly cartService: CartService) {}

    @Authenticated()
    @Post('/cart')
    async addToCart(@Request() req, @Body() body: { productId: number; quantity: number }) {
    const userId = req.user?.userId;

    if (!userId || !body.productId) {
        throw new BadRequestException('Missing userId or productId');
    }

    return this.cartService.addToCart(userId, body.productId, body.quantity);
    }

    @Authenticated()
    @Get('/my-cart')
    viewCart(@Request() req) {
    const userId = req.user.userId;
    return this.cartService.viewCart(userId);
    }

    @Patch()
    updateQuantity(
        @Req() req,
        @Body('productId') productId: number,
        @Body('quantity') quantity: number,
    ) {
        const userId = req.user.userId; // pulled from JWT (ensure auth middleware is used)
        return this.cartService.updateQuantity(userId, productId, quantity);
    }

    @Delete()
    removeFromCart(@Req() req, @Body('productId') productId: number) {
        const userId = req.user.userId;
        return this.cartService.removeFromCart(userId, productId);
    }

            // const deleted = await this.prisma.cartItem.delete({
            //     where: { userId_productId: { userId, productId } },
            // });
    
            // return successResponse(RESPONSE_MESSAGES.CART.ITEM_REMOVED, deleted);
            // }
}
