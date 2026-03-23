import { Injectable, NotFoundException, HttpException, HttpStatus, BadRequestException  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { buildErrorResponse } from '../common/helpers/response-helper';
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError && 
        error.code === 'P2003'
      ) {
        throw new HttpException(
          buildErrorResponse(
            RESPONSE_MESSAGES.PRODUCT.CATEGORY_NOT_FOUND,
            'ForeignKeyViolation',
            HttpStatus.BAD_REQUEST,
          ),
          HttpStatus.BAD_REQUEST,
        );
      }

      throw error;
    }
  }

  //Delete product
  async remove(id: number) {
    const orderItems = await this.prisma.orderItem.findMany({
      where: { productId: id },
    });

    if (orderItems.length > 0) {
      throw new BadRequestException('Cannot delete product: it is referenced in order items.');
    }

    return this.prisma.product.delete({ where: { id } });
  }

  //Admin restock product
  async restockProduct(productId: number, quantity: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        quantity: product.quantity + quantity,
      },
    });
  }

  //Admin low stocks alert
  async getLowStockProducts(threshold: number) {
    return this.prisma.product.findMany({
      where: {
        quantity: {
          lt: threshold,
        },
      },
      orderBy: {
        quantity: 'asc',
      },
    });
  }

  //Reorder Recommendations
  async getReorderRecommendations(days = 7, stockThreshold = 10, minSales = 2) {
    const result = await this.prisma.$queryRawUnsafe<any[]> (`
      SELECT
        p.id,
        p.name,
        p.quantity,
        COUNT(oi."productId") as "timesOrdered"
      FROM "Product" p
      JOIN "OrderItem" oi ON p.id = oi."productId"
      JOIN "Order" o ON o.id = oi."orderId"
      WHERE p.quantity < ${stockThreshold}
        AND o."createdAt" >= NOW() - INTERVAL '${days} days'
      GROUP BY p.id
      HAVING COUNT(oi."productId") >= ${minSales}
      ORDER BY "timesOrdered" DESC 
    `);

    return result.map((r) => ({
      id: r.id,
      name: r.name,
      quantity: r.quantity,
      timesOrdered: parseInt(r.timesOrdered),
    }));
  }

    findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  update(id: number, data: UpdateProductDto) {
    return this.prisma.product.update({
       where: { id },
       data,
       include: { category: true },
   });
  }
}
