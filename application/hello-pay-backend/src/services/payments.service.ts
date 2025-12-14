import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from '../models/Payments';
import { CreatePaymentDto } from '../models/dto/payments/create-payment.dto';
import { UpdatePaymentDto } from '../models/dto/payments/update-payment.dto';
import { ResponseHelper } from '../utils/response.helper';
import { paginateRepository } from '../utils/pagination.helper';
import { Installments } from '../models/Installments';
import {  } from '../utils/helper';
import { Users } from '../models/Users';
import { ProviderPaymentsService } from './provider-payments.service';
import { Orders } from '../models/Orders';
import {OrderPaymentPlan} from '../models/OrderPaymentPlan';
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payments)
    private readonly repository: Repository<Payments>,

    @InjectRepository(Installments)
    private readonly installmentsRepository: Repository<Installments>,

    private readonly providerPaymentsService: ProviderPaymentsService,

    @InjectRepository(Orders)
    private readonly ordersRepository:Repository<Orders>,

    @InjectRepository(OrderPaymentPlan)
    private readonly orderPaymentPlanRepository:Repository<OrderPaymentPlan>
  ) {}

  async create(dto: CreatePaymentDto,user: Users) {
    const date = new Date().toISOString();
    try {
      const installment = await this.installmentsRepository.findOne({
        where: { id: dto.installmentId },
      });
      if (!installment) {
        this.logger.warn(`[${date}] Installment not found: id=${dto.installmentId}`);
        return ResponseHelper.error('Installment not found', HttpStatus.NOT_FOUND);
      }

      if(installment.status == 'PAID'){
        this.logger.warn(`[${date}] Installment already paid: id=${dto.installmentId}`);
        return ResponseHelper.error('Installment already paid', HttpStatus.CONFLICT);
      }

      const payment_installement_pending = await this.repository.find({
        where: { installmentId: dto.installmentId, status: 'PENDING' },
      });

      const payment_installement_success = await this.repository.find({
        where: { installmentId: dto.installmentId, status: 'SUCCESS' },
      });

      if (payment_installement_success && payment_installement_success.length > 0) {
        this.logger.warn(`[${date}] Payment success is already exists for installment: id=${dto.installmentId}`);
        return ResponseHelper.error('Payment success is already exists for this installment', HttpStatus.CONFLICT);
      }else if(payment_installement_pending && payment_installement_pending.length>0 ){
        this.logger.warn(`[${date}] Payment is pending for installment: id=${dto.installmentId}`);
        return ResponseHelper.error('Installment has already paiement in pending', HttpStatus.CONFLICT);
        // await this.repository.remove(payment_installement_pending);
      }

      //Execute fonction pour payer via API de BPAY
      const result_api_payment = `TXN-HELLOPAY-${Math.floor(Math.random() * 555)}-${new Date().getFullYear().toString()}-${Math.floor(Math.random() * 1000)}`
      const payment_payload: any = {
        currency: 'XOF',
        payment_method: dto.payementType,
        merchant_transaction_id: result_api_payment,
        amount:parseInt(installment.amount),
        telephone: user.phone,
        success_url: this.providerPaymentsService.success_url,
        failed_url: this.providerPaymentsService.failed_url,
        notify_url: this.providerPaymentsService.notify_url,
        refercence_cl: this.providerPaymentsService.referenceCl,
      }

      if(dto.payementType == 'OM_CI'){
        payment_payload.otp_code = dto.code_otp;
      }
      const payment_api_response = await this.providerPaymentsService.initiatePaymentWithLogin(payment_payload);

      if(payment_api_response.success == false){
        this.logger.warn(`[${date}] Impossible to initiate the paiement: id=${result_api_payment}`);
        return ResponseHelper.error('Impossible to initiate the paiement', HttpStatus.INTERNAL_SERVER_ERROR, payment_api_response.message);
      }

      const payment = this.repository.create({
        userId: user.id,
        orderId: dto.orderId,
        installmentId: dto.installmentId ?? null,
        amount:installment.amount,
        payementType: dto.payementType,
        paymentMethod: dto.paymentMethod,
        transactionId: result_api_payment,
      });

      const saved = await this.repository.save(payment);
      var res = {...payment_api_response,payment:saved}
      this.logger.log(`[${date}] Create payment success: id=${saved.id}`);
      return ResponseHelper.success(res, 'Payment initiated successfully');
    } catch (error) {
      this.logger.error(`[${date}] Create payment error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error creating payment', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAll(user?: Users,transaction_id?:string) {
    const date = new Date().toISOString();
    try {
      console.log('user_connected_role',user?.role)
      const where = [];
      if(user && user.role === 'admin'){
        user = null;
      }else{
        where.push({ userId: user.id });
      }

      if (transaction_id) {
        where.push({ transactionId: transaction_id });
      }
      console.log(user,'user')
      const payments = await this.repository.find({
        where: where.length > 0 ? where : {},
        relations: ['order', 'user', 'installment'],
        order: { createdAt: 'DESC' as any },
      });

      this.logger.log(`[${date}] Get all payments success: count=${payments.length}`);
      return ResponseHelper.success(payments, 'Payments retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all payments error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving payments', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findOne(id: string) {
    const date = new Date().toISOString();
    try {
      const payment = await this.repository.findOne({
        where: { id },
        relations: ['order', 'user', 'installment'],
      });
      if (!payment) {
        this.logger.warn(`[${date}] Payment not found: id=${id}`);
        return ResponseHelper.error('Payment not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`[${date}] Get payment success: id=${id}`);
      return ResponseHelper.success(payment, 'Payment retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get payment error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving payment', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async cronTabFindStatus(){
    const date = new Date().toISOString();
    const payments = await this.repository.find({
        relations: ['order'],
        where: { status: 'PENDING' },
    });
    var payments_updated = [];
    for(var payment of payments){
      var id = payment.transactionId;
      if(id){
        const response_ = await this.findOneStatus(id);
        console.log('response_status',response_)
        payments_updated.push(id)
      }else{
        this.logger.warn(`[${date}] Payment not found: id=${id}`);
      }
    }
    return {success:true,message:'cron task done', data: payments_updated }
  }

  async findOneStatus(id: string) {
    const date = new Date().toISOString();
    try {
      const payment = await this.repository.findOne({
        relations: ['order.orderPaymentPlan'],
        where: { transactionId: id },
      });
      if (!payment) {
        this.logger.warn(`[${date}] Payment not found: id=${id}`);
        return ResponseHelper.error('Payment not found', HttpStatus.NOT_FOUND);
      }

      if(payment.status == 'PENDING'){
        const response_ = await this.providerPaymentsService.verifyStatusWithLogin(id);
        console.log('response_status',response_.message)
        if(response_.success == false){
          this.logger.warn(`[${date}] Impossible to verify the status of the payment: id=${id}`);
          return ResponseHelper.error('Impossible to verify the status of the payment', HttpStatus.INTERNAL_SERVER_ERROR, response_.message);
        }
        const status = response_.status;
        if(status != 'PENDING'){
          payment.status = status;
          await this.repository.save(payment);
          if(status == 'SUCCESS'){
            var installment = await this.installmentsRepository.findOne({
              where: { id: payment.installmentId },
            });
              installment.status = 'PAID';
              installment.paidAt = new Date();
              await this.installmentsRepository.save(installment);
              this.logger.log(`[${date}] Installment status updated to PAID: id=${installment.id}`);

               //start update orders and  orderPaymentPlan status to PARTIALLY_PAID and PAID
              var installment_rest = await this.installmentsRepository.find({
                where: { orderPaymentPlanId: payment.order.orderPaymentPlan.id, status: 'PENDING' },
              });
              if(installment_rest.length == 0){
                 //update orderPaymentPlan status to PAID
                var order = await this.ordersRepository.findOne({
                  where: { id: payment.order.id },
                });
                order.status = 'PAID';
                await this.ordersRepository.save(order);
                this.logger.log(`[${date}] Order status updated to PAID: id=${order.id}`);

                 //update orderPaymentPlan status to PAID
                var orderPaymentPlan = await this.orderPaymentPlanRepository.findOne({
                  where: { id: payment.order.orderPaymentPlan.id },
                });
                orderPaymentPlan.status = 'PAID';
                await this.orderPaymentPlanRepository.save(orderPaymentPlan);
                this.logger.log(`[${date}] OrderPaymentPlan status updated to PAID: id=${orderPaymentPlan.id}`);

              }else {
                var installment_paid = await this.installmentsRepository.find({
                  where: { orderPaymentPlanId: payment.order.orderPaymentPlan.id, status: 'PAID' },
                });
                if(installment_paid.length >= 1){
                   //update order status to PARTIALLY_PAID
                  var order = await this.ordersRepository.findOne({
                    where: { id: payment.order.id },
                  });
                  order.status = 'PARTIALLY_PAID';
                  await this.ordersRepository.save(order);
                  this.logger.log(`[${date}] Order status updated to PARTIALLY_PAID: id=${order.id}`);

                  //update orderPaymentPlan status to PARTIALLY_PAID
                  var orderPaymentPlan = await this.orderPaymentPlanRepository.findOne({
                    where: { id: payment.order.orderPaymentPlan.id },
                  });
                  orderPaymentPlan.status = 'PARTIALLY_PAID';
                  await this.orderPaymentPlanRepository.save(orderPaymentPlan);
                  this.logger.log(`[${date}] OrderPaymentPlan status updated to PARTIALLY_PAID: id=${orderPaymentPlan.id}`);
                }
              }
          }
        }else{
          console.log('TRANSACTION '+id, 'is Still on ',status)
        }
      }else{
        console.log(('PAYMENT STATUS IS NOT PENDING'))
      }
      this.logger.log(`[${date}] Get payment success: id=${id}`);

      const new_get_payment = await this.repository.findOne({
        relations: ['order.orderPaymentPlan'],
        where: { transactionId: id },
      });
      return ResponseHelper.success(new_get_payment, 'Payment retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get payment error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving payment', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }


  async callbackExecute(data: any) {
    const date = new Date().toISOString();
    try {
      const payment = await this.repository.findOne({
        relations: ['order.orderPaymentPlan'],
        where: { transactionId: data.transactionID },
      });
      if (!payment) {
        this.logger.warn(`[${date}] Payment not found: id=${data.transactionID}`);
        return ResponseHelper.error('Payment not found', HttpStatus.NOT_FOUND);
      }
      const status = data.status;
      payment.status = status;
      await this.repository.save(payment);
      if(status == 'SUCCESS'){
        console.log('TRANSACTION ENTER SUCCESS CASE')
        var installment = await this.installmentsRepository.findOne({
          where: { id: payment.installmentId },
        });
          installment.status = 'PAID';
          installment.paidAt = new Date();
          await this.installmentsRepository.save(installment);
          this.logger.log(`[${date}] Installment status updated to PAID: id=${installment.id}`);

            //start update orders and  orderPaymentPlan status to PARTIALLY_PAID and PAID
          var installment_rest = await this.installmentsRepository.find({
            where: { orderPaymentPlanId: payment.order.orderPaymentPlan.id, status: 'PENDING' },
          });
          if(installment_rest.length == 0){
              //update orderPaymentPlan status to PAID
            var order = await this.ordersRepository.findOne({
              where: { id: payment.order.id },
            });
            order.status = 'PAID';
            await this.ordersRepository.save(order);
            this.logger.log(`[${date}] Order status updated to PAID: id=${order.id}`);

              //update orderPaymentPlan status to PAID
            var orderPaymentPlan = await this.orderPaymentPlanRepository.findOne({
              where: { id: payment.order.orderPaymentPlan.id },
            });
            orderPaymentPlan.status = 'PAID';
            await this.orderPaymentPlanRepository.save(orderPaymentPlan);
            this.logger.log(`[${date}] OrderPaymentPlan status updated to PAID: id=${orderPaymentPlan.id}`);

          }else {
            var installment_paid = await this.installmentsRepository.find({
              where: { orderPaymentPlanId: payment.order.orderPaymentPlan.id, status: 'PAID' },
            });
            if(installment_paid.length >= 1){
                //update order status to PARTIALLY_PAID
              var order = await this.ordersRepository.findOne({
                where: { id: payment.order.id },
              });
              order.status = 'PARTIALLY_PAID';
              await this.ordersRepository.save(order);
              this.logger.log(`[${date}] Order status updated to PARTIALLY_PAID: id=${order.id}`);

              //update orderPaymentPlan status to PARTIALLY_PAID
              var orderPaymentPlan = await this.orderPaymentPlanRepository.findOne({
                where: { id: payment.order.orderPaymentPlan.id },
              });
              orderPaymentPlan.status = 'PARTIALLY_PAID';
              await this.orderPaymentPlanRepository.save(orderPaymentPlan);
              this.logger.log(`[${date}] OrderPaymentPlan status updated to PARTIALLY_PAID: id=${orderPaymentPlan.id}`);
            }
          }
      }else{
        console.log('TRANSACTION ENTER NO SUCCESS CASE')
        console.log('TRANSACTION '+data.transactionID, 'is on',status)
      }
      this.logger.log(`[${date}] Get payment success: id=${data.transactionID}`);
      const new_get_payment = await this.repository.findOne({
        relations: ['order.orderPaymentPlan'],
        where: { transactionId: data.transactionID },
      });
      return ResponseHelper.success(new_get_payment, 'Payment retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get payment error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving payment', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async update(id: string, dto: UpdatePaymentDto) {
    const date = new Date().toISOString();
    try {
      const payment = await this.repository.findOne({ where: { id } });
      if (!payment) {
        this.logger.warn(`[${date}] Payment not found for update: id=${id}`);
        return ResponseHelper.error('Payment not found', HttpStatus.NOT_FOUND);
      }

      payment.status = dto.status ?? payment.status;

      const saved = await this.repository.save(payment);

      this.logger.log(`[${date}] Update payment success: id=${id}`);
      return ResponseHelper.success(saved, 'Payment updated');
    } catch (error) {
      this.logger.error(`[${date}] Update payment error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error updating payment', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async remove(id: string) {
    const date = new Date().toISOString();
    try {
      const payment = await this.repository.findOne({ where: { id } });
      if (!payment) {
        this.logger.warn(`[${date}] Payment not found for delete: id=${id}`);
        return ResponseHelper.error('Payment not found', HttpStatus.NOT_FOUND);
      }

      await this.repository.remove(payment);

      this.logger.log(`[${date}] Delete payment success: id=${id}`);
      return ResponseHelper.success2({ id }, 'Payment deleted');
    } catch (error) {
      this.logger.error(`[${date}] Delete payment error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error deleting payment', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async findAllPaginate(page?: number, limit?: number,user?:Users,transaction_id?:string) {
    const date = new Date().toISOString();
    try {
      console.log('user_connected_role',user?.role)
      const where = [];
      if(user && user.role === 'admin'){
        user = null;
      }else{
        where.push({ userId: user.id });
      }

      if (transaction_id) {
        where.push({ transactionId: transaction_id });
      }
      console.log(user,'user')
      const result = await paginateRepository(this.repository, {
        page,
        limit,
        where: where.length > 0 ? where : {},
        relations: ['order', 'user', 'installment'],
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`[${date}] Get all payments success: count=${result.data.length}, page=${result.meta.page}`);
      return ResponseHelper.successPaginate(result, 'Payments retrieved');
    } catch (error) {
      this.logger.error(`[${date}] Get all payments error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error retrieving payments', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
}