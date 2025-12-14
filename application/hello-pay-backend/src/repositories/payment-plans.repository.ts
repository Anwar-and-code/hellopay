import { EntityRepository, Repository } from 'typeorm';
import { PaymentPlans } from '../models/PaymentPlans';

@EntityRepository(PaymentPlans)
export class PaymentPlansRepository extends Repository<PaymentPlans> {}