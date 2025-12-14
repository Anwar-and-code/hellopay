import { EntityRepository, Repository } from 'typeorm';
import { Installments } from '../models/Installments';

@EntityRepository(Installments)
export class InstallmentsRepository extends Repository<Installments> {}