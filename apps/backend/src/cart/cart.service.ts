import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RESPONSE_MESSAGES } from "../common/constants/response-messages.constant";
import { successResponse } from "../common/helpers/response-helper";

@Injectable()
export class CartService {
    // key: userId, value: array of cart items
    constructor(private prisma: PrismaService) {}

    async viewCart(userId: number) {
    return this.prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
    });
    }

    async addToCart(userId: number, productId: number, quantity: number) {
        console.log('Adding to cart:', { userId, productId, quantity }); // Debug log

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const existing = await this.prisma.cartItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });

        const totalRequestedQuantity = (existing?.quantity || 0) + quantity;

        if (totalRequestedQuantity > product.quantity) {
            throw new BadRequestException(
                `Cannot add ${quantity} of "${product.name}". Only ${product.quantity} left in stock.`
            );
        }

        // if (existing) {
        //     return this.prisma.cartItem.update({
        //         where: { userId_productId: { userId, productId } },
        //         data: { quantity: existing.quantity + quantity },
        //     });
        // }

        return this.prisma.cartItem.create({
            data: { userId, productId, quantity },
        });
    }

    async updateQuantity(userId: number, productId: number, quantity: number) {
        
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const existing = await this.prisma.cartItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });

        if (!existing) {
            throw new NotFoundException(RESPONSE_MESSAGES.CART.ITEM_NOT_FOUND);
        }

        if (quantity > product.quantity) {
        throw new BadRequestException(
            RESPONSE_MESSAGES.CART.INSUFFICIENT_STOCK(
            product.name,
            product.quantity,
            quantity
            )
        );
        }
        const updated = await this.prisma.cartItem.update({
            where: { userId_productId: { userId, productId } },
            data: { quantity },
        });

        return successResponse(RESPONSE_MESSAGES.CART.ITEM_UPDATED, updated);
    }

    async removeFromCart(userId: number, productId: number) {
        const deleted = await this.prisma.cartItem.delete({
            where: { userId_productId: { userId, productId } },
        });

        return successResponse(RESPONSE_MESSAGES.CART.ITEM_REMOVED, deleted);
    }
}