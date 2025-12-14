import { EntityRepository, Repository } from 'typeorm';
import { OrderItems } from '../models/OrderItems';

@EntityRepository(OrderItems)
export class OrderItemsRepository extends Repository<OrderItems> {}