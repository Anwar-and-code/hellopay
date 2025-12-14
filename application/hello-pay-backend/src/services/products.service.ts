import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Products } from '../models/Products';
import { CreateProductDto } from '../models/dto/produits/create-product.dto';
import { UpdateProductDto } from '../models/dto/produits/update-product.dto';
import { ResponseHelper } from '../utils/response.helper';
import { paginateRepository } from '../utils/pagination.helper';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Products)
    private readonly repository: Repository<Products>,
  ) {}

  async create(dto: CreateProductDto) {
    const date = new Date().toISOString();
    try {
      const product = this.repository.create({
        name: dto.name,
        description: dto.description ?? null,
        price: typeof dto.price === 'number' ? dto.price.toFixed(2) : String(dto.price),
        stock: dto.stock ?? 0,
        imageUrl: dto.imageUrl ?? null,
        categoryId: dto.categoryId ?? null,
        supplierId: dto.supplierId ?? null,
      });

      const saved = await this.repository.save(product);

      this.logger.log(`[${date}] Create product success: ${saved.name}`);
      return ResponseHelper.success(saved, 'Product created');
    } catch (error) {
      this.logger.error(`[${date}] Create product error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error creating product', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAll(name?: string, categorie?: string,supplier?:string) {
    const date = new Date().toISOString();
    try {
      const where = [];

      if (categorie) {
        where.push({ categoryId: categorie });
      }

      if (name) {
        where.push({ name: Like(`%${name}%`) });
      }

      if (supplier) {
        where.push({ supplierId: supplier });
      }

      const products = await this.repository.find({
        where: where.length > 0 ? where : {},
        relations: ['category', 'supplier'],
      });

      this.logger.log(`[${date}] Get all products success: count=${products.length}`);
      return ResponseHelper.success(products, 'Products retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all products error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving products', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findOne(id: string) {
    const date = new Date().toISOString();
    try {
      const product = await this.repository.findOne({
        where: { id },
        relations: ['category', 'supplier'],
      });
      if (!product) {
        this.logger.warn(`[${date}] Product not found: id=${id}`);
        return ResponseHelper.error('Product not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`[${date}] Get product success: id=${id}`);
      return ResponseHelper.success(product, 'Product retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get product error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving product', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    const date = new Date().toISOString();
    try {
      const product = await this.repository.findOne({ where: { id } });
      if (!product) {
        this.logger.warn(`[${date}] Product not found for update: id=${id}`);
        return ResponseHelper.error('Product not found', HttpStatus.NOT_FOUND);
      }

      product.name = dto.name ?? product.name;
      product.description = dto.description ?? product.description;
      product.price =
        dto.price !== undefined
          ? typeof dto.price === 'number'
            ? dto.price.toFixed(2)
            : String(dto.price)
          : product.price;
      product.stock = dto.stock ?? product.stock;
      product.imageUrl = dto.imageUrl ?? product.imageUrl;
      product.categoryId = dto.categoryId ?? product.categoryId;
      product.supplierId = dto.supplierId ?? product.supplierId;

      const saved = await this.repository.save(product);

      this.logger.log(`[${date}] Update product success: id=${id}`);
      return ResponseHelper.success(saved, 'Product updated');
    } catch (error) {
      this.logger.error(`[${date}] Update product error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error updating product', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async remove(id: string) {
    const date = new Date().toISOString();
    try {
      const product = await this.repository.findOne({ where: { id } });
      if (!product) {
        this.logger.warn(`[${date}] Product not found for delete: id=${id}`);
        return ResponseHelper.error('Product not found', HttpStatus.NOT_FOUND);
      }

      await this.repository.remove(product);

      this.logger.log(`[${date}] Delete product success: id=${id}`);
      return ResponseHelper.success2({ id }, 'Product deleted');
    } catch (error) {
      this.logger.error(`[${date}] Delete product error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error deleting product', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAllPaginate(page?: number, limit?: number, name?: string, categorie?: string,supplier?:string) {
    const date = new Date().toISOString();
    try {
      const where = [];
      if (categorie) {
        where.push({ categoryId: categorie });
      }

      if (name) {
        where.push({ name: Like(`%${name}%`) });
      }

      if (supplier) {
        where.push({ supplierId: supplier });
      }

      const result = await paginateRepository(this.repository, {
        page,
        limit,
        relations: ['category', 'supplier'],
        order: { createdAt: 'DESC' },
        where: where.length > 0 ? where : {},
      });

      this.logger.log(`[${date}] Get all products success: count=${result.data.length}, page=${result.meta.page}`);
      return ResponseHelper.successPaginate(result, 'Products retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all products error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving products', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
}