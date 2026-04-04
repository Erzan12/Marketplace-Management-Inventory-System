import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RESPONSE_MESSAGES } from "../../common/constants/response-messages.constant";
import { successResponse } from "../../common/helpers/response-helper";
import { AddCartDto, UpdateCartDto } from "./dto/cart.dto";
import { RequestUser } from "../../shared/types/request-user.interface";

@Injectable()
export class CartService {
    // key: userId, value: array of cart items
    constructor(private prisma: PrismaService) {}

    async viewCart(userId: string) {
    return this.prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
    });
    }

    async addToCart(requestUser: RequestUser, dto: AddCartDto) {
        const { productId, quantity } = dto;

        console.log('Adding to cart:', { productId, quantity }); // Debug log

        const product = await this.prisma.product.findFirst({
            where: { id: productId },
            include: {
                inventory: {
                    select: {
                        id: true,
                        product: true,
                        quantity: true,
                    }
                }
            }
        });

        
        if (!product?.inventory) {
            throw new BadRequestException('Product has no inventory record');
        }

        const userId = requestUser.id;

        const existing = await this.prisma.cartItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });

        if (!existing) {
            throw new NotFoundException(RESPONSE_MESSAGES.CART.ITEM_NOT_FOUND);
        }

        const availableStock = product.inventory.quantity;

        const totalRequestedQuantity = (existing?.quantity || 0) + quantity;

        if (totalRequestedQuantity > availableStock) {
            throw new BadRequestException(
                `Cannot add ${quantity} of "${product.name}". Only ${availableStock} left in stock.`
            );
        }

        return this.prisma.cartItem.upsert({
            where: { userId_productId: { userId, productId } },
            update: { quantity: { increment: quantity } },
            create: {
                user: {
                connect: { id: requestUser.id },
                },
                product: {
                connect: { id: productId },
                },
                quantity,
            },
        });
    }

    async updateQuantity(requestUser: RequestUser, dto: UpdateCartDto, productId: string) {

        const { quantity } = dto;

       console.log('Updating cart quantity:', { productId, quantity });
        
        const product = await this.prisma.product.findFirst({
            where: { id: productId },
            include: {
                inventory: {
                    select: {
                        id: true,
                        product: true,
                        quantity: true,
                    }
                }
            }
        });

        if (!product?.inventory) {
            throw new BadRequestException('Product has no inventory record');
        }

        const userId = requestUser.id;

        const existing = await this.prisma.cartItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });

        if (!existing) {
            throw new NotFoundException(RESPONSE_MESSAGES.CART.ITEM_NOT_FOUND);
        }

        if (quantity > product.inventory.quantity) {
        throw new BadRequestException(
            RESPONSE_MESSAGES.CART.INSUFFICIENT_STOCK(
            product.name,
            product.inventory.quantity,
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

    async removeFromCart(userId: string, productId: string) {
        const deleted = await this.prisma.cartItem.delete({
            where: { userId_productId: { userId, productId } },
        });

        return successResponse(RESPONSE_MESSAGES.CART.ITEM_REMOVED, deleted);
    }

    async clearCart(userId: string) {
        const result = await this.prisma.cartItem.deleteMany({
            where: { userId },
        });

        return successResponse('Cart cleared successfully', { count: result.count });
    }
}