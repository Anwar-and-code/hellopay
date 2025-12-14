import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PaymentPlans } from '../models/PaymentPlans';
import { CreatePaymentPlanDto } from '../models/dto/payment_plan/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from '../models/dto/payment_plan/update-payment-plan.dto';
import { ResponseHelper } from '../utils/response.helper';
import { paginateRepository } from '../utils/pagination.helper';

@Injectable()
export class PaymentPlansService {
  private readonly logger = new Logger(PaymentPlansService.name);

  constructor(
    @InjectRepository(PaymentPlans)
    private readonly repository: Repository<PaymentPlans>,
  ) {}

  async create(dto: CreatePaymentPlanDto) {
    const date = new Date().toISOString();
    try {
      const plan = this.repository.create({
        name: dto.name,
        numberOfInstallments: dto.numberOfInstallments,
        intervalInDays: dto.intervalInDays ?? 30,
        description: dto.description ?? null,
      });

      const saved = await this.repository.save(plan);

      this.logger.log(`[${date}] Create payment plan success: ${saved.name}`);
      return ResponseHelper.success(saved, 'Payment plan created');
    } catch (error) {
      this.logger.error(`[${date}] Create payment plan error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error creating payment plan', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAll(name?: string) {
    const date = new Date().toISOString();
    try {
      const plans = await this.repository.find({
        relations: [],
        where: name ? { name: Like(`%${name}%`) } : {},
        order: { createdAt: 'DESC' as any },
      });

      this.logger.log(`[${date}] Get all payment plans success: count=${plans.length}`);
      return ResponseHelper.success(plans, 'Payment plans retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all payment plans error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving payment plans', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findOne(id: string) {
    const date = new Date().toISOString();
    try {
      const plan = await this.repository.findOne({
        where: { id },
        relations: [],
      });
      if (!plan) {
        this.logger.warn(`[${date}] Payment plan not found: id=${id}`);
        return ResponseHelper.error('Payment plan not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`[${date}] Get payment plan success: id=${id}`);
      return ResponseHelper.success(plan, 'Payment plan retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get payment plan error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving payment plan', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async update(id: string, dto: UpdatePaymentPlanDto) {
    const date = new Date().toISOString();
    try {
      const plan = await this.repository.findOne({ where: { id } });
      if (!plan) {
        this.logger.warn(`[${date}] Payment plan not found for update: id=${id}`);
        return ResponseHelper.error('Payment plan not found', HttpStatus.NOT_FOUND);
      }

      plan.name = dto.name ?? plan.name;
      plan.numberOfInstallments = dto.numberOfInstallments ?? plan.numberOfInstallments;
      plan.intervalInDays = dto.intervalInDays ?? plan.intervalInDays;
      plan.description = dto.description ?? plan.description;

      const saved = await this.repository.save(plan);

      this.logger.log(`[${date}] Update payment plan success: id=${id}`);
      return ResponseHelper.success(saved, 'Payment plan updated');
    } catch (error) {
      this.logger.error(`[${date}] Update payment plan error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error updating payment plan', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async remove(id: string) {
    const date = new Date().toISOString();
    try {
      const plan = await this.repository.findOne({ where: { id } });
      if (!plan) {
        this.logger.warn(`[${date}] Payment plan not found for delete: id=${id}`);
        return ResponseHelper.error('Payment plan not found', HttpStatus.NOT_FOUND);
      }

      await this.repository.remove(plan);

      this.logger.log(`[${date}] Delete payment plan success: id=${id}`);
      return ResponseHelper.success2({ id }, 'Payment plan deleted');
    } catch (error) {
      this.logger.error(`[${date}] Delete payment plan error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error deleting payment plan', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
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

      this.logger.log(`[${date}] Get all payment plans success: count=${result.data.length}, page=${result.meta.page}`);
      return ResponseHelper.successPaginate(result, 'Payment plans retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all payment plans error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving payment plans', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
}