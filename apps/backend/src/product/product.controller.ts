import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RestockProductDto } from './dto/restock-product.dto';
import { Authenticated, Roles, Public } from '../common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Admin only - Create product
  @Authenticated()
  @Post()
  @Roles('admin')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  // Public - Anyone can view all products
  @Public()
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  // Public - Anyone can view a single product
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  // Admin only - Update product
  @Authenticated()
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  // Admin only - Delete product
  @Authenticated()
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  // Admin only - Restock product
  @Authenticated()
  @Patch(':id/restock')
  @Roles('admin')
  restock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RestockProductDto
  ) {
    return this.productService.restockProduct(id, dto.quantity);
  }

  // Admin only - Low stock alert
  @Authenticated()
  @Get('low-stock')
  @Roles('admin')
  getLowStockProducts(@Query('threshold') threshold = 5) {
    return this.productService.getLowStockProducts(threshold);
  }

  // Admin only - Reorder recommendations
  @Authenticated()
  @Get('reorder-recommendations')
  @Roles('admin')
  getReorderRecommendations(
    @Query('days') days: string = '7',
    @Query('stockThreshold') stockThreshold: string = '10',
    @Query('minSales') minSales: string = '2',
  ) {
    return this.productService.getReorderRecommendations(
      parseInt(days),
      parseInt(stockThreshold),
      parseInt(minSales),
    )
  }
}
