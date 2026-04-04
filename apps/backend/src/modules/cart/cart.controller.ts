import { Controller, Delete, Post, Get, Patch, Request, Param, Body, Req, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { AddCartDto, UpdateCartDto } from './dto/cart.dto';
import { RequestUser } from '../../shared/types/request-user.interface';
import { SessionUser } from '../../shared/types/session-user.decorator';

@Controller('cart') // Change this from 'orders'
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post() // Logic: POST /cart
    addToCart(
        @SessionUser() user: RequestUser,
        @Body() dto: AddCartDto,
    ) {
        return this.cartService.addToCart(user, dto);
    }

    @Get() // Logic: GET /cart
    viewCart(@Request() req) {
        return this.cartService.viewCart(req.user.userId);
    }

    @Patch('/:productId')
    updateCart(
        @SessionUser() user: RequestUser,
        @Body() dto: UpdateCartDto,
        @Param('productId', new ParseUUIDPipe()) productId: string,
    ) {
        return this.cartService.updateQuantity(user, dto, productId);
    }

    // Use Param for Delete to match common REST patterns
    @Delete(':productId') // Logic: DELETE /cart/:productId
    removeFromCart(@Request() req, @Param('productId') productId: string) {
        return this.cartService.removeFromCart(req.user.userId, productId);
    }
}
