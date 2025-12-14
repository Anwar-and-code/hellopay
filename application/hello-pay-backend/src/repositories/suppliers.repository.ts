import { EntityRepository, Repository } from 'typeorm';
import { Suppliers } from '../models/Suppliers';

@EntityRepository(Suppliers)
export class SuppliersRepository extends Repository<Suppliers> {}