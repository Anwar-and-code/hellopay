import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from '../models/Orders';
import { CreateOrderDto } from '../models/dto/orders/create-order.dto';
import { UpdateOrderDto } from '../models/dto/orders/update-order.dto';
import { ResponseHelper } from '../utils/response.helper';
import { paginateRepository } from '../utils/pagination.helper';
import { Products } from '../models/Products';
import { OrderItems } from '../models/OrderItems';
import { PaymentPlans } from '../models/PaymentPlans';
import { OrderPaymentPlan } from '../models/OrderPaymentPlan';
import { Installments } from '../models/Installments';
import { Users } from '../models/Users';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Orders)
    private readonly repository: Repository<Orders>,
    @InjectRepository(Products)
    private readonly repositoryProduct: Repository<Products>,
    @InjectRepository(OrderItems)
    private readonly repositoryOrderItems: Repository<OrderItems>,
    @InjectRepository(PaymentPlans)
    private readonly repositoryPaymentPlans: Repository<PaymentPlans>,
    @InjectRepository(OrderPaymentPlan)
    private readonly orderPaymentPlanRepository: Repository<OrderPaymentPlan>,

    @InjectRepository(Installments)
    private readonly installmentsRepository: Repository<Installments>,
  ) {}

  async create(dto: CreateOrderDto) {
    const date = new Date().toISOString();
    try {
      var orderItems_ = [];
      let totalAmountOrder = 0;

      for (const item of dto.orderItems) {
        item.product = await  this.repositoryProduct.findOne({
          where: { id: item.productId },
        });
        var amount = item.product.price * item.quantity;
        totalAmountOrder += amount;
        console.log(`product ${item.productId} | price=${item.product.price} | quantity=${item.quantity} | itemTotal=${item.product.price * item.quantity}`);
        orderItems_.push(item);
      }

      console.log("Total Amount Order",totalAmountOrder.toFixed(2));

      const code_order = `ORDER-${Math.floor(Math.random() * 555)}-${new Date().getFullYear().toString()}-${Math.floor(Math.random() * 1000)}`
      const order = this.repository.create({
        userId: dto.userId,
        totalAmount:totalAmountOrder.toFixed(2),
        paymentMode: dto.paymentMode,
        status: dto.status ?? undefined,
        code:code_order
      });
      const saved = await this.repository.save(order);
      console.log("Orders Saved",saved.id);
      for (const item of orderItems_) {
        const orderItems__ = this.repositoryOrderItems.create({
          orderId: saved.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })
        const savedOrderItems = await this.repositoryOrderItems.save(orderItems__);
        console.log("OrdersItems Saved",savedOrderItems.id);
      }

      const paymentPlan = await this.repositoryPaymentPlans.findOne({
        where: { id: dto.paymentPlanId },
      });
      if (!paymentPlan) {
        this.logger.warn(`[${date}] Payment plan not found: id=${dto.paymentPlanId}`);
        return ResponseHelper.error('Payment plan not found', HttpStatus.NOT_FOUND);
      }
      console.log("Payment Plan",paymentPlan);
      const orderPaymentPlan = this.orderPaymentPlanRepository.create({
        orderId: saved.id,
        paymentPlanId: dto.paymentPlanId,
        totalAmount: totalAmountOrder.toFixed(2)
      })
      const savedOrderPaymentPlan = await this.orderPaymentPlanRepository.save(orderPaymentPlan);
      console.log("OrderPaymentPlan Saved",savedOrderPaymentPlan.id);

     const intervalInDays = paymentPlan.intervalInDays;
     const startDate = new Date();
     let dueDate = new Date(startDate);
      for (let i = 0; i < paymentPlan.numberOfInstallments; i++) {
        if (i > 0) {
          dueDate.setDate(dueDate.getDate() + intervalInDays);
        }
        var installments = this.installmentsRepository.create({
          orderPaymentPlanId: savedOrderPaymentPlan.id,
          installmentNumber: i + 1,
          amount: (totalAmountOrder / paymentPlan.numberOfInstallments).toFixed(2),
          dueDate: dueDate,
        });
        const savedInstallments = await this.installmentsRepository.save(installments);
        console.log("savedInstallments",savedInstallments.id);
      }

      this.logger.log(`[${date}] Create order success: id=${saved.id}`);
      return ResponseHelper.success(saved, 'Order created');
    } catch (error) {
      this.logger.error(`[${date}] Create order error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error creating order', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAll(user?:Users,code?:string) {
    const date = new Date().toISOString();
    try {
      console.log('user_connected_role',user?.role)
      const where = [];
      if(user && user.role === 'admin'){
        user = null;
      }else{
        where.push({ userId: user.id });
      }

      if (code) {
        where.push({ code: code });
      }
      console.log(user,'user')
      const orders = await this.repository.find({
        where: where.length > 0 ? where : {},
        relations: ['user', 'orderItems', 'deliveries', 'payments', 'orderPaymentPlan.installments'],
        order: { createdAt: 'DESC' as any },
      });

      this.logger.log(`[${date}] Get all orders success: count=${orders.length}`);
      return ResponseHelper.success(orders, 'Orders retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all orders error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving orders', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findOne(id: string) {
    const date = new Date().toISOString();
    try {
      const order = await this.repository.findOne({
        where: { id },
        relations: ['user', 'orderItems', 'deliveries', 'payments', 'orderPaymentPlan.installments'],
      });
      if (!order) {
        this.logger.warn(`[${date}] Order not found: id=${id}`);
        return ResponseHelper.error('Order not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`[${date}] Get order success: id=${id}`);
      return ResponseHelper.success(order, 'Order retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get order error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving order', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async update(id: string, dto: UpdateOrderDto) {
    const date = new Date().toISOString();
    try {
      const order = await this.repository.findOne({ where: { id } });
      if (!order) {
        this.logger.warn(`[${date}] Order not found for update: id=${id}`);
        return ResponseHelper.error('Order not found', HttpStatus.NOT_FOUND);
      }

      // DTO d’update ne contient que le status, on l’applique
      order.status = dto.status ?? order.status;

      const saved = await this.repository.save(order);

      this.logger.log(`[${date}] Update order success: id=${id}`);
      return ResponseHelper.success(saved, 'Order updated');
    } catch (error) {
      this.logger.error(`[${date}] Update order error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error updating order', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async remove(id: string) {
    const date = new Date().toISOString();
    try {
      const order = await this.repository.findOne({ where: { id } });
      if (!order) {
        this.logger.warn(`[${date}] Order not found for delete: id=${id}`);
        return ResponseHelper.error('Order not found', HttpStatus.NOT_FOUND);
      }

      await this.repository.remove(order);

      this.logger.log(`[${date}] Delete order success: id=${id}`);
      return ResponseHelper.success2({ id }, 'Order deleted');
    } catch (error) {
      this.logger.error(`[${date}] Delete order error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error deleting order', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }


    async findAllPaginate(page?: number, limit?: number,user?:Users,code?:string) {
    const date = new Date().toISOString();
    try {

      console.log('user_connected_role',user?.role)
      const where = [];
      if(user && user.role === 'admin'){
        user = null;
      }else{
        where.push({ userId: user.id });
      }

      if (code) {
        where.push({ code: code });
      }
      console.log(user,'user')
      const result = await paginateRepository(this.repository, {
        page,
        limit,
        where: where.length > 0 ? where : {},
        order: { createdAt: 'DESC' },
        relations: ['user', 'orderItems', 'deliveries', 'payments.installment', 'orderPaymentPlan.installments']
      });

      this.logger.log(`[${date}] Get all orders success: count=${result.data.length}, page=${result.meta.page}`);
      return ResponseHelper.successPaginate(result, 'Orders retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all orders error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving orders', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
}