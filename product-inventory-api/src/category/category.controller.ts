import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Authenticated, Roles, Public } from '../common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Admin only - Create category
  @Authenticated()
  @Post()
  @Roles('admin')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  // Public - Anyone can view categories
  @Public()
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  // Public - Anyone can view a single category
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  // Admin only - Update category
  @Authenticated()
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  // Admin only - Delete category
  @Authenticated()
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
