import { EntityRepository, Repository } from 'typeorm';
import { Payments } from '../models/Payments';

@EntityRepository(Payments)
export class PaymentsRepository extends Repository<Payments> {}