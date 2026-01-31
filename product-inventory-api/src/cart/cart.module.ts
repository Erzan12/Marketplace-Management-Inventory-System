import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CartController],
  providers: [PrismaService, CartService],
})
export class CartModule {}
