import { IsString, IsEnum, IsOptional, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export enum OrderPaymentMode {
  COD = 'COD',
  INSTALLMENT = 'INSTALLMENT',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderDto {

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}