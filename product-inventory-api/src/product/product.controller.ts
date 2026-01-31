import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RestockProductDto } from './dto/restock-product.dto';
import { Authenticated, Roles } from '../common/decorators/public.decorator';
// import { Role } from '../auth/role.enum';

// -- disabled jwt for testing in frontend will be comment out later
@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

//Admin restock product
  @Authenticated()
  @Patch(':id/restock')
  @Roles('admin')
  restock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RestockProductDto
  ) {
    return this.productService.restockProduct(id, dto.quantity);
  }

  //Admin low stock alert
  @Authenticated()
  @Get('low-stock')
  @Roles('admin')
  getLowStockProducts(@Query('threshold') threshold = 5) {
    return this.productService.getLowStockProducts(threshold);
  }

    //Product reorder recommendation
  @Authenticated()
  @Get('reorder-recommendations')
  @Roles('admin')
  getReorderRecommendations(
    @Query('days') days: string = '7',
    @Query('stockThreshold') stockThreshold: string = '10',
    @Query('minSales') minSales: string = '2', //minimun orders
  ) {
    return this.productService.getReorderRecommendations(
      parseInt(days),
      parseInt(stockThreshold),
      parseInt(minSales),
    )
  }

  @Authenticated() 
  @Post()
  @Roles('admin')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Authenticated() 
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Authenticated() 
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

}
