import { EntityRepository, Repository } from 'typeorm';
import { Products } from '../models/Products';

@EntityRepository(Products)
export class ProductsRepository extends Repository<Products> {}