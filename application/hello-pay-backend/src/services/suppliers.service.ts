import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Suppliers } from '../models/Suppliers';
import { CreateSupplierDto } from '../models/dto/suppliers/create-supplier.dto';
import { UpdateSupplierDto } from '../models/dto/suppliers/update-supplier.dto';
import { ResponseHelper } from '../utils/response.helper';
import { FileLogger } from '../utils/logger';
import { paginateRepository } from '../utils/pagination.helper';

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger(SuppliersService.name);
  private readonly writter_logger = new FileLogger(SuppliersService.name);

  constructor(
    @InjectRepository(Suppliers)
    private readonly repository: Repository<Suppliers>,
  ) {}

  async create(dto: CreateSupplierDto) {
    const date = new Date().toISOString();
    try {
      const supplier = this.repository.create({
        name: dto.name,
        address: dto.address ?? null,
        contact: dto.contact ?? null,
        location: dto.location ?? null,
      });

      const saved = await this.repository.save(supplier);

      this.logger.log(`[${date}] Create supplier success: ${saved.name}`);
      this.writter_logger.log(`Create supplier success: ${saved.name}`);
      return ResponseHelper.success(saved, 'Supplier created');
    } catch (error) {
      this.logger.error(`[${date}] Create supplier error: ${error.message}`, error.stack);
      this.writter_logger.error(`Error creating supplier: ${error.message}`, error.stack);
      return ResponseHelper.error('Error creating supplier', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAll(name?: string) {
    const date = new Date().toISOString();
    try {
      const suppliers = await this.repository.find({
        relations: ['products'],
        where: name ? { name: Like(`%${name}%`) } : {},
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`[${date}] Get all suppliers success: count=${suppliers.length}`);
      return ResponseHelper.success(suppliers, 'Suppliers retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all suppliers error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving suppliers', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findOne(id: string) {
    const date = new Date().toISOString();
    try {
      const supplier = await this.repository.findOne({ where: { id } });
      if (!supplier) {
        this.logger.warn(`[${date}] Supplier not found: id=${id}`);
        return ResponseHelper.error('Supplier not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`[${date}] Get supplier success: id=${id}`);
      return ResponseHelper.success(supplier, 'Supplier retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get supplier error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving supplier', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async update(id: string, dto: UpdateSupplierDto) {
    const date = new Date().toISOString();
    try {
      const supplier = await this.repository.findOne({ where: { id } });
      if (!supplier) {
        this.logger.warn(`[${date}] Supplier not found for update: id=${id}`);
        return ResponseHelper.error('Supplier not found', HttpStatus.NOT_FOUND);
      }

      supplier.name = dto.name ?? supplier.name;
      supplier.address = dto.address ?? supplier.address;
      supplier.contact = dto.contact ?? supplier.contact;
      supplier.location = dto.location ?? supplier.location;

      const saved = await this.repository.save(supplier);

      this.logger.log(`[${date}] Update supplier success: id=${id}`);
      this.writter_logger.log(`Update supplier success: id=${id}`);
      return ResponseHelper.success(saved, 'Supplier updated');
    } catch (error) {
      this.logger.error(`[${date}] Update supplier error: ${error.message}`, error.stack);
      this.writter_logger.error(`Error updating supplier: ${error.message}`, error.stack);
      return ResponseHelper.error('Error updating supplier', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async remove(id: string) {
    const date = new Date().toISOString();
    try {
      const supplier = await this.repository.findOne({ where: { id } });
      if (!supplier) {
        this.logger.warn(`[${date}] Supplier not found for delete: id=${id}`);
        return ResponseHelper.error('Supplier not found', HttpStatus.NOT_FOUND);
      }

      await this.repository.remove(supplier);

      this.logger.log(`[${date}] Delete supplier success: id=${id}`);
      this.writter_logger.log(`Delete supplier success: id=${id}`);
      return ResponseHelper.success2({ id }, 'Supplier deleted');
    } catch (error) {
      this.logger.error(`[${date}] Delete supplier error: ${error.message}`, error.stack);
      this.writter_logger.error(`Error deleting supplier: ${error.message}`, error.stack);
      return ResponseHelper.error('Error deleting supplier', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAllPaginate(page?: number, limit?: number, name?: string) {
    const date = new Date().toISOString();
    try {
      const result = await paginateRepository(this.repository, {
        page,
        limit,
        relations: ['products'],
        where: name ? { name: Like(`%${name}%`) } : {},
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`[${date}] Get all suppliers success: count=${result.data.length}, page=${result.meta.page}`);
      return ResponseHelper.successPaginate(result, 'Suppliers retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all suppliers error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving suppliers', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
}