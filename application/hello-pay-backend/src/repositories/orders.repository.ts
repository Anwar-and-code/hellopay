import { EntityRepository, Repository } from 'typeorm';
import { Orders } from '../models/Orders';

@EntityRepository(Orders)
export class OrdersRepository extends Repository<Orders> {}