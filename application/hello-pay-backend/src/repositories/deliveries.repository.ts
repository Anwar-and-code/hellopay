import { EntityRepository, Repository } from 'typeorm';
import { Deliveries } from '../models/Deliveries';

@EntityRepository(Deliveries)
export class DeliveriesRepository extends Repository<Deliveries> {}