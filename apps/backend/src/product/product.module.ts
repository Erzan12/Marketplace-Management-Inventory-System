// src/product/product.module.ts
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 Import this

@Module({
  imports: [PrismaModule], // 👈 Now PrismaService is available here
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
