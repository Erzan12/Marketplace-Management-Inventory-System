import { Injectable, NotFoundException, HttpException, HttpStatus, BadRequestException, ConflictException  } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { buildErrorResponse } from '../../common/helpers/response-helper';
import { RESPONSE_MESSAGES } from '../../common/constants/response-messages.constant';
import { GetProductsQueryDto } from './dto/get-product-query.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    try {
      const existingProduct = await this.prisma.product.findFirst({
        where: { name: dto.name }
      })

      if (existingProduct) {
        throw new ConflictException('Product already exist!')
      }

      const { name, description, price, quantity, categoryId, slug, storeId } = dto;

      const product = await this.prisma.product.create({
        data: {
          name,
          description,
          price,
          quantity,
          categoryId,
          slug,
          storeId
        }
      })

      return {
        status: 'success',
        message: 'Product created successfully',
        product,
      }
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
  // async restockProduct(productId: number, quantity: number) {
  //   const product = await this.prisma.inventory.findUnique({ where: { id: productId } });

  //   if (!product) {
  //     throw new NotFoundException('Product not found');
  //   }

  //   return this.prisma.inventory.update({
  //     where: { id: productId },
  //     data: {
  //       quantity: product.quantity + quantity,
  //     },
  //   });
  // }

  //Admin low stocks alert
  // async getLowStockProducts(threshold: number) {
  //   return this.prisma.inventory.findMany({
  //     where: {
  //       quantity: {
  //         lt: threshold,
  //       },
  //     },
  //     orderBy: {
  //       quantity: 'asc',
  //     },
  //   });
  // }

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

  // async findAll() {
  //   return this.prisma.product.findMany({
  //     include: { category: true },
  //   });
  // }
  // products.service.ts
  async findAll(query: GetProductsQueryDto
  ) {
    const { search, categoryId, page = 1, limit = 8 } = query;
    const skip = (page - 1) * limit;

    // 2. Build our conditional 'where' query
    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    // Execute query and count total for pagination metadata
    const [products, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        where: whereCondition,
        skip,
        take: Number(limit),
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where: whereCondition }),
    ]);

    return {
      data: products,
      meta: {
        totalItems,
        page,
        lastPage: Math.ceil(totalItems / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(id: number, data: UpdateProductDto) {
    return this.prisma.product.update({
       where: { id },
       data,
       include: { category: true },
   });
  }
}
