import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Categories } from '../models/Categories';
import { CreateCategoryDto } from '../models/dto/categories/create-category.dto';
import { UpdateCategoryDto } from '../models/dto/categories/update-category.dto';
import { ResponseHelper } from '../utils/response.helper';
import { FileLogger } from '../utils/logger';
import { paginateRepository } from '../utils/pagination.helper';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private readonly writter_logger = new FileLogger(CategoriesService.name);

  constructor(
    @InjectRepository(Categories)
    private readonly repository: Repository<Categories>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const date = new Date().toISOString();
    try {
      const category = this.repository.create({
        name: dto.name,
        description: dto.description ?? null,
        slug: dto.slug ?? null,
      });

      const saved = await this.repository.save(category);

      this.logger.log(`[${date}] Create category success: ${saved.name}`);
      this.writter_logger.log(`Create category success: ${saved.name}`);
      return ResponseHelper.success(saved, 'Category created');
    } catch (error) {
      this.logger.error(`[${date}] Create category error: ${error.message}`, error.stack);
      this.writter_logger.error(`Error creating category: ${error.message}`, error.stack);
      return ResponseHelper.error('Error creating category', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAll(name?: string) {
    const date = new Date().toISOString();
    try {
      const categories = await this.repository.find({
        where: name ? { name: Like(`%${name}%`) } : {},
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`[${date}] Get all categories success: count=${categories.length}`);
      return ResponseHelper.success(categories, 'Categories retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all categories error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving categories', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findOne(id: string) {
    const date = new Date().toISOString();
    try {
      const category = await this.repository.findOne({ where: { id } });
      if (!category) {
        this.logger.warn(`[${date}] Category not found: id=${id}`);
        return ResponseHelper.error('Category not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`[${date}] Get category success: id=${id}`);
      return ResponseHelper.success(category, 'Category retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get category error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving category', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const date = new Date().toISOString();
    try {
      const category = await this.repository.findOne({ where: { id } });
      if (!category) {
        this.logger.warn(`[${date}] Category not found for update: id=${id}`);
        return ResponseHelper.error('Category not found', HttpStatus.NOT_FOUND);
      }

      category.name = dto.name ?? category.name;
      category.description = dto.description ?? category.description;

      const saved = await this.repository.save(category);

      this.logger.log(`[${date}] Update category success: id=${id}`);
      this.writter_logger.log(`Update category success: id=${id}`);
      return ResponseHelper.success(saved, 'Category updated');
    } catch (error) {
      this.logger.error(`[${date}] Update category error: ${error.message}`, error.stack);
      this.writter_logger.error(`Error updating category: ${error.message}`, error.stack);
      return ResponseHelper.error('Error updating category', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async remove(id: string) {
    const date = new Date().toISOString();
    try {
      const category = await this.repository.findOne({ where: { id } });
      if (!category) {
        this.logger.warn(`[${date}] Category not found for delete: id=${id}`);
        return ResponseHelper.error('Category not found', HttpStatus.NOT_FOUND);
      }

      await this.repository.remove(category);

      this.logger.log(`[${date}] Delete category success: id=${id}`);
      this.writter_logger.log(`Delete category success: id=${id}`);
      return ResponseHelper.success2({ id }, 'Category deleted');
    } catch (error) {
      this.logger.error(`[${date}] Delete category error: ${error.message}`, error.stack);
      this.writter_logger.error(`Error deleting category: ${error.message}`, error.stack);
      return ResponseHelper.error('Error deleting category', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

    async findAllPaginate(page?: number, limit?: number, name?: string) {
    const date = new Date().toISOString();
    try {
      const result = await paginateRepository(this.repository, {
        page,
        limit,
        where: name ? { name: Like(`%${name}%`) } : {},
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`[${date}] Get all categories success: count=${result.data.length}, page=${result.meta.page}`);
      return ResponseHelper.successPaginate(result, 'categories retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all categories error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving categories', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
}