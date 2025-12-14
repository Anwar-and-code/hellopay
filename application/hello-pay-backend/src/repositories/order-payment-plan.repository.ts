import { EntityRepository, Repository } from 'typeorm';
import { OrderPaymentPlan } from '../models/OrderPaymentPlan';

@EntityRepository(OrderPaymentPlan)
export class OrderPaymentPlanRepository extends Repository<OrderPaymentPlan> {}