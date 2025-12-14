import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deliveries } from '../models/Deliveries';
import { CreateDeliveryDto } from '../models/dto/deliveries/create-delivery.dto';
import { UpdateDeliveryDto } from '../models/dto/deliveries/update-delivery.dto';
import { ResponseHelper } from '../utils/response.helper';
import { paginateRepository } from '../utils/pagination.helper';
import { Orders } from '../models/Orders';

@Injectable()
export class DeliveriesService {
  private readonly logger = new Logger(DeliveriesService.name);

  constructor(
    @InjectRepository(Deliveries)
    private readonly repository: Repository<Deliveries>,
    
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async create(dto: CreateDeliveryDto) {
    const date = new Date().toISOString();
    try {
      const order = await this.ordersRepository.findOne({
        where: { id: dto.orderId },
      });

      if (!order) {
        this.logger.warn(`[${date}] Order not found: id=${dto.orderId}`);
        return ResponseHelper.error('Order not found', HttpStatus.NOT_FOUND);
      }
      
      if (order.status === 'PENDING' || order.status === 'PARTIALLY_PAID' || order.status === 'CANCELLED') {
        this.logger.warn(`[${date}] Order is not payed totally : id=${order.id}`);
        return ResponseHelper.error('Order is not payed totally buy all first', HttpStatus.FAILED_DEPENDENCY);
      }

      
      if (order.status === 'DELIVERED') {
        this.logger.warn(`[${date}] Order is already delivered : id=${order.id}`);
        return ResponseHelper.error('Order is already delivered', HttpStatus.CONFLICT);
      }
      
      const delivery = this.repository.create({
        orderId: dto.orderId,
        notes: dto.notes ?? null,
        lieuxPriseEnCharge: dto.lieuxPriseEnCharge??null,
        lieuxLivraison: dto.lieuxLivraison??null,
      });

      const saved = await this.repository.save(delivery);

      this.logger.log(`[${date}] Create delivery success: id=${saved.id}`);
      return ResponseHelper.success(saved, 'Delivery created');
    } catch (error) {
      this.logger.error(`[${date}] Create delivery error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error creating delivery', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAll() {
    const date = new Date().toISOString();
    try {
      const deliveries = await this.repository.find({
        relations: ['order'],
        order: { deliveredAt: 'DESC' as any },
      });

      this.logger.log(`[${date}] Get all deliveries success: count=${deliveries.length}`);
      return ResponseHelper.success(deliveries, 'Deliveries retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all deliveries error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving deliveries', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findOne(id: string) {
    const date = new Date().toISOString();
    try {
      const delivery = await this.repository.findOne({
        where: { id },
        relations: ['order'],
      });
      if (!delivery) {
        this.logger.warn(`[${date}] Delivery not found: id=${id}`);
        return ResponseHelper.error('Delivery not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`[${date}] Get delivery success: id=${id}`);
      return ResponseHelper.success(delivery, 'Delivery retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get delivery error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving delivery', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async update(id: string, dto: UpdateDeliveryDto) {
    const date = new Date().toISOString();
    try {
      const delivery = await this.repository.findOne({ where: { id } });
      if (!delivery) {
        this.logger.warn(`[${date}] Delivery not found for update: id=${id}`);
        return ResponseHelper.error('Delivery not found', HttpStatus.NOT_FOUND);
      }

      delivery.deliveryStatus = dto.deliveryStatus ?? delivery.deliveryStatus;
      delivery.deliveredAt = dto.deliveredAt ? new Date(dto.deliveredAt) : delivery.deliveredAt;
      delivery.lieuxPriseEnCharge = dto.lieuxPriseEnCharge ?? delivery.lieuxPriseEnCharge;
      delivery.lieuxLivraison = dto.lieuxLivraison ?? delivery.lieuxLivraison;
      delivery.notes = dto.notes ?? delivery.notes;
      const saved = await this.repository.save(delivery);

      const order = await this.ordersRepository.findOne({
        where: { id: delivery.orderId },
      });

      if (!order) {
        this.logger.warn(`[${date}] Order not found for update: id=${delivery.orderId}`);
        return ResponseHelper.error('Order not found', HttpStatus.NOT_FOUND);
      }
      if(delivery.deliveryStatus === 'DELIVERED') {
        order.status = 'DELIVERED';
        await this.ordersRepository.save(order);
      }
      
      this.logger.log(`[${date}] Update delivery success: id=${id}`);
      return ResponseHelper.success(saved, 'Delivery updated');
    } catch (error) {
      this.logger.error(`[${date}] Update delivery error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error updating delivery', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

    async remove(id: string) {
      const date = new Date().toISOString();
      try {
        const delivery = await this.repository.findOne({ where: { id } });
        if (!delivery) {
          this.logger.warn(`[${date}] Delivery not found for delete: id=${id}`);
          return ResponseHelper.error('Delivery not found', HttpStatus.NOT_FOUND);
        }

        await this.repository.remove(delivery);

        this.logger.log(`[${date}] Delete delivery success: id=${id}`);
        return ResponseHelper.success2({ id }, 'Delivery deleted');
      } catch (error) {
        this.logger.error(`[${date}] Delete delivery error: ${error.message}`, error.stack);
        return ResponseHelper.error('Error deleting delivery', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
      }
    }

  async findAllPaginate(page?: number, limit?: number) {
    const date = new Date().toISOString();
    try {
      const result = await paginateRepository(this.repository, {
        page,
        limit,
        order: { createdAt: 'DESC' },
        relations: ['order'],
      });

      this.logger.log(`[${date}] Get all deliveries success: count=${result.data.length}, page=${result.meta.page}`);
      return ResponseHelper.successPaginate(result, 'Deliveries retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all deliveries error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving deliveries', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
}