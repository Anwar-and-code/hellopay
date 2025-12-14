import { Repository, SelectQueryBuilder } from 'typeorm';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

function normalizePageLimit(page?: number, limit?: number, maxLimit = 100) {
  const p = Math.max(1, Number(page) || 1);
  let l = Math.max(1, Number(limit) || 10);
  l = Math.min(maxLimit, l);
  return { p, l };
}

export async function paginateRepository<T>(
  repo: Repository<T>,
  opts?: {
    page?: number;
    limit?: number;
    maxLimit?: number;
    where?: any;
    order?: any;
    relations?: any;
    select?: any;
    mapFn?: (item: T) => any;
  },
): Promise<{ data: any[]; meta: PaginationMeta }> {
  const { p, l } = normalizePageLimit(opts?.page, opts?.limit, opts?.maxLimit ?? 100);
  const skip = (p - 1) * l;

  const [items, total] = await repo.findAndCount({
    skip,
    take: l,
    where: opts?.where,
    order: opts?.order,
    relations: opts?.relations,
    select: opts?.select,
  });

  const data = opts?.mapFn ? items.map(opts.mapFn) : (items as any[]);
  const totalPages = Math.max(1, Math.ceil(total / l));
  const meta: PaginationMeta = {
    total,
    page: p,
    limit: l,
    totalPages,
    hasNext: p < totalPages,
    hasPrev: p > 1,
  };

  return { data, meta };
}

export async function paginateQueryBuilder<T>(
  qb: SelectQueryBuilder<T>,
  opts?: {
    page?: number;
    limit?: number;
    maxLimit?: number;
    mapFn?: (item: T) => any;
  },
): Promise<{ data: any[]; meta: PaginationMeta }> {
  const { p, l } = normalizePageLimit(opts?.page, opts?.limit, opts?.maxLimit ?? 100);
  const skip = (p - 1) * l;

  const [items, total] = await qb.skip(skip).take(l).getManyAndCount();

  const data = opts?.mapFn ? items.map(opts.mapFn) : (items as any[]);
  const totalPages = Math.max(1, Math.ceil(total / l));
  const meta: PaginationMeta = {
    total,
    page: p,
    limit: l,
    totalPages,
    hasNext: p < totalPages,
    hasPrev: p > 1,
  };

  return { data, meta };
}